import { showToast, getAuthHeaders } from '../utils.js';

export function initConfiguracoesPage() {
    const secaoConfig = document.getElementById('secao-configuracoes');
    
    if (!secaoConfig) {
        console.error('Elementos da página de configurações não encontrados');
        return;
    }
    
    secaoConfig.style.display = 'block';
    init();
}

function init() {
    initBackupTab();
    initIntegrationsTab();
}

async function initBackupTab() {
    await carregarConfigBackup();
    await carregarConfigSmtp();
    await carregarHistoricoBackup();

    document.getElementById('btn-criar-backup').addEventListener('click', criarBackupManual);
    document.getElementById('btn-enviar-email').addEventListener('click', enviarBackupEmail);
    document.getElementById('btn-refresh-history').addEventListener('click', carregarHistoricoBackup);
    
    document.getElementById('form-config-backup').addEventListener('submit', async (e) => {
        e.preventDefault();
        await salvarConfigBackup();
    });

    const smtpForm = document.getElementById('form-config-smtp');
    const smtpTestBtn = document.getElementById('btn-testar-smtp');
    if (smtpForm) {
        smtpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await salvarConfigSmtp();
        });
    }
    if (smtpTestBtn) {
        smtpTestBtn.addEventListener('click', testarSmtp);
    }
}

async function carregarConfigBackup() {
    try {
        const response = await fetch('/api/settings/backup/config', {
            headers: await getAuthHeaders()
        });
        
        if (!response.ok) throw new Error('Erro ao carregar configurações');
        
        const config = await response.json();
        
        document.getElementById('auto-backup-enabled').checked = config.autoBackupEnabled;
        document.getElementById('auto-backup-frequency').value = config.autoBackupFrequency;
        document.getElementById('auto-backup-email').value = config.autoBackupEmail;
    } catch (error) {
        console.error('Erro ao carregar configurações de backup:', error);
    }
}

async function salvarConfigBackup() {
    try {
        const config = {
            autoBackupEnabled: document.getElementById('auto-backup-enabled').checked,
            autoBackupFrequency: document.getElementById('auto-backup-frequency').value,
            autoBackupEmail: document.getElementById('auto-backup-email').value
        };

        const response = await fetch('/api/settings/backup/config', {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(config)
        });

        if (!response.ok) throw new Error('Erro ao salvar configurações');

        showToast('Configurações salvas com sucesso', 'success');
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        showToast('Erro ao salvar configurações', 'danger');
    }
}

let smtpPassMasked = false;

async function carregarConfigSmtp() {
    const hostInput = document.getElementById('smtp-host');
    if (!hostInput) return;

    try {
        const response = await fetch('/api/settings/email/config', {
            headers: await getAuthHeaders()
        });
        if (!response.ok) throw new Error('Erro ao carregar SMTP');

        const smtp = await response.json();
        document.getElementById('smtp-host').value = smtp.host || '';
        document.getElementById('smtp-port').value = smtp.port || 587;
        document.getElementById('smtp-secure').checked = Boolean(smtp.secure);
        document.getElementById('smtp-user').value = smtp.user || '';
        document.getElementById('smtp-from').value = smtp.from || '';
        document.getElementById('smtp-test-email').value = smtp.user || '';

        const passInput = document.getElementById('smtp-pass');
        passInput.value = smtp.pass || '';
        smtpPassMasked = smtp.pass === '********';
    } catch (error) {
        console.error('Erro ao carregar SMTP:', error);
    }
}

