// Local storage management for Court Coach

class StorageManager {
    constructor() {
        this.storageKey = 'court-coach-data';
        this.setupVersion = '1.0.0';
    }
    
    saveCourtSetup(playerData, arrowData) {
        const setupData = {
            version: this.setupVersion,
            timestamp: new Date().toISOString(),
            players: playerData,
            arrows: arrowData,
            courtDimensions: this.getCurrentCourtDimensions()
        };
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(setupData));
            return true;
        } catch (error) {
            console.error('Failed to save court setup:', error);
            return false;
        }
    }
    
    loadCourtSetup() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) {
                return null;
            }
            
            const setupData = JSON.parse(savedData);
            
            // Validate data structure
            if (!this.validateSetupData(setupData)) {
                console.warn('Invalid setup data, clearing storage');
                this.clearStorage();
                return null;
            }
            
            return setupData;
        } catch (error) {
            console.error('Failed to load court setup:', error);
            return null;
        }
    }
    
    validateSetupData(data) {
        // Check for required fields
        if (!data.version || !data.players || !data.arrows) {
            return false;
        }
        
        // Check player data structure
        if (!Array.isArray(data.players)) {
            return false;
        }
        
        // Check arrow data structure
        if (!Array.isArray(data.arrows)) {
            return false;
        }
        
        // Validate player data
        for (const player of data.players) {
            if (!player.position || !player.team || 
                typeof player.x !== 'number' || typeof player.y !== 'number') {
                return false;
            }
        }
        
        // Validate arrow data
        for (const arrow of data.arrows) {
            if (typeof arrow.startX !== 'number' || typeof arrow.startY !== 'number' ||
                typeof arrow.endX !== 'number' || typeof arrow.endY !== 'number') {
                return false;
            }
        }
        
        return true;
    }
    
    clearStorage() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    }
    
    hasStoredSetup() {
        return localStorage.getItem(this.storageKey) !== null;
    }
    
    getStorageSize() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? data.length : 0;
        } catch (error) {
            return 0;
        }
    }
    
    getCurrentCourtDimensions() {
        // This would be called from the court manager
        return {
            width: 800,
            height: 400,
            scale: 1
        };
    }
    
    exportSetup() {
        const setupData = this.loadCourtSetup();
        if (!setupData) {
            return null;
        }
        
        const exportData = {
            ...setupData,
            exportDate: new Date().toISOString(),
            appVersion: this.setupVersion
        };
        
        return JSON.stringify(exportData, null, 2);
    }
    
    importSetup(jsonString) {
        try {
            const importData = JSON.parse(jsonString);
            
            if (!this.validateSetupData(importData)) {
                throw new Error('Invalid setup data format');
            }
            
            // Save imported data
            return this.saveCourtSetup(importData.players, importData.arrows);
        } catch (error) {
            console.error('Failed to import setup:', error);
            return false;
        }
    }
    
    // Auto-save functionality
    enableAutoSave(playerManager, toolManager, interval = 30000) {
        this.autoSaveInterval = setInterval(() => {
            if (playerManager && toolManager) {
                const playerData = playerManager.getPlayerData();
                const arrowData = toolManager.getArrowData();
                
                // Only save if there's meaningful data
                if (playerData.some(p => p.isOnCourt) || arrowData.length > 0) {
                    this.saveCourtSetup(playerData, arrowData);
                }
            }
        }, interval);
    }
    
    disableAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }
    
    // Settings management
    saveSettings(settings) {
        const settingsKey = 'court-coach-settings';
        try {
            localStorage.setItem(settingsKey, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    }
    
    loadSettings() {
        const settingsKey = 'court-coach-settings';
        try {
            const savedSettings = localStorage.getItem(settingsKey);
            if (!savedSettings) {
                return this.getDefaultSettings();
            }
            
            return { ...this.getDefaultSettings(), ...JSON.parse(savedSettings) };
        } catch (error) {
            console.error('Failed to load settings:', error);
            return this.getDefaultSettings();
        }
    }
    
    getDefaultSettings() {
        return {
            theme: 'dark',
            autoSave: true,
            showLabels: true,
            snapToGrid: false,
            soundEnabled: false
        };
    }
    
    // Usage analytics (local only)
    trackUsage(action, details = {}) {
        const usageKey = 'court-coach-usage';
        try {
            const usage = JSON.parse(localStorage.getItem(usageKey) || '{}');
            
            if (!usage.sessions) {
                usage.sessions = [];
            }
            
            usage.sessions.push({
                action: action,
                timestamp: new Date().toISOString(),
                details: details
            });
            
            // Keep only last 100 sessions
            if (usage.sessions.length > 100) {
                usage.sessions = usage.sessions.slice(-100);
            }
            
            localStorage.setItem(usageKey, JSON.stringify(usage));
        } catch (error) {
            console.error('Failed to track usage:', error);
        }
    }
    
    getUsageStats() {
        const usageKey = 'court-coach-usage';
        try {
            const usage = JSON.parse(localStorage.getItem(usageKey) || '{}');
            return {
                totalSessions: usage.sessions ? usage.sessions.length : 0,
                recentSessions: usage.sessions ? usage.sessions.slice(-10) : [],
                mostUsedActions: this.getMostUsedActions(usage.sessions || [])
            };
        } catch (error) {
            console.error('Failed to get usage stats:', error);
            return {
                totalSessions: 0,
                recentSessions: [],
                mostUsedActions: []
            };
        }
    }
    
    getMostUsedActions(sessions) {
        const actionCounts = {};
        sessions.forEach(session => {
            actionCounts[session.action] = (actionCounts[session.action] || 0) + 1;
        });
        
        return Object.entries(actionCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([action, count]) => ({ action, count }));
    }
    
    // Backup and restore
    createBackup() {
        const backup = {
            setup: this.loadCourtSetup(),
            settings: this.loadSettings(),
            usage: this.getUsageStats(),
            backupDate: new Date().toISOString(),
            version: this.setupVersion
        };
        
        return JSON.stringify(backup, null, 2);
    }
    
    restoreBackup(backupString) {
        try {
            const backup = JSON.parse(backupString);
            
            if (backup.setup) {
                this.saveCourtSetup(backup.setup.players, backup.setup.arrows);
            }
            
            if (backup.settings) {
                this.saveSettings(backup.settings);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to restore backup:', error);
            return false;
        }
    }
}
