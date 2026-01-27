# Gerador de Relatorios (Local)

Sistema web local para dashboard, relatorios e rotinas operacionais.

## Requisitos
- Node.js 18+
- NPM

## Rodando localmente
```bash
npm install
npm start
```

Acesse: http://localhost:5000

## Configuracao (.env)
Crie um arquivo `.env` na raiz (opcional):
```env
PORT=5000
NODE_ENV=production
SESSION_SECRET=uma-chave-forte
JWT_SECRET=outra-chave-forte
AUTO_OPEN_BROWSER=true
LOCAL_DOMAIN=localhost
```

## Email para backup (SMTP)
Agora a configuracao de SMTP e feita pela interface:
- Abra `http://localhost:5000/gerenciar-usuarios`
- Va em Configuracoes -> Backup
- Preencha o bloco "Email (SMTP)"

Os dados ficam salvos localmente em:
`%LOCALAPPDATA%\SistemaRelatorios\data\smtp-config.json`

## Estrutura principal
- `server.js` - servidor Express
- `views/` - paginas HTML
- `public/` - CSS e JS
- `src/` - rotas, servicos e config

## Observacoes
- Este projeto esta focado em execucao local.
- A etapa de instalador/EXE foi removida por enquanto.
