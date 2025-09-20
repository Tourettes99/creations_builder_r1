/**
 * Main application logic for R1 Creations Builder
 */

// Global application state
const AppState = {
    initialized: false,
    workspace: null,
    currentCreationName: 'My R1 Creation',
    lastSaved: null,
    isDirty: false
};

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('Initializing R1 Creations Builder...');
    
    try {
        // Initialize UI components
        initializeUI();
        
        // Initialize Blockly workspace
        AppState.workspace = BlocklyConfig.initialize();
        
        if (!AppState.workspace) {
            throw new Error('Failed to initialize Blockly workspace');
        }
        
        // Set up workspace change listeners
        setupWorkspaceListeners();
        
        // Initialize other components
        initializeToastSystem();
        initializeLoadingSystem();
        
        // Set up keyboard shortcuts
        setupKeyboardShortcuts();
        
        // Set up auto-save
        setupAutoSave();
        
        // Mark as initialized
        AppState.initialized = true;
        
        console.log('R1 Creations Builder initialized successfully');
        showToast('Creations Builder ready!', 'success');
        
        // Update status
        updateConnectionStatus('Connected');
        
    } catch (error) {
        console.error('Initialization error:', error);
        showToast(`Initialization failed: ${error.message}`, 'error');
    }
}

/**
 * Initialize UI components
 */
function initializeUI() {
    // Header buttons
    setupHeaderButtons();
    
    // Sidebar
    setupSidebar();
    
    // Code panel
    setupCodePanel();
    
    // Workspace controls
    setupWorkspaceControls();
    
    // Creation name input
    setupCreationNameInput();
}

/**
 * Set up header buttons
 */
function setupHeaderButtons() {
    const newBtn = document.getElementById('newBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    if (newBtn) {
        newBtn.addEventListener('click', newCreation);
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveCreation);
    }
}

/**
 * Set up sidebar functionality
 */
function setupSidebar() {
    const collapseSidebar = document.getElementById('collapseSidebar');
    const sidebar = document.querySelector('.sidebar');
    
    if (collapseSidebar && sidebar) {
        collapseSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            
            // Update icon
            const icon = collapseSidebar.querySelector('i');
            if (icon) {
                if (sidebar.classList.contains('collapsed')) {
                    icon.className = 'fas fa-chevron-right';
                } else {
                    icon.className = 'fas fa-chevron-left';
                }
            }
            
            // Resize Blockly workspace
            setTimeout(() => {
                BlocklyConfig.resize();
            }, 300);
        });
    }
}

/**
 * Set up code panel
 */
function setupCodePanel() {
    const toggleCodeBtn = document.getElementById('toggleCodeBtn');
    const codePanel = document.getElementById('codePanel');
    
    if (toggleCodeBtn && codePanel) {
        toggleCodeBtn.addEventListener('click', () => {
            codePanel.classList.toggle('collapsed');
            
            // Update icon
            const icon = toggleCodeBtn.querySelector('i');
            if (icon) {
                if (codePanel.classList.contains('collapsed')) {
                    icon.className = 'fas fa-chevron-up';
                } else {
                    icon.className = 'fas fa-chevron-down';
                }
            }
            
            // Resize Blockly workspace
            setTimeout(() => {
                BlocklyConfig.resize();
            }, 300);
        });
    }
}

/**
 * Set up workspace controls
 */
function setupWorkspaceControls() {
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomResetBtn = document.getElementById('zoomResetBtn');
    const centerBtn = document.getElementById('centerBtn');
    const cleanupBtn = document.getElementById('cleanupBtn');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => BlocklyConfig.zoom('in'));
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => BlocklyConfig.zoom('out'));
    }
    
    if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', () => BlocklyConfig.zoom('reset'));
    }
    
    if (centerBtn) {
        centerBtn.addEventListener('click', () => BlocklyConfig.center());
    }
    
    if (cleanupBtn) {
        cleanupBtn.addEventListener('click', () => BlocklyConfig.cleanup());
    }
}

