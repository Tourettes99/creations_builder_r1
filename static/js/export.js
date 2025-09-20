/**
 * Export functionality for R1 Creations
 */

class CreationExporter {
    constructor() {
        this.setupEventListeners();
    }
    
    /**
     * Set up event listeners for export functionality
     */
    setupEventListeners() {
        // Export modal
        const exportBtn = document.getElementById('exportBtn');
        const exportModal = document.getElementById('exportModal');
        const closeExportModal = document.getElementById('closeExportModal');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.showExportModal());
        }
        
        if (closeExportModal) {
            closeExportModal.addEventListener('click', () => this.hideExportModal());
        }
        
        if (exportModal) {
            exportModal.addEventListener('click', (e) => {
                if (e.target === exportModal) {
                    this.hideExportModal();
                }
            });
        }
        
        // Export buttons
        const exportButtons = document.querySelectorAll('.export-btn');
        exportButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.getAttribute('data-format');
                this.exportCreation(format);
            });
        });
    }
    
    /**
     * Show export modal
     */
    showExportModal() {
        const modal = document.getElementById('exportModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    /**
     * Hide export modal
     */
    hideExportModal() {
        const modal = document.getElementById('exportModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
    
    /**
     * Export creation in specified format
     */
    async exportCreation(format) {
        if (!workspace) {
            showToast('No workspace available', 'error');
            return;
        }
        
        showLoading('Exporting creation...');
        
        try {
            const creationName = document.getElementById('creationName')?.value || 'Untitled Creation';
            const workspaceXml = BlocklyConfig.getXml();
            const generatedCode = CodeGenerator.formatForExport();
            
            const exportData = {
                name: creationName,
                workspace_xml: workspaceXml,
                generated_code: generatedCode
            };
            
            let response;
            let filename;
            let content;
            let mimeType;
            
            switch (format) {
                case 'html':
                    response = await this.exportAsHtml(exportData);
                    filename = response.filename;
                    content = response.html_content;
                    mimeType = 'text/html';
                    break;
                    
                case 'json':
                    response = await this.exportAsJson(exportData);
                    filename = response.filename;
                    content = response.json_content;
                    mimeType = 'application/json';
                    break;
                    
                case 'xml':
                    response = await this.exportAsXml(exportData);
                    filename = response.filename;
                    content = response.xml_content;
                    mimeType = 'application/xml';
                    break;
                    
                default:
                    throw new Error(`Unknown export format: ${format}`);
            }
            
            // Download the file
            this.downloadFile(content, filename, mimeType);
            
            showToast(`Creation exported as ${format.toUpperCase()}`, 'success');
            this.hideExportModal();
            
        } catch (error) {
            console.error('Export error:', error);
            showToast(`Export failed: ${error.message}`, 'error');
        } finally {
            hideLoading();
        }
    }
    
    /**
     * Export as HTML bundle
     */
    async exportAsHtml(exportData) {
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
            throw new Error(result.error || 'Export failed');
        }
        
        return result;
    }
    
    /**
     * Export as JSON data
     */
    async exportAsJson(exportData) {
        const response = await fetch('/api/export/json', {
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
            throw new Error(result.error || 'Export failed');
        }
        
        return result;
    }
    
    /**
     * Export as XML workspace
     */
    async exportAsXml(exportData) {
        const response = await fetch('/api/export/xml', {
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
            throw new Error(result.error || 'Export failed');
        }
        
        return result;
    }
    
    /**
     * Download file to user's computer
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
    
    /**
     * Quick export as HTML (for testing)
     */
    async quickExportHtml() {
        if (!workspace) {
            showToast('No workspace available', 'error');
            return;
        }
        
        try {
            const creationName = document.getElementById('creationName')?.value || 'Quick Export';
            const workspaceXml = BlocklyConfig.getXml();
            const generatedCode = CodeGenerator.formatForExport();
            
            const exportData = {
                name: creationName,
                workspace_xml: workspaceXml,
                generated_code: generatedCode
            };
            
            const response = await this.exportAsHtml(exportData);
            this.downloadFile(response.html_content, response.filename, 'text/html');
            
            showToast('Quick HTML export complete', 'success');
        } catch (error) {
            console.error('Quick export error:', error);
            showToast(`Quick export failed: ${error.message}`, 'error');
        }
    }
    
    /**
     * Export workspace only (for backup)
     */
    exportWorkspaceBackup() {
        if (!workspace) {
            showToast('No workspace available', 'error');
            return;
        }
        
        try {
            const creationName = document.getElementById('creationName')?.value || 'Workspace Backup';
            const workspaceXml = BlocklyConfig.getXml();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            
            const backupData = {
                name: creationName,
                created_at: new Date().toISOString(),
                workspace_xml: workspaceXml,
                version: '1.0.0'
            };
            
            const filename = `${creationName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_backup_${timestamp}.json`;
            this.downloadFile(JSON.stringify(backupData, null, 2), filename, 'application/json');
            
            showToast('Workspace backup saved', 'success');
        } catch (error) {
            console.error('Backup error:', error);
            showToast(`Backup failed: ${error.message}`, 'error');
        }
    }
    
    /**
     * Import workspace from backup
     */
    async importWorkspaceBackup(file) {
        try {
            const content = await this.readFileAsText(file);
            const backupData = JSON.parse(content);
            
            if (!backupData.workspace_xml) {
                throw new Error('Invalid backup file: missing workspace_xml');
            }
            
            // Confirm import
            if (!confirm(`Import workspace "${backupData.name || 'Unknown'}"? This will replace the current workspace.`)) {
                return;
            }
            
            // Load workspace
            BlocklyConfig.loadXml(backupData.workspace_xml);
            
            // Update creation name
            if (backupData.name) {
                const nameInput = document.getElementById('creationName');
                if (nameInput) {
                    nameInput.value = backupData.name;
                }
            }
            
            showToast('Workspace imported successfully', 'success');
        } catch (error) {
            console.error('Import error:', error);
            showToast(`Import failed: ${error.message}`, 'error');
        }
    }
    
    /**
     * Read file as text
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
}

// Initialize exporter when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.creationExporter = new CreationExporter();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    // Save workspace (could implement auto-save)
                    window.creationExporter.exportWorkspaceBackup();
                    break;
                case 'e':
                    e.preventDefault();
                    // Quick export
                    window.creationExporter.quickExportHtml();
                    break;
            }
        }
    });
    
    // Add drag and drop for import
    const dropZone = document.body;
    
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/json' || file.name.endsWith('.json')) {
                window.creationExporter.importWorkspaceBackup(file);
            } else {
                showToast('Please drop a JSON backup file', 'warning');
            }
        }
    });
});

// Export for global access
window.CreationExporter = CreationExporter;
