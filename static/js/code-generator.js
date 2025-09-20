/**
 * Code Generator for R1 Creation Blocks
 */

// Global code generation state
let generatedCode = '';
let lastGeneratedCode = '';

/**
 * Initialize code generators for custom blocks
 */
function initializeCodeGenerators() {
    if (typeof Blockly === 'undefined' || !Blockly.JavaScript) {
        console.error('Blockly JavaScript generator not available');
        return;
    }
    
    // Define code generators for custom blocks
    defineR1CodeGenerators();
    console.log('R1 code generators initialized');
}

/**
 * Helper function to get the JavaScript generator
 */
function getJavaScriptGenerator() {
    return Blockly.JavaScript || window.javascriptGenerator || Blockly.generators?.javascript;
}

/**
 * Helper function to get statement code
 */
function getStatementCode(block, statementName) {
    const jsGenerator = getJavaScriptGenerator();
    return jsGenerator ? (jsGenerator.statementToCode(block, statementName) || '') : '';
}

/**
 * Helper function to get next statement code (for blocks that use setNextStatement)
 */
function getNextStatementCode(block) {
    const jsGenerator = getJavaScriptGenerator();
    if (!jsGenerator) return '';
    
    // For blocks that use setNextStatement, we need to get the next block's code
    const nextBlock = block.getNextBlock();
    if (nextBlock) {
        return jsGenerator.blockToCode(nextBlock) || '';
    }
    return '';
}

/**
 * Define all R1 code generators
 */
function defineR1CodeGenerators() {
    // Handle both old and new Blockly JavaScript generator APIs
    const jsGenerator = Blockly.JavaScript || window.javascriptGenerator || Blockly.generators?.javascript;
    
    if (!jsGenerator) {
        console.error('JavaScript generator not available');
        return;
    }
    
    console.log('Registering R1 block generators...');
    
    // Trigger block generators
    jsGenerator.forBlock['voice_command'] = generateVoiceCommandCode;
    jsGenerator.forBlock['timer_trigger'] = generateTimerTriggerCode;
    jsGenerator.forBlock['hardware_button'] = generateHardwareButtonCode;
    jsGenerator.forBlock['accelerometer_trigger'] = generateAccelerometerTriggerCode;
    
    // Action block generators
    jsGenerator.forBlock['send_notification'] = generateSendNotificationCode;
    jsGenerator.forBlock['speak_text'] = generateSpeakTextCode;
    jsGenerator.forBlock['web_request'] = generateWebRequestCode;
    jsGenerator.forBlock['store_data'] = generateStoreDataCode;
    
    // Logic block generators
    jsGenerator.forBlock['wait_block'] = generateWaitBlockCode;
    
    // Also register with old API for compatibility
    if (Blockly.JavaScript) {
        Blockly.JavaScript['voice_command'] = generateVoiceCommandCode;
        Blockly.JavaScript['timer_trigger'] = generateTimerTriggerCode;
        Blockly.JavaScript['hardware_button'] = generateHardwareButtonCode;
        Blockly.JavaScript['accelerometer_trigger'] = generateAccelerometerTriggerCode;
        Blockly.JavaScript['send_notification'] = generateSendNotificationCode;
        Blockly.JavaScript['speak_text'] = generateSpeakTextCode;
        Blockly.JavaScript['web_request'] = generateWebRequestCode;
        Blockly.JavaScript['store_data'] = generateStoreDataCode;
        Blockly.JavaScript['wait_block'] = generateWaitBlockCode;
    }
    
    console.log('R1 block generators registered successfully');
}

/**
 * Voice Command Code Generator
 */
function generateVoiceCommandCode(block) {
    const command = block.getFieldValue('COMMAND') || 'hello';
    const statements = getNextStatementCode(block);
    
    const code = `
// Voice command trigger: "${command}"
window.addEventListener('voiceCommand', function(event) {
    if (event.detail && event.detail.command && 
        event.detail.command.toLowerCase().includes('${command.toLowerCase()}')) {
        console.log('Voice command detected: ${command}');
        ${statements}
    }
});

// Mock voice command for browser testing
if (typeof PluginMessageHandler === 'undefined') {
    console.log('Setting up mock voice command for: ${command}');
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent('voiceCommand', {
            detail: { command: '${command}' }
        }));
    }, 2000);
}
`;
    
    return code;
}

/**
 * Timer Trigger Code Generator
 */
