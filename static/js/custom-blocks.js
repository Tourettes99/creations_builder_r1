/**
 * Custom R1 Creation Blocks for Blockly
 */

// Wait for Blockly to be loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Blockly === 'undefined') {
        console.error('Blockly not loaded');
        return;
    }
    
    defineR1Blocks();
    console.log('R1 custom blocks defined successfully');
});

/**
 * Define all R1 custom blocks
 */
function defineR1Blocks() {
    // Trigger Blocks
    defineVoiceCommandBlock();
    defineTimerTriggerBlock();
    defineHardwareButtonBlock();
    defineAccelerometerTriggerBlock();
    
    // Action Blocks
    defineSendNotificationBlock();
    defineSpeakTextBlock();
    defineWebRequestBlock();
    defineStoreDataBlock();
    
    // Logic Blocks
    defineWaitBlock();
}

/**
 * Voice Command Trigger Block
 */
function defineVoiceCommandBlock() {
    Blockly.Blocks['voice_command'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("when voice command")
                .appendField(new Blockly.FieldTextInput("hello"), "COMMAND");
            this.setNextStatement(true, null);
            this.setColour('#28a745');
            this.setTooltip("Triggers when a specific voice command is detected");
            this.setHelpUrl("");
            this.setStyle('trigger_blocks');
        }
    };
}

/**
 * Timer Trigger Block
 */
function defineTimerTriggerBlock() {
    Blockly.Blocks['timer_trigger'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("every")
                .appendField(new Blockly.FieldNumber(5, 1), "INTERVAL")
                .appendField(new Blockly.FieldDropdown([
                    ["seconds", "SECONDS"],
                    ["minutes", "MINUTES"],
                    ["hours", "HOURS"]
                ]), "UNIT");
            this.setNextStatement(true, null);
            this.setColour('#28a745');
            this.setTooltip("Triggers at regular intervals");
            this.setHelpUrl("");
            this.setStyle('trigger_blocks');
        }
    };
}

/**
 * Hardware Button Block
 */
function defineHardwareButtonBlock() {
    Blockly.Blocks['hardware_button'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("when")
                .appendField(new Blockly.FieldDropdown([
                    ["side (PTT)", "SIDE"],
                    ["scroll up", "SCROLL_UP"],
                    ["scroll down", "SCROLL_DOWN"]
                ]), "BUTTON")
                .appendField("button")
                .appendField(new Blockly.FieldDropdown([
                    ["is clicked", "CLICK"],
                    ["is pressed", "PRESS"],
                    ["is released", "RELEASE"]
                ]), "ACTION");
            this.setNextStatement(true, null);
            this.setColour('#28a745');
            this.setTooltip("Triggers when hardware buttons are pressed");
            this.setHelpUrl("");
            this.setStyle('trigger_blocks');
        }
    };
}

/**
 * Accelerometer Trigger Block
 */
function defineAccelerometerTriggerBlock() {
    Blockly.Blocks['accelerometer_trigger'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("when device is tilted")
                .appendField(new Blockly.FieldDropdown([
                    ["more left", "LEFT"],
                    ["more right", "RIGHT"],
                    ["more forward", "FORWARD"],
                    ["more backward", "BACKWARD"]
                ]), "DIRECTION")
                .appendField("than")
                .appendField(new Blockly.FieldNumber(0.5, 0.1, 1.0, 0.1), "THRESHOLD");
            this.setNextStatement(true, null);
            this.setColour('#28a745');
            this.setTooltip("Triggers when device is tilted beyond threshold");
            this.setHelpUrl("");
            this.setStyle('trigger_blocks');
        }
    };
}

/**
 * Send Notification Block
 */
function defineSendNotificationBlock() {
    Blockly.Blocks['send_notification'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("show notification")
                .appendField(new Blockly.FieldTextInput("Hello from R1!"), "MESSAGE");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#007bff');
            this.setTooltip("Shows a notification message");
            this.setHelpUrl("");
            this.setStyle('action_blocks');
        }
    };
}

/**
 * Speak Text Block
 */
function defineSpeakTextBlock() {
    Blockly.Blocks['speak_text'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("speak")
                .appendField(new Blockly.FieldTextInput("Hello"), "TEXT");
            this.appendDummyInput()
                .appendField("save to journal")
                .appendField(new Blockly.FieldCheckbox("FALSE"), "SAVE_TO_JOURNAL");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#007bff');
            this.setTooltip("Speaks text using R1 voice");
            this.setHelpUrl("");
            this.setStyle('action_blocks');
        }
    };
}

/**
 * Web Request Block
 */
