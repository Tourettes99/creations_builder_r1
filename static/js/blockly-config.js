/**
 * Blockly Configuration for R1 Creations Builder
 */

// Global Blockly workspace
let workspace = null;

// Blockly configuration
const BLOCKLY_CONFIG = {
    toolbox: {
        kind: 'categoryToolbox',
        contents: [
            {
                kind: 'category',
                name: 'Triggers',
                categorystyle: 'trigger_category',
                contents: [
                    {
                        kind: 'block',
                        type: 'voice_command'
                    },
                    {
                        kind: 'block',
                        type: 'timer_trigger'
                    },
                    {
                        kind: 'block',
                        type: 'hardware_button'
                    },
                    {
                        kind: 'block',
                        type: 'accelerometer_trigger'
                    }
                ]
            },
            {
                kind: 'category',
                name: 'Actions',
                categorystyle: 'action_category',
                contents: [
                    {
                        kind: 'block',
                        type: 'send_notification'
                    },
                    {
                        kind: 'block',
                        type: 'speak_text'
                    },
                    {
                        kind: 'block',
                        type: 'web_request'
                    },
                    {
                        kind: 'block',
                        type: 'store_data'
                    }
                ]
            },
            {
                kind: 'category',
                name: 'Logic',
                categorystyle: 'logic_category',
                contents: [
                    {
                        kind: 'block',
                        type: 'wait_block'
                    },
                    {
                        kind: 'block',
                        type: 'controls_if'
                    },
                    {
                        kind: 'block',
                        type: 'logic_compare'
                    },
                    {
                        kind: 'block',
                        type: 'logic_operation'
                    },
                    {
                        kind: 'block',
                        type: 'logic_negate'
                    },
                    {
                        kind: 'block',
                        type: 'logic_boolean'
                    }
                ]
            },
            {
                kind: 'category',
                name: 'Math',
                categorystyle: 'math_category',
                contents: [
                    {
                        kind: 'block',
                        type: 'math_number'
                    },
                    {
                        kind: 'block',
                        type: 'math_arithmetic'
                    },
                    {
                        kind: 'block',
                        type: 'math_single'
                    },
                    {
                        kind: 'block',
                        type: 'math_trig'
                    },
                    {
                        kind: 'block',
                        type: 'math_constant'
                    },
                    {
                        kind: 'block',
                        type: 'math_round'
                    },
                    {
                        kind: 'block',
                        type: 'math_random_int'
                    }
                ]
            },
            {
                kind: 'category',
                name: 'Text',
                categorystyle: 'text_category',
                contents: [
                    {
                        kind: 'block',
                        type: 'text'
                    },
                    {
                        kind: 'block',
                        type: 'text_join'
                    },
                    {
                        kind: 'block',
                        type: 'text_append'
                    },
                    {
                        kind: 'block',
                        type: 'text_length'
                    },
                    {
                        kind: 'block',
                        type: 'text_isEmpty'
                    },
                    {
                        kind: 'block',
                        type: 'text_indexOf'
                    },
                    {
                        kind: 'block',
                        type: 'text_charAt'
                    }
                ]
            },
            {
                kind: 'category',
                name: 'Variables',
                categorystyle: 'variable_category',
                custom: 'VARIABLE'
            },
            {
                kind: 'category',
                name: 'Functions',
                categorystyle: 'procedure_category',
                custom: 'PROCEDURE'
            }
        ]
    },
    theme: {
        name: 'r1CreationsTheme',
        categoryStyles: {
            trigger_category: {
                colour: '#28a745'
            },
            action_category: {
                colour: '#007bff'
            },
            logic_category: {
                colour: '#6f42c1'
            },
            math_category: {
                colour: '#fd7e14'
            },
            text_category: {
                colour: '#20c997'
            },
            variable_category: {
                colour: '#e83e8c'
            },
            procedure_category: {
                colour: '#6c757d'
            }
        },
        blockStyles: {
            trigger_blocks: {
                colourPrimary: '#28a745',
                colourSecondary: '#218838',
                colourTertiary: '#1e7e34'
            },
            action_blocks: {
                colourPrimary: '#007bff',
                colourSecondary: '#0056b3',
                colourTertiary: '#004085'
            },
            logic_blocks: {
                colourPrimary: '#6f42c1',
                colourSecondary: '#5a32a3',
                colourTertiary: '#452682'
            },
            math_blocks: {
                colourPrimary: '#fd7e14',
                colourSecondary: '#e8650e',
                colourTertiary: '#d3520a'
            },
            text_blocks: {
                colourPrimary: '#20c997',
                colourSecondary: '#1ba085',
                colourTertiary: '#168070'
            },
            variable_blocks: {
                colourPrimary: '#e83e8c',
                colourSecondary: '#d91a72',
                colourTertiary: '#c21765'
            }
        },
        componentStyles: {
            workspaceBackgroundColour: '#f8f9fa',
            toolboxBackgroundColour: '#ffffff',
            toolboxForegroundColour: '#495057',
            flyoutBackgroundColour: '#ffffff',
            flyoutForegroundColour: '#495057',
            flyoutOpacity: 0.95,
            scrollbarColour: '#6c757d',
            insertionMarkerColour: '#007bff',
            insertionMarkerOpacity: 0.3,
            markerColour: '#ffc107',
            cursorColour: '#007bff'
        }
    },
    renderer: 'zelos',
    grid: {
        spacing: 20,
        length: 3,
        colour: '#e9ecef',
        snap: true
    },
    zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
    },
    trashcan: true,
    media: 'https://unpkg.com/blockly/media/',
    move: {
        scrollbars: {
            horizontal: true,
            vertical: true
        },
        drag: true,
        wheel: true
    }
};