function generateTimerTriggerCode(block) {
    const interval = block.getFieldValue('INTERVAL') || 5;
    const unit = block.getFieldValue('UNIT') || 'SECONDS';
    const statements = getNextStatementCode(block);
    
    const multiplier = unit === 'MINUTES' ? 60000 : unit === 'HOURS' ? 3600000 : 1000;
    const milliseconds = interval * multiplier;
    
    const code = `
// Timer trigger: every ${interval} ${unit.toLowerCase()}
setInterval(function() {
    console.log('Timer triggered: ${interval} ${unit.toLowerCase()}');
    ${statements}
}, ${milliseconds});
`;
    
    return code;
}

/**
 * Hardware Button Code Generator
 */
function generateHardwareButtonCode(block) {
    const button = block.getFieldValue('BUTTON') || 'SIDE';
    const action = block.getFieldValue('ACTION') || 'CLICK';
    const statements = getNextStatementCode(block);
    
    let eventName;
    switch (button) {
        case 'SIDE':
            eventName = action === 'PRESS' ? 'longPressStart' : action === 'RELEASE' ? 'longPressEnd' : 'sideClick';
            break;
        case 'SCROLL_UP':
            eventName = 'scrollUp';
            break;
        case 'SCROLL_DOWN':
            eventName = 'scrollDown';
            break;
        default:
            eventName = 'sideClick';
    }
    
    const code = `
// Hardware button trigger: ${button} ${action}
window.addEventListener('${eventName}', function() {
    console.log('Hardware button triggered: ${button} ${action}');
    ${statements}
});
`;
    
    return code;
}

/**
 * Accelerometer Trigger Code Generator
 */
function generateAccelerometerTriggerCode(block) {
    const direction = block.getFieldValue('DIRECTION') || 'LEFT';
    const threshold = block.getFieldValue('THRESHOLD') || 0.5;
    const statements = getNextStatementCode(block);
    
    const code = `
// Accelerometer trigger: ${direction} > ${threshold}
if (window.creationSensors && window.creationSensors.accelerometer) {
    window.creationSensors.accelerometer.start(function(data) {
        let triggered = false;
        
        if ('${direction}' === 'LEFT' && data.x < -${threshold}) triggered = true;
        if ('${direction}' === 'RIGHT' && data.x > ${threshold}) triggered = true;
        if ('${direction}' === 'FORWARD' && data.y > ${threshold}) triggered = true;
        if ('${direction}' === 'BACKWARD' && data.y < -${threshold}) triggered = true;
        
        if (triggered) {
            console.log('Accelerometer triggered: ${direction} > ${threshold}');
            ${statements}
        }
    }, { frequency: 10 });
} else {
    console.log('Accelerometer not available');
}
`;
    
    return code;
}

/**
 * Send Notification Code Generator
 */
function generateSendNotificationCode(block) {
    const message = block.getFieldValue('MESSAGE') || 'Hello from R1!';
    
    const code = `
// Show notification
console.log('Notification: ${message}');
if (typeof PluginMessageHandler !== 'undefined') {
    PluginMessageHandler.postMessage(JSON.stringify({
        message: "${message}",
        useLLM: false
    }));
} else {
    // Browser fallback
    if (typeof showNotification === 'function') {
        showNotification("${message}");
    } else {
        alert("Notification: ${message}");
    }
}
`;
    
    return code;
}

/**
 * Speak Text Code Generator
 */
function generateSpeakTextCode(block) {
    const text = block.getFieldValue('TEXT') || 'Hello';
    const saveToJournal = block.getFieldValue('SAVE_TO_JOURNAL') === 'TRUE';
    
    const code = `
// Speak text
console.log('Speaking: ${text}');
if (typeof PluginMessageHandler !== 'undefined') {
    PluginMessageHandler.postMessage(JSON.stringify({
        message: "${text}",
        useLLM: true,
        wantsR1Response: true,
        wantsJournalEntry: ${saveToJournal}
    }));
} else {
    // Browser fallback
    console.log('Speak (mock): ${text}');
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("${text}");
        speechSynthesis.speak(utterance);
    }
}
`;
    
    return code;
}

/**
 * Web Request Code Generator
 */
function generateWebRequestCode(block) {
    const method = block.getFieldValue('METHOD') || 'GET';
    const url = block.getFieldValue('URL') || 'https://api.example.com';
    
    const code = `
// Web request
console.log('Making ${method} request to: ${url}');
try {
    fetch('${url}', { 
        method: '${method}',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Web request response:', data);
        // Handle response data here
    })
    .catch(error => {
        console.error('Web request error:', error);
    });
} catch (error) {
    console.error('Web request failed:', error);
}
`;
    
    return code;
}

