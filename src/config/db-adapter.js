const fs = require('fs');
const path = require('path');
let db;

const runtimeRoot = process.pkg ? path.dirname(process.execPath) : process.cwd();
const appDataRoot = process.env.LOCALAPPDATA
  ? path.join(process.env.LOCALAPPDATA, 'SistemaRelatorios')
  : runtimeRoot;
const dataDir = path.join(appDataRoot, 'data');
const DB_PATH = path.join(dataDir, 'database.sqlite');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function logStartupError(message) {
  try {
    ensureDataDir();
    const logPath = path.join(dataDir, 'startup.log');
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${message}\n`);
  } catch (err) {
    // Ignora erro de log
  }
}

function initDatabase(callback) {
  ensureDataDir();

  let sqlite3;
  try {
    sqlite3 = require('sqlite3').verbose();
  } catch (err) {
    logStartupError(`Falha ao carregar sqlite3: ${err.message}`);
    return callback(err);
  }

  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      logStartupError(`Erro ao abrir DB: ${err.message}`);
      return callback(err);
    }
    createTables((createErr) => {
      if (createErr) {
        logStartupError(`Erro ao criar tabelas: ${createErr.message}`);
      }
      callback(createErr);
    });
  });
}

function createTables(callback) {
  const schema = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      password_hashed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS lojas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT UNIQUE,
      status TEXT,
      gerente TEXT,
      cargo TEXT,
      tecnico_username TEXT,
      funcao_especial TEXT,
      numero_contato TEXT,
      cep TEXT,
      observacoes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS relatorios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      loja TEXT,
      data TEXT,
      hora_abertura TEXT,
      hora_fechamento TEXT,
      gerente_entrada TEXT,
      gerente_saida TEXT,
      clientes_monitoramento INTEGER DEFAULT 0,
      vendas_monitoramento INTEGER DEFAULT 0,
      clientes_loja INTEGER DEFAULT 0,
      vendas_loja INTEGER DEFAULT 0,
      total_vendas_dinheiro REAL DEFAULT 0,
      ticket_medio TEXT,
      pa TEXT,
      quantidade_trocas INTEGER DEFAULT 0,
      quantidade_omni INTEGER DEFAULT 0,
      quantidade_funcao_especial INTEGER DEFAULT 0,
      vendedores TEXT,
      enviado_por_usuario TEXT,
      vendas_cartao INTEGER DEFAULT 0,
      vendas_pix INTEGER DEFAULT 0,
      vendas_dinheiro INTEGER DEFAULT 0,
      enviado_em TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS demandas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      loja_nome TEXT,
      descricao TEXT,
      tag TEXT,
      status TEXT DEFAULT 'pendente',
      criado_por_usuario TEXT,
      criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
      concluido_por_usuario TEXT,
      concluido_em TEXT
    );

    CREATE TABLE IF NOT EXISTS assistencias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_nome TEXT,
      cliente_cpf TEXT,
      numero_pedido TEXT,
      data_entrada TEXT,
      data_conclusao TEXT,
      data_saida TEXT,
      valor_peca_loja REAL DEFAULT 0,
      valor_servico_cliente REAL DEFAULT 0,
      aparelho TEXT,
      peca_id INTEGER,
      peca_nome TEXT,
      observacoes TEXT,
      tecnico_responsavel TEXT,
      loja TEXT,
      status TEXT DEFAULT 'Em andamento',
      defeito_reclamado TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS estoque_tecnico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_peca TEXT,
      codigo_interno TEXT UNIQUE,
      quantidade INTEGER DEFAULT 0,
      valor_custo REAL DEFAULT 0,
      loja TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS temp_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token_hash TEXT UNIQUE,
      role TEXT,
      expira_em TEXT,
      ip_origem TEXT,
      ip_restrito TEXT,
      criado_por TEXT,
      criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
      usado_em TEXT,
      revogado INTEGER DEFAULT 0,
      revogado_em TEXT,
      revogado_por TEXT
    );

    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      event_type TEXT,
      username TEXT,
      action TEXT,
      details TEXT,
      route TEXT,
      ip_address TEXT,
      user_agent TEXT,
      payload_hash TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pdf_rankings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      loja TEXT,
      data TEXT,
      filename TEXT,
      filepath TEXT,
      uploaded_by TEXT,
      uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
      pa TEXT,
      preco_medio TEXT,
      atendimento_medio TEXT
    );

    CREATE TABLE IF NOT EXISTS pdf_tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      loja TEXT,
      data TEXT,
      filename TEXT,
      filepath TEXT,
      uploaded_by TEXT,
      uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.exec(schema, (err) => {
    if (err) return callback(err);
    callback(null);
  });
}

function getDatabase() {
  return db;
}

module.exports = {
  DB_PATH,
  initDatabase,
  getDatabase
};
