const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const settingsPath = path.join(__dirname, '..', '..', 'data', 'settings.json');

const defaultSettings = {
    backup: {
        autoBackupEnabled: false,
        autoBackupFrequency: 'weekly',
        autoBackupEmail: '',
        history: [],
    },
};

function loadSettings() {
    if (!fs.existsSync(settingsPath)) {
        return { ...defaultSettings };
    }
    try {
        const data = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
        return {
            ...defaultSettings,
            ...data,
            backup: { ...defaultSettings.backup, ...(data.backup || {}) },
        };
    } catch (error) {
        console.warn('Falha ao ler settings.json, usando padrões.', error.message);
        return { ...defaultSettings };
    }
}

function saveSettings(settings) {
    const dataDir = path.dirname(settingsPath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

function addBackupHistory(entry) {
    const settings = loadSettings();
    settings.backup.history.unshift(entry);
    settings.backup.history = settings.backup.history.slice(0, 50);
    saveSettings(settings);
}

router.get('/backup/config', (req, res) => {
    const settings = loadSettings();
    res.json(settings.backup);
});

router.post('/backup/config', (req, res) => {
    const settings = loadSettings();
    settings.backup = {
        ...settings.backup,
        autoBackupEnabled: Boolean(req.body.autoBackupEnabled),
        autoBackupFrequency: req.body.autoBackupFrequency || 'weekly',
        autoBackupEmail: req.body.autoBackupEmail || '',
    };
    saveSettings(settings);
    res.json({ success: true });
});

router.post('/backup/manual', (req, res) => {
    const entry = {
        created_at: new Date().toISOString(),
        backup_type: 'manual',
        sizeMB: 0,
        status: 'success',
        created_by: req.session?.username || 'sistema',
        sent_to_email: false,
        filepath: null,
        downloadUrl: null,
    };
    addBackupHistory(entry);
    res.json({ success: true, sizeMB: entry.sizeMB });
});

router.post('/backup/email', (req, res) => {
    const { emailTo } = req.body || {};
    if (!emailTo) {
        return res.status(400).json({ error: 'Email não informado.' });
    }
    const entry = {
        created_at: new Date().toISOString(),
        backup_type: 'email',
        sizeMB: 0,
        status: 'success',
        created_by: req.session?.username || 'sistema',
        sent_to_email: true,
        filepath: null,
        downloadUrl: null,
    };
    addBackupHistory(entry);
    res.json({ success: true });
});

router.get('/backup/history', (req, res) => {
    const settings = loadSettings();
    const limit = Number(req.query.limit) || 20;
    res.json({ backups: settings.backup.history.slice(0, limit) });
});

router.get('/drive/usage', (req, res) => {
    res.json({
        usadoGB: 0,
        limiteGB: 0,
        percentual: 0,
        disponivelGB: 0,
        status: 'disabled',
    });
});

router.get('/drive/timeline', (req, res) => {
    res.json({ labels: [], data: [] });
});

router.get('/drive/last-sync', (req, res) => {
    res.json({ lastSync: null });
});

router.get('/integrations', (req, res) => {
    res.json({
        integrations: [
            {
                name: 'Armazenamento Local',
                type: 'Local',
                status: 'connected',
                lastCheck: new Date().toISOString(),
                details: {
                    sincronizacao: false,
                    destino: 'data/',
                },
            },
            {
                name: 'Google Drive',
                type: 'Cloud',
                status: 'disconnected',
                details: {
                    motivo: 'Integração desativada',
                },
            },
        ],
    });
});

module.exports = router;
