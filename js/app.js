// Main application controller for Court Coach

class CourtCoachApp {
    constructor() {
        this.stage = null;
        this.courtManager = null;
        this.playerManager = null;
        this.toolManager = null;
        this.storageManager = null;
        
        this.isInitialized = false;
        this.currentTheme = 'dark';
        
        this.init();
    }
    
    async init() {
        try {
            // Show loading screen
            this.showLoading();
            
            // Initialize storage manager
            this.storageManager = new StorageManager();
            
            // Load settings
            this.loadSettings();
            
            // Setup stage and managers
            await this.setupStage();
            await this.setupManagers();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load saved setup if available
            this.loadSavedSetup();
            
            // Initialize theme
            this.initializeTheme();
            
            // Hide loading screen
            this.hideLoading();
            
            this.isInitialized = true;
            
            // Track app launch
            this.storageManager.trackUsage('app_launch');
            
            console.log('Court Coach initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Court Coach:', error);
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }
    
    async setupStage() {
        const container = document.getElementById('court-container');
        if (!container) {
            throw new Error('Court container not found');
        }
        
        // Wait for CSS layout to complete
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        // Get actual container dimensions after CSS layout
        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        // Use actual container dimensions for stage
        this.stage = new Konva.Stage({
            container: container,
            width: containerWidth,
            height: containerHeight
        });
        
        // Store container reference for resize handling
        this.container = container;
    }
    
    async setupManagers() {
        // Initialize court manager
        this.courtManager = new CourtManager(
            document.getElementById('court-container'),
            this.stage
        );
        
        // Wait for court to be drawn
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Initialize player manager
        this.playerManager = new PlayerManager(this.stage, this.courtManager);
        
        // Initialize tool manager
        this.toolManager = new ToolManager(this.stage, this.courtManager);
        
        // Setup keyboard shortcuts
        this.toolManager.setupKeyboardShortcuts();
    }
    
    setupEventListeners() {
        // Action buttons
        document.getElementById('onCourtBtn').addEventListener('click', () => {
            this.handleOnCourtAction();
        });
        
        document.getElementById('clearCourtBtn').addEventListener('click', () => {
            this.handleClearCourtAction();
        });
        
        document.getElementById('clearArrowsBtn').addEventListener('click', () => {
            this.handleClearArrowsAction();
        });
        
        // Save/Load buttons
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.handleSaveAction();
        });
        
