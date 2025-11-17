# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2024-11-17

### Adicionado
- Sistema completo de gestão de lojas
- Dashboard executivo com métricas em tempo real
- Gerenciamento de vendedores por loja
- Geração automática de relatórios em PDF e Excel
- Sistema de demandas e chamados
- Assistência técnica com controle de estoque
- Autenticação segura com bcrypt e JWT
- Auditoria completa de ações
- Suporte a PostgreSQL e SQLite
- Integração opcional com Google Drive para backups
- Sistema de roles e permissões
- Rate limiting para segurança
- Processamento inteligente de PDFs (Omni e Busca Técnica)

### Segurança
- Implementação de CSRF protection
- Headers de segurança com Helmet
- Senhas hasheadas com bcrypt
- Tokens JWT para autenticação
- Validação de entrada com express-validator
- Auditoria completa de ações mutantes

---

## Tipos de Mudanças

- `Adicionado` para novas funcionalidades
- `Modificado` para mudanças em funcionalidades existentes
- `Descontinuado` para funcionalidades que serão removidas
- `Removido` para funcionalidades removidas
- `Corrigido` para correções de bugs
- `Segurança` para vulnerabilidades corrigidas
