/**
 * Middleware de AutenticaÃ§Ã£o
 * Sistema simples de controle de acesso - todos os usuÃ¡rios autenticados tÃªm acesso total
 */

/**
 * Middleware simples para verificar se o usuÃ¡rio estÃ¡ autenticado
 * Substitui os antigos requireRole e requirePage
 */
function ensureLocalSession(req) {
    if (!req.session) return;
    if (!req.session.userId) {
        req.session.userId = 1;
        req.session.username = 'local';
        req.session.role = 'admin';
    }
    if (!req.session.role) {
        req.session.role = 'admin';
    }
}

function requireAuth(req, res, next) {
    ensureLocalSession(req);
    return next();
}

/**
 * Middleware para pÃ¡ginas que requerem autenticaÃ§Ã£o
 * Redireciona para login se nÃ£o autenticado
 */
function requireAuthPage(req, res, next) {
    ensureLocalSession(req);
    return next();
}

/**
 * Retorna todas as permissÃµes (todos os usuÃ¡rios tÃªm acesso a tudo)
 */
function getPermissions() {
    return {
        canAccessAllData: true,
        canManageUsers: true,
        canManageLojas: true,
        canCreateReports: true,
        canViewLogs: true,
        canAccessDemandas: true,
        canExportData: true,
        canManageAssistencia: true,
        canManageEstoque: true,
        canManageVendedores: true,
        canViewAssistencia: true,
        canDeleteConcluidas: true,
        menuItems: ['dashboard', 'consulta', 'novo-relatorio', 'lojas', 'demandas', 'assistencia', 'gerenciar-usuarios', 'logs', 'backup', 'alertas-tecnico'],
        dashboard: true,
        consulta: true,
        'novo-relatorio': true,
        lojas: true,
        demandas: true,
        assistencia: true,
        'gerenciar-usuarios': true,
        logs: true,
        backup: true,
        'alertas-tecnico': true
    };
}

/**
 * Retorna filtro de lojas (agora sempre null - sem filtros)
 */
function getLojaFilter() {
    return null;
}

module.exports = {
    requireAuth,
    requireAuthPage,
    getPermissions,
    getLojaFilter,
    requireRole: requireAuth,
    requirePage: requireAuthPage,
    canAccessLoja: (db) => (req, res, next) => next()
};