/**
 * Set up creation name input
 */
function setupCreationNameInput() {
    const nameInput = document.getElementById('creationName');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            AppState.currentCreationName = e.target.value;
            AppState.isDirty = true;
            updateLastSaved('Unsaved changes');
        });
        
        nameInput.addEventListener('blur', () => {
            if (!nameInput.value.trim()) {
                nameInput.value = 'My R1 Creation';
                AppState.currentCreationName = 'My R1 Creation';
            }
        });
    }
}

/**
 * Set up workspace change listeners
 */
function setupWorkspaceListeners() {
    if (AppState.workspace) {
        AppState.workspace.addChangeListener((event) => {
            if (event.type === Blockly.Events.BLOCK_CREATE ||
                event.type === Blockly.Events.BLOCK_DELETE ||
                event.type === Blockly.Events.BLOCK_CHANGE ||
                event.type === Blockly.Events.BLOCK_MOVE) {
                
                AppState.isDirty = true;
                updateLastSaved('Unsaved changes');
            }
        });
    }
}

/**
 * Set up keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'n':
                    e.preventDefault();
                    newCreation();
                    break;
                case 's':
                    e.preventDefault();
                    saveCreation();
                    break;
                case 'o':
                    e.preventDefault();
                    // Open template modal
                    if (window.templateManager) {
                        window.templateManager.showTemplatesModal();
                    }
                    break;
                case 'e':
                    e.preventDefault();
                    // Quick export
                    if (window.creationExporter) {
                        window.creationExporter.quickExportHtml();
                    }
                    break;
                case 'p':
                    e.preventDefault();
                    // Preview
                    if (window.creationPreviewer) {
                        window.creationPreviewer.showPreviewModal();
                    }
                    break;
                case 'z':
                    if (e.shiftKey) {
                        e.preventDefault();
                        // Redo (Ctrl+Shift+Z)
                        if (AppState.workspace) {
                            // Blockly doesn't have built-in redo, but we can implement it
                        }
                    } else {
                        e.preventDefault();
                        // Undo (Ctrl+Z)
                        if (AppState.workspace) {
                            // Blockly doesn't have built-in undo, but we can implement it
                        }
                    }
                    break;
            }
        }
        
        // Escape key to close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

/**
 * Set up auto-save functionality
 */
function setupAutoSave() {
    // Auto-save every 30 seconds if there are changes
    setInterval(() => {
        if (AppState.isDirty && AppState.workspace && AppState.workspace.getAllBlocks().length > 0) {
            autoSave();
        }
    }, 30000);
}

/**
 * Create new creation
 */
function newCreation() {
    if (AppState.isDirty) {
        const confirmed = confirm(
            'You have unsaved changes. Create a new creation anyway?'
        );
        if (!confirmed) return;
    }
    
    // Clear workspace
    if (AppState.workspace) {
        AppState.workspace.clear();
    }
    
    // Reset creation name
    const nameInput = document.getElementById('creationName');
    if (nameInput) {
        nameInput.value = 'My R1 Creation';
    }
    
    AppState.currentCreationName = 'My R1 Creation';
    AppState.isDirty = false;
    AppState.lastSaved = null;
    
    updateLastSaved('Never saved');
    showToast('New creation started', 'success');
}

/**
 * Save creation
 */
