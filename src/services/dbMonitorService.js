const fs = require('fs');
const path = require('path');

const dbAdapter = require('../config/db-adapter');

const runtimeRoot = process.pkg ? path.dirname(process.execPath) : process.cwd();
const appDataRoot = process.env.LOCALAPPDATA
  ? path.join(process.env.LOCALAPPDATA, 'SistemaRelatorios')
  : runtimeRoot;
const dataDir = path.join(appDataRoot, 'data');
const backupHistoryPath = path.join(dataDir, 'backup-history.json');

const TABLES = [
  'usuarios',
  'lojas',
  'relatorios',
  'demandas',
  'assistencias',
  'estoque_tecnico',
  'temp_tokens',
  'logs',
  'pdf_rankings',
  'pdf_tickets',
];

function getDb() {
  const db = dbAdapter.getDatabase();
  if (!db) {
    throw new Error('Banco de dados nao inicializado.');
  }
  return db;
}

function allAsync(sql, params = []) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

function getAsync(sql, params = []) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

async function getConnectionStatus() {
  try {
    await getAsync('SELECT 1 as ok');
    return {
      connected: true,
      provider: 'sqlite',
      host: 'local',
    };
  } catch (err) {
    return {
      connected: false,
      provider: 'sqlite',
      host: 'local',
    };
  }
}

async function getTableStats() {
  const results = [];
  for (const table of TABLES) {
    try {
      const row = await getAsync(`SELECT COUNT(*) as count FROM ${table}`);
      results.push({ name: table, count: row?.count || 0 });
    } catch (err) {
      results.push({ name: table, count: 0 });
    }
  }
  return results;
}

async function getRecentLogs(limit = 10) {
  try {
    const rows = await allAsync(
      `SELECT type, action, details, username, created_at
       FROM logs
       ORDER BY datetime(created_at) DESC
       LIMIT ?`,
      [limit]
    );
    return rows.map((r) => ({
      type: r.type || 'info',
      action: r.action || 'acao',
      details: r.details || '',
      username: r.username || 'local',
      timestamp: r.created_at || new Date().toISOString(),
    }));
  } catch (err) {
    return [];
  }
}

function loadBackupHistory() {
  try {
    if (!fs.existsSync(backupHistoryPath)) return [];
    const raw = fs.readFileSync(backupHistoryPath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

async function getBackupHistory(limit = 10) {
  const history = loadBackupHistory();
  return history.slice(0, limit).map((b) => ({
    created_at: b.created_at || new Date().toISOString(),
    backup_type: b.backup_type || 'manual',
    sent_to_email: Boolean(b.sent_to_email),
    size_bytes: b.size_bytes || 0,
  }));
}

async function getSystemInfo() {
  const smtpConfigured = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
  return {
    database: 'SQLite local',
    server: `Node ${process.version}`,
    emailConfigured: smtpConfigured,
    googleDriveConfigured: false,
  };
}

module.exports = {
  getConnectionStatus,
  getTableStats,
  getRecentLogs,
  getBackupHistory,
  getSystemInfo,
};