        document.getElementById('loadBtn').addEventListener('click', () => {
            this.handleLoadAction();
        });
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Window events
        window.addEventListener('beforeunload', () => {
            this.handleBeforeUnload();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
        
        // Visibility change (for PWA)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }
    
    handleOnCourtAction() {
        this.playerManager.positionPlayersOnCourt();
        this.storageManager.trackUsage('players_on_court');
        this.showNotification('Players positioned on court');
    }
    
    handleClearCourtAction() {
        this.playerManager.clearPlayersFromCourt();
        this.storageManager.trackUsage('players_clear_court');
        this.showNotification('Players cleared from court');
    }
    
    handleClearArrowsAction() {
        this.toolManager.clearAllArrows();
        this.storageManager.trackUsage('arrows_cleared');
        this.showNotification('All arrows cleared');
    }
    
    handleSaveAction() {
        const playerData = this.playerManager.getPlayerData();
        const arrowData = this.toolManager.getArrowData();
        
        const success = this.storageManager.saveCourtSetup(playerData, arrowData);
        
        if (success) {
            this.showNotification('Court setup saved successfully');
            this.storageManager.trackUsage('setup_saved');
        } else {
            this.showError('Failed to save court setup');
        }
    }
    
    handleLoadAction() {
        const savedSetup = this.storageManager.loadCourtSetup();
        
        if (savedSetup) {
            this.playerManager.setPlayerData(savedSetup.players);
            this.toolManager.setArrowData(savedSetup.arrows);
            this.showNotification('Court setup loaded successfully');
            this.storageManager.trackUsage('setup_loaded');
        } else {
            this.showNotification('No saved setup found');
        }
    }
    
    loadSavedSetup() {
        // Auto-load if available
        if (this.settings.autoSave) {
            const savedSetup = this.storageManager.loadCourtSetup();
            if (savedSetup) {
                this.playerManager.setPlayerData(savedSetup.players);
                this.toolManager.setArrowData(savedSetup.arrows);
            }
        }
    }
    
    loadSettings() {
        this.settings = this.storageManager.loadSettings();
        
        // Apply settings
        if (this.settings.autoSave) {
            this.storageManager.enableAutoSave(this.playerManager, this.toolManager);
        }
    }
    
    initializeTheme() {
        const savedTheme = this.settings.theme || 'dark';
        this.setTheme(savedTheme);
    }
    
    toggleTheme() {
        const themes = ['dark', 'light', 'high-contrast', 'colorblind'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        
        this.setTheme(nextTheme);
        this.storageManager.trackUsage('theme_changed', { theme: nextTheme });
    }
    
    setTheme(theme) {
        // Remove all theme classes
        document.body.classList.remove('light-theme', 'high-contrast-theme', 'colorblind-theme');
        
        // Add new theme class
        if (theme !== 'dark') {
            document.body.classList.add(`${theme}-theme`);
        }
        
        this.currentTheme = theme;
        
        // Update theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.setAttribute('data-theme', theme);
        
        // Update theme icon
        const themeIcons = {
            dark: '🌙',
            light: '☀️',
            'high-contrast': '🔆',
            colorblind: '🎨'
        };
        themeToggle.textContent = themeIcons[theme];
        
        // Save theme preference
        this.settings.theme = theme;
        this.storageManager.saveSettings(this.settings);
    }
    
    handleKeydown(e) {
        // Global keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
            case 's':
                e.preventDefault();
                this.handleSaveAction();
                break;
            case 'o':
                e.preventDefault();
                this.handleLoadAction();
                break;
            case 'r':
                e.preventDefault();
                this.handleOnCourtAction();
                break;
            case 'c':
                e.preventDefault();
                this.handleClearCourtAction();
                break;
            }
        }
        
        // Function keys
        switch (e.key) {
        case 'F1':
            e.preventDefault();
            this.showHelp();
            break;
        case 'F11':
            e.preventDefault();
            this.toggleFullscreen();
            break;
        }
    }
    
    handleBeforeUnload() {
        // Auto-save before leaving
        if (this.settings.autoSave && this.isInitialized) {
            const playerData = this.playerManager.getPlayerData();
            const arrowData = this.toolManager.getArrowData();
            this.storageManager.saveCourtSetup(playerData, arrowData);
        }
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // App is hidden, pause any animations
            this.storageManager.trackUsage('app_hidden');
        } else {
            // App is visible again
            this.storageManager.trackUsage('app_visible');
        }
    }
    
    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'flex';
        }
    }
    
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'error' ? '#f44336' : '#4caf50'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showHelp() {
        const helpContent = `
            <h3>Court Coach - Help</h3>
            <h4>Tools:</h4>
            <ul>
                <li><strong>Select (1/S):</strong> Select and drag players</li>
                <li><strong>Arrow (2/A):</strong> Draw movement arrows</li>
                <li><strong>Erase (3/E):</strong> Remove arrows</li>
            </ul>
            <h4>Actions:</h4>
            <ul>
                <li><strong>On-court:</strong> Position all players on court</li>
                <li><strong>Clear court:</strong> Move all players off court</li>
                <li><strong>Clear arrows:</strong> Remove all arrows</li>
            </ul>
            <h4>Keyboard Shortcuts:</h4>
            <ul>
                <li><strong>Ctrl+S:</strong> Save setup</li>
                <li><strong>Ctrl+O:</strong> Load setup</li>
                <li><strong>Ctrl+R:</strong> Players on court</li>
                <li><strong>Ctrl+C:</strong> Clear court</li>
                <li><strong>F1:</strong> Show help</li>
            </ul>
        `;
        
        this.showModal('Help', helpContent);
    }
    
    showModal(title, content) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '1000'
        });
        
        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'modal';
        Object.assign(modal.style, {
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto',
            color: 'var(--text-primary)'
        });
        
        modal.innerHTML = `
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        `;
        
        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    // Public API methods
    exportSetup() {
        return this.storageManager.exportSetup();
    }
    
    importSetup(jsonString) {
        return this.storageManager.importSetup(jsonString);
    }
    
    getUsageStats() {
        return this.storageManager.getUsageStats();
    }
    
    resetApp() {
        this.storageManager.clearStorage();
        this.handleClearCourtAction();
        this.handleClearArrowsAction();
        this.showNotification('App reset successfully');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.courtCoachApp = new CourtCoachApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CourtCoachApp;
}
