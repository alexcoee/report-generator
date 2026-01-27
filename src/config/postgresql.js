const fs = require('fs');
const path = require('path');

const { DB_PATH } = require('./db-adapter');

async function getDatabaseSize() {
  try {
    const stats = fs.statSync(DB_PATH);
    return stats.size || 0;
  } catch (err) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

module.exports = {
  getDatabaseSize,
  formatBytes,
};