function defineWebRequestBlock() {
    Blockly.Blocks['web_request'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("send")
                .appendField(new Blockly.FieldDropdown([
                    ["GET", "GET"],
                    ["POST", "POST"]
                ]), "METHOD")
                .appendField("request to")
                .appendField(new Blockly.FieldTextInput("https://api.example.com"), "URL");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#007bff');
            this.setTooltip("Sends an HTTP request");
            this.setHelpUrl("");
            this.setStyle('action_blocks');
        }
    };
}

/**
 * Store Data Block
 */
function defineStoreDataBlock() {
    Blockly.Blocks['store_data'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("store")
                .appendField(new Blockly.FieldTextInput("my data"), "VALUE")
                .appendField("as")
                .appendField(new Blockly.FieldTextInput("my_key"), "KEY")
                .appendField(new Blockly.FieldDropdown([
                    ["securely", "secure"],
                    ["normally", "plain"]
                ]), "STORAGE_TYPE");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#007bff');
            this.setTooltip("Stores data in device storage");
            this.setHelpUrl("");
            this.setStyle('action_blocks');
        }
    };
}

/**
 * Wait Block
 */
function defineWaitBlock() {
    Blockly.Blocks['wait_block'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("wait")
                .appendField(new Blockly.FieldNumber(1, 0.1), "DURATION")
                .appendField(new Blockly.FieldDropdown([
                    ["seconds", "SECONDS"],
                    ["minutes", "MINUTES"]
                ]), "UNIT");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#6f42c1');
            this.setTooltip("Waits for specified duration");
            this.setHelpUrl("");
            this.setStyle('logic_blocks');
        }
    };
}

/**
 * Load custom blocks from server
 */
async function loadCustomBlocksFromServer() {
    try {
        const response = await fetch('/api/blocks');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blocks = await response.json();
        console.log('Loaded custom blocks from server:', blocks);
        
        // Process server-defined blocks
        for (const [category, categoryBlocks] of Object.entries(blocks)) {
            for (const [blockType, blockDef] of Object.entries(categoryBlocks)) {
                defineServerBlock(blockType, blockDef);
            }
        }
        
        return blocks;
    } catch (error) {
        console.error('Error loading custom blocks from server:', error);
        showToast('Failed to load custom blocks', 'warning');
        return {};
    }
}

/**
 * Define a block from server configuration
 */
function defineServerBlock(blockType, blockDef) {
    try {
        Blockly.Blocks[blockType] = {
            init: function() {
                // Parse message and args
                if (blockDef.message0) {
                    const input = this.appendDummyInput();
                    
                    // Simple parsing - in a full implementation, you'd want more sophisticated parsing
                    let message = blockDef.message0;
                    if (blockDef.args0) {
                        blockDef.args0.forEach((arg, index) => {
                            const placeholder = `%${index + 1}`;
                            if (message.includes(placeholder)) {
                                switch (arg.type) {
                                    case 'field_input':
                                        input.appendField(new Blockly.FieldTextInput(arg.text || ''), arg.name);
                                        break;
                                    case 'field_number':
                                        input.appendField(new Blockly.FieldNumber(arg.value || 0, arg.min, arg.max), arg.name);
                                        break;
                                    case 'field_dropdown':
                                        input.appendField(new Blockly.FieldDropdown(arg.options || []), arg.name);
                                        break;
                                    case 'field_checkbox':
                                        input.appendField(new Blockly.FieldCheckbox(arg.checked ? 'TRUE' : 'FALSE'), arg.name);
                                        break;
                                }
                                message = message.replace(placeholder, '');
                            }
                        });
                    }
                    
                    // Add remaining text
                    const textParts = message.split(/(%\d+)/);
                    textParts.forEach(part => {
                        if (part && !part.match(/%\d+/)) {
                            input.appendField(part);
                        }
                    });
                }
                
                // Set connections
                if (blockDef.previousStatement !== undefined) {
                    this.setPreviousStatement(true, blockDef.previousStatement);
                }
                if (blockDef.nextStatement !== undefined) {
                    this.setNextStatement(true, blockDef.nextStatement);
                }
                if (blockDef.output !== undefined) {
                    this.setOutput(true, blockDef.output);
                }
                
                // Set appearance
                if (blockDef.colour) {
                    this.setColour(blockDef.colour);
                }
                if (blockDef.tooltip) {
                    this.setTooltip(blockDef.tooltip);
                }
                if (blockDef.helpUrl) {
                    this.setHelpUrl(blockDef.helpUrl);
                }
            }
        };
        
        console.log(`Defined server block: ${blockType}`);
    } catch (error) {
        console.error(`Error defining server block ${blockType}:`, error);
    }
}

// Load server blocks when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure Blockly is fully loaded
    setTimeout(loadCustomBlocksFromServer, 100);
});
