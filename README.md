<div align="center">

# 🏪 Sistema de Gestão para Lojas de Varejo

### Plataforma completa para gerenciamento inteligente de operações comerciais

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

[Recursos](#-recursos) • [Instalação](#-instalação-rápida) • [Tecnologias](#-tecnologias) • [Documentação](#-documentação)

</div>

---

## 📋 Visão Geral

Sistema web profissional desenvolvido para otimizar a gestão de lojas de varejo, oferecendo controle completo sobre vendas, equipe, relatórios e operações do dia a dia.

## ✨ Recursos

<table>
<tr>
<td width="50%">

### 📊 Dashboard Executivo
- Métricas em tempo real
- Indicadores de desempenho
- Gráficos comparativos
- Filtros personalizados

</td>
<td width="50%">

### 🏢 Gestão de Lojas
- Cadastro completo de unidades
- Controle de status
- Informações detalhadas
- Histórico de alterações

</td>
</tr>
<tr>
<td width="50%">

### 👥 Controle de Vendedores
- Gerenciamento de equipe
- Acompanhamento de desempenho
- Registro de entrada/saída
- Status ativo/inativo

</td>
<td width="50%">

### 📈 Relatórios Gerenciais
- Geração automática em PDF
- Exportação para Excel
- Processamento inteligente
- Análise de vendas

</td>
</tr>
<tr>
<td width="50%">

### 🔧 Assistência Técnica
- Controle de chamados
- Estoque de peças
- Histórico de atendimentos
- Gestão de garantias

</td>
<td width="50%">

### 📋 Sistema de Demandas
- Criação de tarefas
- Controle de status
- Tags e categorização
- Acompanhamento completo

</td>
</tr>
</table>

## 🚀 Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sistema-gestao-lojas.git

# Entre no diretório
cd sistema-gestao-lojas

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

> ⚠️ **Segurança**: Altere a senha padrão imediatamente após o primeiro acesso.

## 🛠️ Tecnologias

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

## 📁 Estrutura

```
sistema-gestao-lojas/
├── 📄 server.js              # Servidor principal
├── 📦 package.json           # Dependências
├── 🔧 .env.example           # Configurações
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

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
PORT=5000
NODE_ENV=production
SESSION_SECRET=sua-chave-secreta
JWT_SECRET=sua-chave-jwt
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

## 🔒 Segurança

- ✅ Senhas com hash bcrypt
- ✅ Autenticação JWT
- ✅ Proteção CSRF
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ Auditoria completa de ações
- ✅ Controle de acesso por roles

## 👥 Níveis de Acesso

| Role | Permissões |
|------|-----------|
| **Admin** | Acesso total ao sistema |
| **Monitoramento** | Visualização de relatórios e métricas |
| **Gerente** | Gestão de loja específica |
| **Consultor** | Consulta de informações |
| **Técnico** | Assistência técnica |

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de **uso privado e interno**.

## 💼 Suporte

Para suporte técnico ou dúvidas:
- 📖 Consulte a documentação
- 🔍 Verifique os logs do sistema
- 📧 Entre em contato com o administrador

---

<div align="center">

**Desenvolvido para otimizar a gestão de varejo** 🏪

</div>
