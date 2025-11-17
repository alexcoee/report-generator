# Sistema de Gestão para Lojas de Varejo

## Visão Geral
Este é um sistema completo de gestão para lojas de varejo, desenvolvido com Node.js, Express e PostgreSQL. O sistema oferece gerenciamento de lojas, vendedores, relatórios, demandas e assistência técnica.

## Estrutura do Projeto

```
├── server.js                   # Servidor principal Express
├── src/
│   ├── config/                 # Configurações (database, security, etc.)
│   │   ├── db-adapter.js       # Adapter para PostgreSQL/SQLite
│   │   ├── database.js         # Configuração SQLite
│   │   ├── database-postgres.js # Configuração PostgreSQL
│   │   └── postgresql.js       # Pool de conexões PostgreSQL
│   ├── middleware/             # Middlewares customizados
│   ├── routes/                 # Rotas modulares
│   └── services/               # Serviços (logs, Google Drive, etc.)
├── public/                     # Frontend (CSS, JavaScript)
├── views/                      # Templates HTML
├── data/                       # Dados e arquivos gerados
└── scripts/                    # Scripts auxiliares
```

## Tecnologias Utilizadas

- **Backend**: Node.js + Express
- **Banco de Dados**: PostgreSQL / SQLite (fallback)
- **Frontend**: HTML5, CSS3, JavaScript + Bootstrap 5
- **Segurança**: bcrypt, JWT, helmet, express-session
- **Geração de Documentos**: PDFKit, ExcelJS
- **Integrações**: Google Drive API (opcional)

## Configuração

### Banco de Dados
O sistema usa PostgreSQL por padrão quando as variáveis de ambiente do Replit estão disponíveis. O schema é criado automaticamente na inicialização.

### Variáveis de Ambiente Importantes

- `PORT`: Porta do servidor (padrão: 5000)
- `NODE_ENV`: Ambiente de execução
- `SESSION_SECRET`: Secret para sessões (gerado automaticamente)
- `JWT_SECRET`: Secret para tokens JWT (gerado automaticamente)
- `DEV_TEMP_ACCESS`: Habilita acesso temporário de desenvolvimento

### Google Drive (Opcional)
Para habilitar backup no Google Drive, configure:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

## Credenciais Padrão

**Usuário**: `admin`  
**Senha**: `admin`

⚠️ **Importante**: Altere a senha após o primeiro acesso!

## Funcionalidades Principais

### 1. Gerenciamento de Lojas
- Cadastro completo de lojas
- Controle de status e informações
- Histórico de alterações

### 2. Controle de Vendedores
- Cadastro de vendedores por loja
- Gestão de equipe
- Controle de status (ativo/inativo)

### 3. Relatórios Gerenciais
- Geração automática de relatórios em PDF
- Exportação para Excel
- Processamento de PDFs (Omni e Busca Técnica)
- Análise de vendas e desempenho

### 4. Dashboard Executivo
- Métricas em tempo real
- Indicadores de conversão
- Gráficos comparativos

### 5. Assistência Técnica
- Abertura e acompanhamento de chamados
- Controle de estoque de peças
- Histórico de atendimentos

### 6. Sistema de Demandas
- Criação e gestão de demandas
- Controle de status
- Tags e categorização

## Endpoints Principais

### Autenticação
- `POST /api/login` - Login de usuário
- `GET /api/session` - Informações da sessão

### Lojas
- `GET /api/lojas` - Listar lojas
- `POST /api/lojas` - Criar loja
- `PUT /api/lojas/:id` - Atualizar loja
- `DELETE /api/lojas/:id` - Deletar loja

### Relatórios
- `GET /api/relatorios` - Listar relatórios
- `POST /api/relatorios` - Criar relatório
- `POST /api/process-pdf` - Processar PDF

### Demandas
- `GET /api/demandas` - Listar demandas
- `POST /api/demandas` - Criar demanda
- `PUT /api/demandas/:id` - Atualizar demanda

## Segurança

### Autenticação e Autorização
- Sessões seguras com express-session
- Senhas hasheadas com bcrypt
- Tokens JWT para acesso temporário
- Rate limiting em endpoints sensíveis
- Helmet para proteção de headers

### Roles de Usuário
- **admin**: Acesso total ao sistema
- **monitoramento**: Acesso a relatórios e monitoramento
- **gerente**: Gestão de loja específica
- **consultor**: Consulta de informações
- **tecnico**: Assistência técnica
- **dev**: Acesso de desenvolvimento

### Auditoria
- Log de todas as ações mutantes (POST, PUT, DELETE)
- Rastreamento de IP e user agent
- Histórico completo de alterações

## Desenvolvimento

### Instalação Local
```bash
npm install
npm start
```

### Acesso Temporário de Desenvolvimento
O sistema suporta tokens JWT temporários para desenvolvimento. Configure `DEV_TEMP_ACCESS=true` apenas em ambiente de desenvolvimento.

### Migrações de Banco de Dados
O schema PostgreSQL é criado automaticamente. Para SQLite, veja `src/config/database.js`.

## Notas Importantes

### Performance
- Pool de conexões PostgreSQL configurado (máx: 20)
- Índices otimizados para queries frequentes
- Cache de sessões

### Backup
- Sistema de backup automático (opcional)
- Integração com Google Drive
- Backups locais em `data/backups/`

### Logs
- Sistema de logs centralizado
- Níveis: info, error, security, audit
- Rotação automática

## Arquitetura de Dados

### Principais Tabelas
- `usuarios` - Usuários do sistema
- `lojas` - Cadastro de lojas
- `vendedores` - Vendedores por loja
- `relatorios` - Relatórios de vendas
- `demandas` - Demandas e chamados
- `assistencias` - Assistência técnica
- `logs` - Auditoria e logs
- `temp_tokens` - Tokens temporários

## Troubleshooting

### Servidor não inicia
1. Verifique as variáveis de ambiente
2. Confirme conexão com PostgreSQL
3. Revise os logs em `/tmp/logs/`

### Erro de autenticação
1. Verifique credenciais padrão (admin/admin)
2. Confirme que a tabela `usuarios` existe
3. Verifique SESSION_SECRET e JWT_SECRET

### Problemas com PDF
1. Confirme formato do PDF (Omni ou Busca Técnica)
2. Verifique encoding do arquivo
3. Revise logs de processamento

## Manutenção

### Limpeza de Dados
- Logs antigos podem ser removidos manualmente
- Backups devem ser gerenciados periodicamente
- Tokens expirados são automaticamente ignorados

### Monitoramento
- Dashboard de banco de dados em `/monitor-db`
- Logs do sistema em `/logs`
- Métricas de performance disponíveis

## Suporte

Para dúvidas ou problemas:
1. Consulte a documentação em `docs/`
2. Verifique os logs do sistema
3. Revise o código-fonte comentado

---

**Desenvolvido para otimizar a gestão de varejo** 🏪
