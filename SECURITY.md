# Política de Segurança

## Versões Suportadas

| Versão | Suportada          |
| ------ | ------------------ |
| 1.0.x  | :white_check_mark: |

## Reportando Vulnerabilidades

Se você descobrir uma vulnerabilidade de segurança neste sistema, por favor:

1. **NÃO** abra uma issue pública
2. Entre em contato diretamente com o administrador do sistema
3. Forneça detalhes sobre a vulnerabilidade encontrada
4. Aguarde confirmação antes de divulgar publicamente

## Práticas de Segurança

Este sistema implementa:

- ✅ Autenticação robusta com bcrypt
- ✅ Tokens JWT para sessões
- ✅ Proteção contra CSRF
- ✅ Rate limiting para prevenir ataques
- ✅ Validação de entrada de dados
- ✅ Headers de segurança com Helmet
- ✅ Auditoria completa de ações

## Configurações Recomendadas

### Produção

- Sempre use HTTPS
- Configure `SESSION_SECRET` e `JWT_SECRET` fortes
- Desabilite `DEV_TEMP_ACCESS`
- Mantenha as dependências atualizadas
- Configure backups regulares
- Limite acesso ao banco de dados

### Senhas

- Altere a senha padrão do admin imediatamente
- Use senhas com pelo menos 8 caracteres
- Combine letras, números e símbolos
- Não compartilhe credenciais

## Atualizações de Segurança

Recomendamos verificar regularmente por atualizações:

```bash
npm audit
npm update
```

## Responsabilidade

O uso seguro deste sistema é responsabilidade do administrador. Certifique-se de seguir todas as práticas recomendadas de segurança.