async function salvarConfigSmtp() {
    const btn = document.getElementById('btn-salvar-smtp');
    if (!btn) return;
    const originalText = btn.innerHTML;

    try {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Salvando...';

        const passInput = document.getElementById('smtp-pass');
        const passValue = passInput.value.trim();
        const passToSend = passValue ? passValue : (smtpPassMasked ? '********' : '');

        const payload = {
            host: document.getElementById('smtp-host').value.trim(),
            port: parseInt(document.getElementById('smtp-port').value || '587', 10),
            secure: document.getElementById('smtp-secure').checked,
            user: document.getElementById('smtp-user').value.trim(),
            pass: passToSend,
            from: document.getElementById('smtp-from').value.trim()
        };

        const response = await fetch('/api/settings/email/config', {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Erro ao salvar SMTP');

        showToast('Configuracao SMTP salva', 'success');
        await carregarConfigSmtp();
    } catch (error) {
        console.error('Erro ao salvar SMTP:', error);
        showToast(error.message, 'danger');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

async function testarSmtp() {
    const btn = document.getElementById('btn-testar-smtp');
    if (!btn) return;
    const originalText = btn.innerHTML;

    try {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Testando...';

        const emailTo = document.getElementById('smtp-test-email').value.trim()
            || document.getElementById('smtp-user').value.trim();

        const response = await fetch('/api/settings/email/test', {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify({ emailTo })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Falha no teste SMTP');

        showToast('Email de teste enviado', 'success');
    } catch (error) {
        console.error('Erro ao testar SMTP:', error);
        showToast(error.message, 'danger');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

async function criarBackupManual() {
    const btn = document.getElementById('btn-criar-backup');
    const originalText = btn.innerHTML;
    
    try {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Criando...';
        
        const response = await fetch('/api/settings/backup/manual', {
            method: 'POST',
            headers: await getAuthHeaders()
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result.error || 'Erro ao criar backup');

        showToast(`Backup criado com sucesso (${result.sizeMB} MB)`, 'success');
        await carregarHistoricoBackup();
    } catch (error) {
        console.error('Erro ao criar backup:', error);
        showToast(error.message, 'danger');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

async function enviarBackupEmail() {
    const emailInput = document.getElementById('email-backup');
    const email = emailInput.value.trim();
    
    if (!email) {
        showToast('Digite um email', 'warning');
        return;
    }

    const btn = document.getElementById('btn-enviar-email');
    const originalText = btn.innerHTML;
    
    try {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
        
        const response = await fetch('/api/settings/backup/email', {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify({ emailTo: email })
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result.error || 'Erro ao enviar backup');

        showToast('Backup enviado com sucesso!', 'success');
        emailInput.value = '';
        await carregarHistoricoBackup();
    } catch (error) {
        console.error('Erro ao enviar backup:', error);
        showToast(error.message, 'danger');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

async function carregarHistoricoBackup() {
    const tbody = document.getElementById('backup-history-table');
    
    try {
        const response = await fetch('/api/settings/backup/history?limit=20', {
            headers: await getAuthHeaders()
        });

        if (!response.ok) throw new Error('Erro ao carregar histórico');

        const data = await response.json();
        const backups = data.backups || [];

        if (backups.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum backup encontrado</td></tr>';
            return;
        }

        tbody.innerHTML = backups.map(backup => {
            const date = new Date(backup.created_at).toLocaleString('pt-BR');
            const statusBadge = backup.status === 'success' 
                ? '<span class="badge bg-success">Sucesso</span>' 
                : '<span class="badge bg-danger">Erro</span>';
            
            const emailSent = backup.sent_to_email 
                ? '<i class="bi bi-envelope-check text-success" title="Email enviado"></i>'
                : '<i class="bi bi-envelope text-muted" title="Email não enviado"></i>';

            return `
                <tr>
                    <td>${date}</td>
                    <td>
                        ${emailSent}
                        <span class="badge bg-secondary ms-1">${backup.backup_type}</span>
                    </td>
                    <td>${backup.sizeMB} MB</td>
                    <td>${statusBadge}</td>
                    <td>${backup.created_by || '-'}</td>
                    <td class="text-center">
                        ${backup.filepath ? `<a href="${backup.downloadUrl}" class="btn btn-sm btn-outline-primary" title="Download">
                            <i class="bi bi-download"></i>
                        </a>` : '-'}
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Erro ao carregar histórico</td></tr>';
    }
}

async function initIntegrationsTab() {
    await carregarIntegracoes();
}

async function carregarIntegracoes() {
    const container = document.getElementById('integrations-container');
    
    try {
        const response = await fetch('/api/settings/integrations', {
            headers: await getAuthHeaders()
        });

        if (!response.ok) throw new Error('Erro ao carregar integrações');

        const data = await response.json();
        const integrations = data.integrations || [];

        container.innerHTML = integrations.map(integration => {
            const statusColor = integration.status === 'connected' ? 'success' : 
                                integration.status === 'error' ? 'danger' : 'secondary';
            const statusText = integration.status === 'connected' ? 'Conectado' : 
                              integration.status === 'error' ? 'Erro' : 'Desconectado';
            const statusIcon = integration.status === 'connected' ? 'check-circle-fill' : 
                              integration.status === 'error' ? 'x-circle-fill' : 'circle';

            return `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <h5 class="card-title mb-0">${integration.name}</h5>
                                <span class="badge bg-${statusColor}">
                                    <i class="bi bi-${statusIcon} me-1"></i>${statusText}
                                </span>
                            </div>
                            <p class="text-muted small">Tipo: ${integration.type}</p>
                            ${integration.lastCheck ? `
                                <p class="small text-muted mb-0">
                                    <i class="bi bi-clock me-1"></i>
                                    Última verificação: ${new Date(integration.lastCheck).toLocaleString('pt-BR')}
                                </p>
                            ` : ''}
                            ${integration.details ? `
                                <hr>
                                <small class="text-muted">
                                    ${Object.entries(integration.details).map(([key, value]) => 
                                        `<div>${key}: ${typeof value === 'boolean' ? (value ? '✓' : '✗') : value}</div>`
                                    ).join('')}
                                </small>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Erro ao carregar integrações:', error);
        container.innerHTML = '<div class="col-12"><div class="alert alert-danger">Erro ao carregar integrações</div></div>';
    }
}

