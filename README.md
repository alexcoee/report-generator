<div align="center">

# Sistema de Gestão para Lojas de Varejo

### Plataforma completa para gerenciamento inteligente de operações comerciais

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

[Recursos](#-recursos) • [Instalação](#-instalação-rápida) • [Tecnologias](#-tecnologias) • [Documentação](#-documentação)

</div>

---

## Visão Geral

Sistema web desenvolvido para otimizar a gestão de lojas de varejo, oferecendo controle completo  obre vendas, equipe, relatórios e operações do dia a dia, utilizado para comparar dados fornecido pela loja e dados fornecidos pela equipe de monitoramento de câmeras.

## Recursos

<table>
<tr>
<td width="50%">

### Dashboard Executivo
- Métricas em tempo real
- Indicadores de desempenho
- Gráficos comparativos
- Filtros personalizados

</td>
<td width="50%">

### Gestão de Lojas
- Cadastro completo de unidades
- Controle de status
- Informações detalhadas
- Histórico de alterações

</td>
</tr>
<tr>
<td width="50%">

### Controle de Vendedores
- Gerenciamento de equipe
- Acompanhamento de desempenho
- Registro de entrada/saída
- Status ativo/inativo

</td>
<td width="50%">

### Relatórios Gerenciais
- Geração automática em PDF
- Exportação para Excel
- Processamento inteligente
- Análise de vendas

</td>
</tr>
<tr>
<td width="50%">

</td>
<td width="50%">

### Sistema de Demandas
- Criação de tarefas
- Controle de status
- Tags e categorização
- Acompanhamento completo

</td>
</tr>
</table>

## Instalação Rápida

```bash
# Clone o repositório
git clone (clone esse repositório) 

# Entre no diretório
cd (local onde voce salvou) 

# Instale as dependências
npm install

# Inicie o servidor
npm start
```

Acesse: **http://localhost:5000**

### 🔑 Primeiro Acesso

```
Usuário: admin
Senha: admin
```

>  **Segurança**: Altere a senha padrão imediatamente após o primeiro acesso.

## Tecnologias

<div align="center">

| Categoria | Tecnologias |
|-----------|------------|
| **Backend** | Node.js, Express.js |
| **Banco de Dados** | PostgreSQL, SQLite |
| **Frontend** | HTML5, CSS3, JavaScript, Bootstrap 5 |
| **Segurança** | bcrypt, JWT, Helmet, Express-Session |
| **Documentos** | PDFKit, ExcelJS |
| **Integração** | Google Drive API, Multer |

</div>

## Estrutura

```
sistema-gestao-lojas/
├── server.js              # Servidor principal
├── package.json           # Dependências
├── .env.example           # Configurações
├── 📂 src/                   # Código fonte
│   ├── config/               # Configurações
│   ├── middleware/           # Autenticação e segurança
│   ├── routes/               # Rotas da API
│   └── services/             # Serviços
├── 📂 public/                # Frontend
│   ├── css/                  # Estilos
│   └── js/                   # JavaScript
├── 📂 views/                 # Páginas HTML
└── 📂 data/                  # Dados e relatórios
```

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
PORT=5000
NODE_ENV=production
SESSION_SECRET=sua-chave-secreta
JWT_SECRET=sua-chave-jwt
AUTO_OPEN_BROWSER=true
LOCAL_DOMAIN=monitoramento.local
```

### Banco de Dados

O sistema suporta PostgreSQL e SQLite:

- **PostgreSQL**: Configuração automática com variáveis de ambiente
- **SQLite**: Fallback local para desenvolvimento

### Funcionalidades Opcionais

#### Google Drive Backup
Configure credenciais OAuth 2.0 para backup automático na nuvem.

#### Integração DVR/NVR
Suporte para sistemas Intelbras de monitoramento.

### Atalho de Acesso Local (domínio personalizado)

Se quiser acessar o sistema usando um domínio local amigável (ex.: `monitoramento.local`), adicione esse domínio no arquivo hosts apontando para `127.0.0.1` e defina `LOCAL_DOMAIN` no `.env`.  
Quando `AUTO_OPEN_BROWSER=true`, o sistema abre o navegador automaticamente no domínio configurado ao iniciar.

## Segurança

- Senhas com hash bcrypt
- Autenticação JWT
- Proteção CSRF
- Rate limiting
- Helmet security headers
- Auditoria completa de ações
- Controle de acesso por roles

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

Este projeto é para estudos.

## Suporte

Para suporte técnico ou dúvidas:
- Consulte a documentação
- Verifique os logs do sistema
- Entre em contato com o administrador

---

<div align="center">

**Desenvolvido para otimizar a gestão de varejo**

</div>