/**
 * Initialize Blockly workspace
 */
function initializeBlockly() {
    const blocklyDiv = document.getElementById('blocklyDiv');
    if (!blocklyDiv) {
        console.error('Blockly div not found');
        return;
    }

    try {
        // Create custom theme
        const r1Theme = Blockly.Theme.defineTheme('r1CreationsTheme', BLOCKLY_CONFIG.theme);
        
        // Initialize workspace
        workspace = Blockly.inject(blocklyDiv, {
            ...BLOCKLY_CONFIG,
            theme: r1Theme
        });

        // Add event listeners
        workspace.addChangeListener(onWorkspaceChange);
        
        // Add resize listener
        window.addEventListener('resize', resizeBlockly);
        
        console.log('Blockly workspace initialized successfully');
        updateWorkspaceStatus('Ready');
        
        return workspace;
    } catch (error) {
        console.error('Error initializing Blockly:', error);
        showToast('Failed to initialize Blockly workspace', 'error');
        return null;
    }
}

/**
 * Handle workspace changes
 */
function onWorkspaceChange(event) {
    if (workspace.isDragging()) {
        return; // Don't update during drag
    }
    
    try {
        // Update block count
        const blockCount = workspace.getAllBlocks().length;
        updateBlockCount(blockCount);
        
        // Generate and display code
        if (typeof generateCode === 'function') {
            generateCode();
        }
        
        // Update workspace status
        if (blockCount === 0) {
            updateWorkspaceStatus('Empty workspace - drag blocks here to start');
        } else {
            updateWorkspaceStatus(`${blockCount} blocks in workspace`);
        }
        
    } catch (error) {
        console.error('Error handling workspace change:', error);
        updateWorkspaceStatus('Error in workspace');
    }
}

/**
 * Resize Blockly workspace
 */
function resizeBlockly() {
    if (workspace) {
        try {
            Blockly.svgResize(workspace);
        } catch (error) {
            console.error('Error resizing Blockly:', error);
        }
    }
}

/**
 * Clear workspace
 */
function clearWorkspace() {
    if (workspace) {
        if (confirm('Are you sure you want to clear the workspace? This action cannot be undone.')) {
            workspace.clear();
            showToast('Workspace cleared', 'info');
        }
    }
}

/**
 * Center workspace view
 */
function centerWorkspace() {
    if (workspace) {
        try {
            workspace.scrollCenter();
            showToast('Workspace centered', 'info');
        } catch (error) {
            console.error('Error centering workspace:', error);
        }
    }
}

/**
 * Zoom workspace
 */
function zoomWorkspace(direction) {
    if (workspace) {
        try {
            const currentScale = workspace.scale;
            let newScale;
            
            if (direction === 'in') {
                newScale = Math.min(currentScale * 1.2, 3);
            } else if (direction === 'out') {
                newScale = Math.max(currentScale / 1.2, 0.3);
            } else if (direction === 'reset') {
                newScale = 1.0;
            } else {
                return;
            }
            
            workspace.setScale(newScale);
            showToast(`Zoom: ${Math.round(newScale * 100)}%`, 'info');
        } catch (error) {
            console.error('Error zooming workspace:', error);
        }
    }
}