/**
 * Store Data Code Generator
 */
function generateStoreDataCode(block) {
    const value = block.getFieldValue('VALUE') || 'my data';
    const key = block.getFieldValue('KEY') || 'my_key';
    const storageType = block.getFieldValue('STORAGE_TYPE') || 'plain';
    
    const code = `
// Store data
console.log('Storing data: ${key} = ${value}');
if (window.creationStorage && window.creationStorage.${storageType}) {
    window.creationStorage.${storageType}.setItem('${key}', btoa('${value}'))
        .then(() => {
            console.log('Data stored successfully: ${key}');
        })
        .catch(error => {
            console.error('Error storing data:', error);
        });
} else {
    // Browser fallback
    localStorage.setItem('r1_${storageType}_${key}', '${value}');
    console.log('Data stored to localStorage: ${key}');
}
`;
    
    return code;
}

/**
 * Wait Block Code Generator
 */
function generateWaitBlockCode(block) {
    const duration = block.getFieldValue('DURATION') || 1;
    const unit = block.getFieldValue('UNIT') || 'SECONDS';
    
    const multiplier = unit === 'MINUTES' ? 60000 : 1000;
    const milliseconds = duration * multiplier;
    
    const code = `
// Wait ${duration} ${unit.toLowerCase()}
console.log('Waiting ${duration} ${unit.toLowerCase()}...');
await new Promise(resolve => setTimeout(resolve, ${milliseconds}));
console.log('Wait complete');
`;
    
    return code;
}

/**
 * Generate complete code from workspace
 */
function generateCode() {
    if (!workspace) {
        console.error('Workspace not available');
        return '';
    }
    
    try {
        // Handle both old and new Blockly JavaScript generator APIs
        const jsGenerator = getJavaScriptGenerator();
        
        if (!jsGenerator) {
            throw new Error('JavaScript generator not available');
        }
        
        // Generate JavaScript code
        const code = jsGenerator.workspaceToCode(workspace);
        
        // Wrap in async function for await support
        const wrappedCode = `
// Generated R1 Creation Code
// Generated at: ${new Date().toLocaleString()}

(async function() {
    console.log('R1 Creation code starting...');
    
    try {
        ${code}
        
        console.log('R1 Creation code completed successfully');
    } catch (error) {
        console.error('Error in R1 Creation code:', error);
    }
})();
`;
        
        generatedCode = wrappedCode;
        displayGeneratedCode(wrappedCode);
        
        return wrappedCode;
    } catch (error) {
        console.error('Error generating code:', error);
        const errorCode = `// Error generating code: ${error.message}`;
        displayGeneratedCode(errorCode);
        return errorCode;
    }
}

/**
 * Display generated code in the UI
 */
function displayGeneratedCode(code) {
    const codeDisplay = document.getElementById('generatedCode');
    if (codeDisplay) {
        codeDisplay.textContent = code;
        
        // Highlight changes
        if (code !== lastGeneratedCode) {
            codeDisplay.style.backgroundColor = '#fff3cd';
            setTimeout(() => {
                codeDisplay.style.backgroundColor = '';
            }, 1000);
        }
        
        lastGeneratedCode = code;
    }
}

/**
 * Get the current generated code
 */
function getCurrentGeneratedCode() {
    return generatedCode;
}

/**
 * Format code for export
 */
function formatCodeForExport() {
    if (!generatedCode) {
        generateCode();
    }
    
    return generatedCode.replace(/^\s*\/\/ Generated R1 Creation Code[\s\S]*?\n\n/, '');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Blockly to be available
    const checkBlockly = setInterval(() => {
        if (typeof Blockly !== 'undefined' && Blockly.JavaScript) {
            initializeCodeGenerators();
            clearInterval(checkBlockly);
        }
    }, 100);
    
    // Timeout after 5 seconds
    setTimeout(() => {
        clearInterval(checkBlockly);
        if (typeof Blockly === 'undefined') {
            console.error('Blockly failed to load within 5 seconds');
        }
    }, 5000);
});

// Export functions
window.CodeGenerator = {
    generate: generateCode,
    getCurrent: getCurrentGeneratedCode,
    formatForExport: formatCodeForExport
};