async function saveCreation() {
    if (!AppState.workspace) {
        showToast('No workspace to save', 'error');
        return;
    }
    
    try {
        showLoading('Saving creation...');
        
        const workspaceXml = BlocklyConfig.getXml();
        const saveData = {
            name: AppState.currentCreationName,
            workspace_xml: workspaceXml,
            created_at: new Date().toISOString()
        };
        
        // In a real implementation, you would save to a server
        // For now, save to localStorage
        const savedCreations = JSON.parse(localStorage.getItem('savedCreations') || '[]');
        const existingIndex = savedCreations.findIndex(c => c.name === AppState.currentCreationName);
        
        if (existingIndex >= 0) {
            savedCreations[existingIndex] = saveData;
        } else {
            savedCreations.push(saveData);
        }
        
        localStorage.setItem('savedCreations', JSON.stringify(savedCreations));
        
        AppState.isDirty = false;
        AppState.lastSaved = new Date();
        
        updateLastSaved(AppState.lastSaved.toLocaleTimeString());
        showToast('Creation saved successfully', 'success');
        
    } catch (error) {
        console.error('Save error:', error);
        showToast(`Save failed: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Auto-save creation
 */
async function autoSave() {
    try {
        const workspaceXml = BlocklyConfig.getXml();
        const autoSaveData = {
            name: AppState.currentCreationName,
            workspace_xml: workspaceXml,
            auto_saved_at: new Date().toISOString()
        };
        
        localStorage.setItem('autoSave', JSON.stringify(autoSaveData));
        console.log('Auto-saved creation');
        
    } catch (error) {
        console.error('Auto-save error:', error);
    }
}

/**
 * Load auto-saved creation
 */
function loadAutoSave() {
    try {
        const autoSaveData = JSON.parse(localStorage.getItem('autoSave') || 'null');
        if (autoSaveData && autoSaveData.workspace_xml) {
            const confirmed = confirm(
                `Found auto-saved creation "${autoSaveData.name}" from ${new Date(autoSaveData.auto_saved_at).toLocaleString()}. Load it?`
            );
            
            if (confirmed) {
                BlocklyConfig.loadXml(autoSaveData.workspace_xml);
                
                const nameInput = document.getElementById('creationName');
                if (nameInput) {
                    nameInput.value = autoSaveData.name;
                }
                
                AppState.currentCreationName = autoSaveData.name;
                showToast('Auto-saved creation loaded', 'success');
            }
        }
    } catch (error) {
        console.error('Error loading auto-save:', error);
    }
}

/**
 * Close all open modals
 */
function closeAllModals() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
    document.body.style.overflow = '';
}

/**
 * Update UI elements
 */
function updateLastSaved(text) {
    const lastSavedElement = document.getElementById('lastSaved');
    if (lastSavedElement) {
        lastSavedElement.textContent = text;
    }
}

function updateConnectionStatus(status) {
    const connectionStatusElement = document.getElementById('connectionStatus');
    if (connectionStatusElement) {
        connectionStatusElement.textContent = status;
    }
}

/**
 * Toast notification system
 */
function initializeToastSystem() {
    // Toast container should already exist in HTML
    console.log('Toast system initialized');
}

function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.warn('Toast container not found, falling back to console');
        console.log(`[${type.toUpperCase()}] ${message}`);
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, duration);
    
    // Click to dismiss
    toast.addEventListener('click', () => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    });
}

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Loading overlay system
 */
function initializeLoadingSystem() {
    console.log('Loading system initialized');
}

function showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        const messageElement = overlay.querySelector('p');
        if (messageElement) {
            messageElement.textContent = message;
        }
        overlay.classList.add('show');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

/**
 * Window resize handler
 */
function handleResize() {
    if (AppState.workspace) {
        BlocklyConfig.resize();
    }
}

/**
 * Window beforeunload handler
 */
function handleBeforeUnload(e) {
    if (AppState.isDirty) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        e.returnValue = message;
        return message;
    }
}

/**
 * Error handler
 */
function handleError(error) {
    console.error('Application error:', error);
    showToast(`Error: ${error.message}`, 'error');
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Set up global error handling
    window.addEventListener('error', (e) => handleError(e.error));
    window.addEventListener('unhandledrejection', (e) => handleError(e.reason));
    
    // Set up window event handlers
    window.addEventListener('resize', handleResize);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Initialize the application
    initializeApp();
    
    // Check for auto-saved content
    setTimeout(() => {
        loadAutoSave();
    }, 1000);
});

// Export global functions
window.AppState = AppState;
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.newCreation = newCreation;
window.saveCreation = saveCreation;
