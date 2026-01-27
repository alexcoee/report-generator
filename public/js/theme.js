// ============================================================
// GERENCIADOR DE TEMA DARK/LIGHT MODE
// Inspirado no estilo Apple com transicoes suaves
// ============================================================

class ThemeManager {
    constructor() {
        this.THEME_KEY = 'theme-preference';
        this.currentTheme = this.getStoredTheme() || 'light';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.applyChartTheme();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupToggleButton());
        } else {
            this.setupToggleButton();
        }
    }

    setupToggleButton() {
        const toggleBtnDesktop = document.getElementById('theme-toggle-desktop');
        const toggleBtnMobile = document.getElementById('theme-toggle-mobile');

        if (toggleBtnDesktop && !toggleBtnDesktop.dataset.themeInitialized) {
            this.updateButtonIcon(toggleBtnDesktop);
            toggleBtnDesktop.addEventListener('click', () => this.toggle());
            toggleBtnDesktop.dataset.themeInitialized = 'true';
        } else if (toggleBtnDesktop) {
            this.updateButtonIcon(toggleBtnDesktop);
        }

        if (toggleBtnMobile && !toggleBtnMobile.dataset.themeInitialized) {
            this.updateButtonIcon(toggleBtnMobile);
            toggleBtnMobile.addEventListener('click', () => this.toggle());
            toggleBtnMobile.dataset.themeInitialized = 'true';
        } else if (toggleBtnMobile) {
            this.updateButtonIcon(toggleBtnMobile);
        }
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.saveTheme();
        this.updateAllButtons();
        this.applyChartTheme(true);
    }

    updateButtonIcon(button) {
        const icon = button.querySelector('i');
        if (!icon) return;
        icon.className = this.currentTheme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    }

    updateAllButtons() {
        const toggleBtnDesktop = document.getElementById('theme-toggle-desktop');
        const toggleBtnMobile = document.getElementById('theme-toggle-mobile');

        if (toggleBtnDesktop) this.updateButtonIcon(toggleBtnDesktop);
        if (toggleBtnMobile) this.updateButtonIcon(toggleBtnMobile);
    }

    applyChartTheme(forceUpdate = false) {
        if (typeof Chart === 'undefined') {
            // Chart.js may load after the theme manager; retry once.
            setTimeout(() => this.applyChartTheme(forceUpdate), 300);
            return;
        }

        const css = (name) =>
            getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        const textColor = css('--text-secondary') || '#b0b0b0';
        const gridColor = css('--border-color') || '#404040';
        const cardBg = css('--content-bg') || css('--main-bg') || '#1a1a1a';

        Chart.defaults.color = textColor;
        Chart.defaults.borderColor = gridColor;
        Chart.defaults.backgroundColor = cardBg;

        if (!forceUpdate) return;
        const instances = Object.values(Chart.instances || {});
        instances.forEach((chart) => {
            chart.options.plugins = chart.options.plugins || {};
            chart.options.plugins.legend = chart.options.plugins.legend || {};
            chart.options.plugins.legend.labels = chart.options.plugins.legend.labels || {};
            chart.options.plugins.legend.labels.color = textColor;

            if (chart.options.scales) {
                Object.values(chart.options.scales).forEach((scale) => {
                    scale.ticks = scale.ticks || {};
                    scale.ticks.color = textColor;
                    scale.grid = scale.grid || {};
                    scale.grid.color = gridColor;
                });
            }
            chart.update();
        });
    }

    getStoredTheme() {
        return localStorage.getItem(this.THEME_KEY);
    }

    saveTheme() {
        localStorage.setItem(this.THEME_KEY, this.currentTheme);
    }

    getTheme() {
        return this.currentTheme;
    }
}

const themeManager = new ThemeManager();
window.themeManager = themeManager;