/**
 * Clean up workspace blocks
 */
function cleanupWorkspace() {
    if (workspace) {
        try {
            workspace.cleanUp();
            showToast('Workspace organized', 'success');
        } catch (error) {
            console.error('Error cleaning up workspace:', error);
        }
    }
}

/**
 * Get workspace XML
 */
function getWorkspaceXml() {
    if (workspace) {
        try {
            // Handle both old and new Blockly API versions
            if (Blockly.serialization && Blockly.serialization.workspaces) {
                // Very new API - use serialization
                const state = Blockly.serialization.workspaces.save(workspace);
                return JSON.stringify(state);
            } else if (Blockly.utils && Blockly.utils.xml) {
                // New API (Blockly 7+)
                const xml = Blockly.utils.xml.workspaceToDom(workspace);
                return Blockly.utils.xml.domToText(xml);
            } else if (Blockly.Xml) {
                // Old API (Blockly 6 and earlier)
                const xml = Blockly.Xml.workspaceToDom(workspace);
                return Blockly.Xml.domToText(xml);
            } else {
                throw new Error('Blockly XML API not available');
            }
        } catch (error) {
            console.error('Error getting workspace XML:', error);
            return '';
        }
    }
    return '';
}

/**
 * Load workspace from XML
 */
function loadWorkspaceXml(xmlText) {
    if (workspace && xmlText) {
        try {
            // Handle both old and new Blockly API versions
            let xml;
            if (Blockly.utils && Blockly.utils.xml && Blockly.utils.xml.textToDom) {
                // New API (Blockly 7+)
                xml = Blockly.utils.xml.textToDom(xmlText);
            } else if (Blockly.Xml && Blockly.Xml.textToDom) {
                // Old API (Blockly 6 and earlier)
                xml = Blockly.Xml.textToDom(xmlText);
            } else {
                throw new Error('Blockly XML API not available');
            }
            
            workspace.clear();
            
            // Handle both old and new Blockly API versions for domToWorkspace
            if (Blockly.serialization && Blockly.serialization.workspaces) {
                // Very new API - try serialization first
                try {
                    const state = Blockly.serialization.workspaces.load(JSON.parse(xmlText), workspace);
                } catch (serializationError) {
                    // Fallback to XML if serialization fails
                    if (Blockly.utils && Blockly.utils.xml && Blockly.utils.xml.domToWorkspace) {
                        Blockly.utils.xml.domToWorkspace(xml, workspace);
                    } else if (Blockly.Xml && Blockly.Xml.domToWorkspace) {
                        Blockly.Xml.domToWorkspace(xml, workspace);
                    }
                }
            } else if (Blockly.utils && Blockly.utils.xml && Blockly.utils.xml.domToWorkspace) {
                // New API
                Blockly.utils.xml.domToWorkspace(xml, workspace);
            } else if (Blockly.Xml && Blockly.Xml.domToWorkspace) {
                // Old API
                Blockly.Xml.domToWorkspace(xml, workspace);
            } else {
                throw new Error('Blockly domToWorkspace API not available');
            }
            
            showToast('Workspace loaded successfully', 'success');
            return true;
        } catch (error) {
            console.error('Error loading workspace XML:', error);
            showToast('Failed to load workspace', 'error');
            return false;
        }
    }
    return false;
}

/**
 * Update UI elements
 */
function updateBlockCount(count) {
    const blockCountElement = document.getElementById('blockCount');
    if (blockCountElement) {
        blockCountElement.textContent = `${count} block${count !== 1 ? 's' : ''}`;
    }
}

function updateWorkspaceStatus(status) {
    const statusElement = document.getElementById('workspaceStatus');
    if (statusElement) {
        statusElement.textContent = status;
    }
}

// Export functions for global access
window.BlocklyConfig = {
    initialize: initializeBlockly,
    resize: resizeBlockly,
    clear: clearWorkspace,
    center: centerWorkspace,
    zoom: zoomWorkspace,
    cleanup: cleanupWorkspace,
    getXml: getWorkspaceXml,
    loadXml: loadWorkspaceXml,
    workspace: () => workspace
};
