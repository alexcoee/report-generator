const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const DB_PATH = path.join(dataDir, 'database.sqlite');
let db;

const schemaStatements = [
    `CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        password_hashed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS lojas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        gerente TEXT,
        status TEXT DEFAULT 'ativo',
        numero_contato TEXT,
        cep TEXT,
        observacoes TEXT,
        cargo TEXT,
        funcao_especial INTEGER DEFAULT 0,
        tecnico_username TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS relatorios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        loja TEXT NOT NULL,
        data TEXT NOT NULL,
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
        enviado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS demandas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        loja_nome TEXT NOT NULL,
        descricao TEXT NOT NULL,
        tag TEXT,
        status TEXT DEFAULT 'pendente',
        criado_por_usuario TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        concluido_por_usuario TEXT,
        concluido_em DATETIME
    )`,
    `CREATE TABLE IF NOT EXISTS assistencias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        loja TEXT,
        numero_pedido TEXT,
        cliente_nome TEXT,
        cliente_cpf TEXT,
        aparelho TEXT,
        peca_id TEXT,
        peca_nome TEXT,
        tecnico_responsavel TEXT,
        data_entrada TEXT,
        data_saida TEXT,
        data_conclusao TEXT,
        defeito_reclamado TEXT,
        valor_peca_loja REAL,
        valor_servico_cliente REAL,
        observacoes TEXT,
        status TEXT DEFAULT 'pendente',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS estoque_tecnico (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_peca TEXT NOT NULL,
        codigo_interno TEXT,
        quantidade INTEGER DEFAULT 0,
        valor_custo REAL,
        loja TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS pdf_rankings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        loja TEXT,
        data TEXT,
        filename TEXT,
        filepath TEXT,
        uploaded_by TEXT,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        atendimento_medio REAL,
        preco_medio REAL,
        pa REAL
    )`,
    `CREATE TABLE IF NOT EXISTS pdf_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        loja TEXT,
        data TEXT,
        filename TEXT,
        filepath TEXT,
        uploaded_by TEXT,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS temp_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        criado_por TEXT,
        expira_em DATETIME,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip_origem TEXT,
        ip_restrito TEXT,
        usado_em DATETIME,
        revogado INTEGER DEFAULT 0,
        revogado_em DATETIME,
        revogado_por TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        username TEXT,
        action TEXT,
        details TEXT,
        ip_address TEXT,
        user_agent TEXT,
        event_type TEXT,
        route TEXT,
        payload_hash TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
];

function initDatabase(callback) {
    db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            return callback(err);
        }

        db.serialize(() => {
            schemaStatements.forEach((statement) => db.run(statement));

            db.get('SELECT COUNT(*) as total FROM usuarios', (countErr, row) => {
                if (!countErr && row.total === 0) {
                    db.run(
                        'INSERT INTO usuarios (username, password, password_hashed) VALUES (?, ?, 0)',
                        ['admin', 'admin']
                    );
                }
                callback(null);
            });
        });
    });
}

function getDatabase() {
    return db;
}

module.exports = {
    DB_PATH,
    initDatabase,
    getDatabase,
};
