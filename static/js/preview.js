/**
 * Preview functionality for R1 Creations
 */

class CreationPreviewer {
    constructor() {
        this.previewFrame = null;
        this.setupEventListeners();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Preview modal
        const previewBtn = document.getElementById('previewBtn');
        const previewModal = document.getElementById('previewModal');
        const closePreviewModal = document.getElementById('closePreviewModal');
        
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.showPreviewModal());
        }
        
        if (closePreviewModal) {
            closePreviewModal.addEventListener('click', () => this.hidePreviewModal());
        }
        
        if (previewModal) {
            previewModal.addEventListener('click', (e) => {
                if (e.target === previewModal) {
                    this.hidePreviewModal();
                }
            });
        }
        
        // Simulator controls
        this.setupSimulatorControls();
    }
    
    /**
     * Set up simulator controls
     */
    setupSimulatorControls() {
        // The emulator controls are now handled by emulator-shim.js
        // We just need to make sure the preview frame is properly integrated
        this.setupEmulatorIntegration();
    }
    
    /**
     * Set up emulator integration
     */
    setupEmulatorIntegration() {
        // Update time display
        this.updateStatusBarTime();
        setInterval(() => this.updateStatusBarTime(), 30000);
        
        // Update battery if available
        this.updateBatteryStatus();
    }
    
    /**
     * Update status bar time
     */
    updateStatusBarTime() {
        const timeElement = document.getElementById('status-time');
        if (timeElement) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}`;
        }
    }
    
    /**
     * Update battery status
     */
    async updateBatteryStatus() {
        const battElement = document.getElementById('status-batt');
        if (battElement) {
            try {
                if (navigator.getBattery) {
                    const battery = await navigator.getBattery();
                    const percent = Math.round(battery.level * 100);
                    battElement.textContent = `Batt ${percent}%`;
                    
                    battery.addEventListener('levelchange', () => {
                        const newPercent = Math.round(battery.level * 100);
                        battElement.textContent = `Batt ${newPercent}%`;
                    });
                }
            } catch (error) {
                // Battery API not supported
                battElement.textContent = 'Batt —';
            }
        }
    }
    
    /**
     * Show preview modal
     */
    async showPreviewModal() {
        const modal = document.getElementById('previewModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Initialize emulator controls
            if (typeof window.initializeEmulatorForPreview === 'function') {
                window.initializeEmulatorForPreview();
            }
            
            // Generate preview
            await this.generatePreview();
        }
    }
    
    /**
     * Hide preview modal
     */
    hidePreviewModal() {
        const modal = document.getElementById('previewModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            // Clean up preview
            this.cleanupPreview();
        }
    }
    
    /**
     * Generate preview of the creation
     */
    async generatePreview() {
        if (!workspace) {
            showToast('No workspace available', 'error');
            return;
        }
        
        try {
            showLoading('Generating preview...');
            
            const creationName = document.getElementById('creationName')?.value || 'Preview Creation';
            const workspaceXml = BlocklyConfig.getXml();
            const generatedCode = CodeGenerator.formatForExport();
            
            // Generate HTML for preview
            const previewHtml = await this.generatePreviewHtml(creationName, generatedCode);
            
            // Load into iframe
            this.loadPreviewIntoFrame(previewHtml);
            
        } catch (error) {
            console.error('Preview generation error:', error);
            showToast(`Preview failed: ${error.message}`, 'error');
        } finally {
            hideLoading();
        }
    }
    
    /**
     * Generate HTML for preview
     */
    async generatePreviewHtml(creationName, generatedCode) {
        const exportData = {
            name: creationName,
            workspace_xml: BlocklyConfig.getXml(),
            generated_code: generatedCode
        };
        
        try {
            const response = await fetch('/api/export/html', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(exportData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Preview generation failed');
            }
            
            return result.html_content;
        } catch (error) {
            console.error('Error generating preview HTML:', error);
            
            // Fallback to basic HTML
            return this.generateBasicPreviewHtml(creationName, generatedCode);
        }
    }
    
    /**
     * Generate basic preview HTML as fallback
     */
    generateBasicPreviewHtml(creationName, generatedCode) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=240, height=282, initial-scale=1.0">
    <title>${creationName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            width: 240px;
            height: 282px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 12px;
            background: #0a0a0a;
            color: #fff;
            overflow: hidden;
        }
        #app {
            width: 100%;
            height: 100%;
            border: 5px solid #00ff00;
            display: flex;
            flex-direction: column;
        }
        header {
            background: #1a1a1a;
            padding: 8px;
            text-align: center;
            height: 40px;
            border-bottom: 1px solid #333;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        header h1 { font-size: 14px; font-weight: bold; }
        main { flex: 1; padding: 10px; background: #0a0a0a; }
        .status { text-align: center; padding: 20px; color: #888; font-size: 11px; }
        .status.active { color: #00ff00; }
    </style>
</head>
<body>
    <div id="app">
        <header><h1>${creationName}</h1></header>
        <main>
            <div class="status" id="status">Preview Mode</div>
        </main>
    </div>
    <script>
        console.log('R1 Creation Preview: ${creationName}');
        
        // Mock R1 APIs for preview
        window.PluginMessageHandler = {
            postMessage: function(data) {
                console.log('Mock PluginMessageHandler:', data);
                document.getElementById('status').textContent = 'Message sent';
                document.getElementById('status').className = 'status active';
                setTimeout(() => {
                    document.getElementById('status').textContent = 'Preview Mode';
                    document.getElementById('status').className = 'status';
                }, 2000);
            }
        };
        
        window.creationStorage = {
            plain: {
                setItem: (key, value) => { console.log('Store plain:', key, value); return Promise.resolve(); },
                getItem: (key) => { console.log('Get plain:', key); return Promise.resolve(null); }
            },
            secure: {
                setItem: (key, value) => { console.log('Store secure:', key, value); return Promise.resolve(); },
                getItem: (key) => { console.log('Get secure:', key); return Promise.resolve(null); }
            }
        };
        
        window.creationSensors = {
            accelerometer: {
                start: (callback) => {
                    console.log('Mock accelerometer started');
                    setInterval(() => {
                        callback({
                            x: (Math.random() - 0.5) * 2,
                            y: (Math.random() - 0.5) * 2,
                            z: (Math.random() - 0.5) * 2
                        });
                    }, 1000);
                },
                stop: () => console.log('Mock accelerometer stopped')
            }
        };
        
        // Generated code
        document.addEventListener('DOMContentLoaded', function() {
            try {
                ${generatedCode}
                console.log('Preview code executed successfully');
            } catch (error) {
                console.error('Preview code error:', error);
            }
        });
    </script>
</body>
</html>`;
    }
    
    /**
     * Load preview HTML into iframe
     */
    loadPreviewIntoFrame(html) {
        this.previewFrame = document.getElementById('previewFrame');
        if (!this.previewFrame) {
            console.error('Preview frame not found');
            return;
        }
        
        // Create blob URL for the HTML
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Load into iframe
        this.previewFrame.src = url;
        
        // Clean up URL after loading
        this.previewFrame.onload = () => {
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        };
        
        console.log('Preview loaded into frame');
    }
    
    /**
     * Simulate voice command
     */
    simulateVoiceCommand() {
        const command = prompt('Enter voice command to simulate:', 'hello');
        if (!command) return;
        
        try {
            if (this.previewFrame && this.previewFrame.contentWindow) {
                this.previewFrame.contentWindow.dispatchEvent(
                    new CustomEvent('voiceCommand', {
                        detail: { command: command }
                    })
                );
                showToast(`Voice command simulated: "${command}"`, 'info');
            }
        } catch (error) {
            console.error('Error simulating voice command:', error);
            showToast('Failed to simulate voice command', 'error');
        }
    }
    
    /**
     * Simulate hardware event
     */
    simulateHardwareEvent(eventType) {
        try {
            if (this.previewFrame && this.previewFrame.contentWindow) {
                this.previewFrame.contentWindow.dispatchEvent(
                    new CustomEvent(eventType)
                );
                showToast(`Hardware event simulated: ${eventType}`, 'info');
            }
        } catch (error) {
            console.error(`Error simulating ${eventType}:`, error);
            showToast(`Failed to simulate ${eventType}`, 'error');
        }
    }
    
    /**
     * Clean up preview resources
     */
    cleanupPreview() {
        if (this.previewFrame) {
            this.previewFrame.src = 'about:blank';
        }
    }
    
    /**
     * Take screenshot of preview (if supported)
     */
    async takeScreenshot() {
        if (!this.previewFrame) {
            showToast('No preview available', 'error');
            return;
        }
        
        try {
            // This would require additional implementation for actual screenshots
            // For now, just show a placeholder
            showToast('Screenshot feature coming soon', 'info');
        } catch (error) {
            console.error('Screenshot error:', error);
            showToast('Screenshot failed', 'error');
        }
    }
    
    /**
     * Toggle fullscreen preview
     */
    toggleFullscreen() {
        const frame = document.querySelector('.r1-frame');
        if (!frame) return;
        
        if (frame.classList.contains('fullscreen')) {
            frame.classList.remove('fullscreen');
            showToast('Exited fullscreen', 'info');
        } else {
            frame.classList.add('fullscreen');
            showToast('Entered fullscreen', 'info');
        }
    }
}

// Initialize previewer when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.creationPreviewer = new CreationPreviewer();
    
    // Add CSS for fullscreen preview
    const style = document.createElement('style');
    style.textContent = `
        .r1-frame.fullscreen {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(2);
            z-index: 9999;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
        }
        
        .r1-frame.fullscreen::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            z-index: -1;
        }
    `;
    document.head.appendChild(style);
});

// Export for global access
window.CreationPreviewer = CreationPreviewer;
