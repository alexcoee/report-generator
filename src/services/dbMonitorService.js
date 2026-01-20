const os = require('os');
const dbAdapter = require('../config/db-adapter');

function queryAll(sql, params = []) {
    const db = dbAdapter.getDatabase();
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows || []);
        });
    });
}

function queryGet(sql, params = []) {
    const db = dbAdapter.getDatabase();
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

async function getConnectionStatus() {
    return {
        connected: true,
        provider: 'sqlite',
        host: 'local',
    };
}

async function getTableStats() {
    const tables = await queryAll(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    const stats = [];
    for (const table of tables) {
        const row = await queryGet(`SELECT COUNT(*) as count FROM ${table.name}`);
        stats.push({ table: table.name, count: row ? row.count : 0 });
    }
    return stats;
}

async function getRecentLogs(limit = 10) {
    return queryAll('SELECT * FROM logs ORDER BY timestamp DESC LIMIT ?', [limit]);
}

async function getBackupHistory() {
    return [];
}

async function getSystemInfo() {
    return {
        platform: os.platform(),
        release: os.release(),
        uptime: os.uptime(),
        cpuCount: os.cpus().length,
        memoryTotal: os.totalmem(),
        memoryFree: os.freemem(),
        nodeVersion: process.version,
    };
}

module.exports = {
    getConnectionStatus,
    getTableStats,
    getRecentLogs,
    getBackupHistory,
    getSystemInfo,
};
