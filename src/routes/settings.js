const archiver = require('archiver');
const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');

const { DB_PATH } = require('../config/db-adapter');

const router = express.Router();

const runtimeRoot = process.pkg ? path.dirname(process.execPath) : process.cwd();
const appDataRoot = process.env.LOCALAPPDATA
  ? path.join(process.env.LOCALAPPDATA, 'SistemaRelatorios')
  : runtimeRoot;
const dataDir = path.join(appDataRoot, 'data');
const backupsDir = path.join(dataDir, 'backups');
const settingsPath = path.join(dataDir, 'settings.json');
const backupHistoryPath = path.join(dataDir, 'backup-history.json');
const smtpConfigPath = path.join(dataDir, 'smtp-config.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return fallback;
  }
}

function saveJson(filePath, payload) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
}

function getDefaultBackupConfig() {
  return {
    autoBackupEnabled: false,
    autoBackupFrequency: 'weekly',
    autoBackupEmail: ''
  };
}

function getDefaultSmtpConfig() {
  return {
    host: '',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    from: ''
  };
}

function appendBackupHistory(entry) {
  const history = loadJson(backupHistoryPath, []);
  history.unshift(entry);
  saveJson(backupHistoryPath, history.slice(0, 200));
}

function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate())
  ].join('') + '-' + [
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join('');
}

async function createBackupZip() {
  if (!fs.existsSync(DB_PATH)) {
    throw new Error('Banco de dados nao encontrado.');
  }

  ensureDir(backupsDir);

  const filename = `backup-${getTimestamp()}.zip`;
  const zipPath = path.join(backupsDir, filename);

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      const sizeBytes = archive.pointer();
      resolve({
        filename,
        zipPath,
        sizeBytes,
        sizeMB: Math.max(0.01, sizeBytes / (1024 * 1024))
      });
    });

    output.on('error', reject);
    archive.on('error', reject);

    archive.pipe(output);
    archive.file(DB_PATH, { name: 'database.sqlite' });
    archive.finalize();
  });
}

function loadSmtpConfig() {
  const fileConfig = loadJson(smtpConfigPath, null);
  if (fileConfig && fileConfig.host && fileConfig.user && fileConfig.pass) {
    const port = parseInt(String(fileConfig.port || 587), 10);
    const secure = Boolean(fileConfig.secure) || port === 465;
    return {
      host: fileConfig.host,
      port,
      secure,
      user: fileConfig.user,
      pass: fileConfig.pass,
      from: fileConfig.from || fileConfig.user
    };
  }

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const from = process.env.EMAIL_REMETENTE || user;

  if (!host || !user || !pass) {
    return null;
  }

  return { host, port, user, pass, secure, from };
}

router.get('/backup/config', (req, res) => {
  const config = loadJson(settingsPath, getDefaultBackupConfig());
  res.json(config);
});

router.post('/backup/config', (req, res) => {
  const payload = {
    ...getDefaultBackupConfig(),
    ...req.body
  };
  saveJson(settingsPath, payload);
  res.json({ success: true });
});

router.get('/email/config', (req, res) => {
  const smtp = loadJson(smtpConfigPath, getDefaultSmtpConfig());
  res.json({
    ...getDefaultSmtpConfig(),
    ...smtp,
    pass: smtp.pass ? '********' : ''
  });
});

router.post('/email/config', (req, res) => {
  const current = loadJson(smtpConfigPath, getDefaultSmtpConfig());
  const next = {
    ...getDefaultSmtpConfig(),
    ...current,
    ...req.body
  };

  if (next.pass === '********') {
    next.pass = current.pass || '';
  }

  next.port = parseInt(String(next.port || 587), 10);
  next.secure = Boolean(next.secure) || next.port === 465;

  saveJson(smtpConfigPath, next);
  res.json({ success: true });
});

router.post('/email/test', async (req, res) => {
  const smtp = loadSmtpConfig();
  const emailTo = req.body?.emailTo || smtp?.user;
  if (!smtp) {
    return res.status(400).json({
      error: 'SMTP nao configurado. Preencha os campos de email nas configuracoes.'
    });
  }

  if (!emailTo) {
    return res.status(400).json({ error: 'Email de teste nao informado' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass
      }
    });

    await transporter.sendMail({
      from: smtp.from,
      to: emailTo,
      subject: 'Teste de email - Sistema de Relatorios',
      text: 'Se voce recebeu esta mensagem, a configuracao SMTP esta funcionando.'
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/backup/manual', async (req, res) => {
  try {
    const backup = await createBackupZip();
    const entry = {
      created_at: new Date().toISOString(),
      backup_type: 'manual',
      size_bytes: backup.sizeBytes,
      sizeMB: Number(backup.sizeMB.toFixed(2)),
      status: 'success',
      created_by: req.session?.username || 'local',
      sent_to_email: false,
      filepath: backup.zipPath,
      downloadUrl: ''
    };

    appendBackupHistory(entry);
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/backup/email', async (req, res) => {
  const emailTo = req.body?.emailTo;
  if (!emailTo) {
    return res.status(400).json({ error: 'Email nao informado' });
  }

  const smtp = loadSmtpConfig();
  if (!smtp) {
    return res.status(400).json({
      error: 'SMTP nao configurado. Preencha os campos de email nas configuracoes.'
    });
  }

  try {
    const backup = await createBackupZip();
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass
      }
    });

    await transporter.sendMail({
      from: smtp.from,
      to: emailTo,
      subject: 'Backup do sistema',
      text: 'Segue em anexo o backup do banco de dados.',
      attachments: [
        {
          filename: backup.filename,
          path: backup.zipPath
        }
      ]
    });

    const entry = {
      created_at: new Date().toISOString(),
      backup_type: 'email',
      size_bytes: backup.sizeBytes,
      sizeMB: Number(backup.sizeMB.toFixed(2)),
      status: 'success',
      created_by: req.session?.username || 'local',
      sent_to_email: true,
      filepath: backup.zipPath,
      downloadUrl: ''
    };

    appendBackupHistory(entry);
    res.json({ success: true, email: emailTo });
  } catch (error) {
    const entry = {
      created_at: new Date().toISOString(),
      backup_type: 'email',
      size_bytes: 0,
      sizeMB: 0,
      status: 'error',
      created_by: req.session?.username || 'local',
      sent_to_email: false,
      filepath: '',
      downloadUrl: ''
    };
    appendBackupHistory(entry);
    res.status(500).json({ error: error.message });
  }
});

router.get('/backup/history', (req, res) => {
  const history = loadJson(backupHistoryPath, []);
  res.json({ backups: history });
});

router.get('/integrations', (req, res) => {
  res.json({ integrations: [] });
});

module.exports = router;
