"""
Block registry system for managing custom Blockly blocks.
"""

import json
from typing import Dict, List, Any


class BlockRegistry:
    """Registry for managing custom Blockly blocks."""
    
    def __init__(self):
        """Initialize the block registry with default R1 creation blocks."""
        self.blocks = {}
        self._load_default_blocks()
    
    def _load_default_blocks(self):
        """Load default blocks for R1 creations."""
        
        # Trigger blocks
        self.register_block('triggers', 'voice_command', {
            'type': 'voice_command',
            'message0': 'when voice command %1',
            'args0': [
                {
                    'type': 'field_input',
                    'name': 'COMMAND',
                    'text': 'hello'
                }
            ],
            'nextStatement': None,
            'colour': 120,
            'tooltip': 'Triggers when a specific voice command is detected',
            'helpUrl': '',
            'code_generator': '''
function(block) {
    var command = block.getFieldValue('COMMAND');
    var code = `// Voice command trigger: ${command}\\n`;
    code += `window.addEventListener('voiceCommand', function(event) {\\n`;
    code += `  if (event.detail.command.toLowerCase().includes('${command.toLowerCase()}')) {\\n`;
    code += `    // Voice command detected\\n`;
    return code;
}'''
        })
        
        self.register_block('triggers', 'timer_trigger', {
            'type': 'timer_trigger',
            'message0': 'every %1 %2',
            'args0': [
                {
                    'type': 'field_number',
                    'name': 'INTERVAL',
                    'value': 5,
                    'min': 1
                },
                {
                    'type': 'field_dropdown',
                    'name': 'UNIT',
                    'options': [
                        ['seconds', 'SECONDS'],
                        ['minutes', 'MINUTES'],
                        ['hours', 'HOURS']
                    ]
                }
            ],
            'nextStatement': None,
            'colour': 120,
            'tooltip': 'Triggers at regular intervals',
            'helpUrl': '',
            'code_generator': '''
function(block) {
    var interval = block.getFieldValue('INTERVAL');
    var unit = block.getFieldValue('UNIT');
    var multiplier = unit === 'MINUTES' ? 60000 : unit === 'HOURS' ? 3600000 : 1000;
    var code = `// Timer trigger: ${interval} ${unit.toLowerCase()}\\n`;
    code += `setInterval(function() {\\n`;
    return code;
}'''
        })
        
        self.register_block('triggers', 'hardware_button', {
            'type': 'hardware_button',
            'message0': 'when %1 button %2',
            'args0': [
                {
                    'type': 'field_dropdown',
                    'name': 'BUTTON',
                    'options': [
                        ['side (PTT)', 'SIDE'],
                        ['scroll up', 'SCROLL_UP'],
                        ['scroll down', 'SCROLL_DOWN']
                    ]
                },
                {
                    'type': 'field_dropdown',
                    'name': 'ACTION',
                    'options': [
                        ['is clicked', 'CLICK'],
                        ['is pressed', 'PRESS'],
                        ['is released', 'RELEASE']
                    ]
                }
            ],
            'nextStatement': None,
            'colour': 120,
            'tooltip': 'Triggers when hardware buttons are pressed',
            'helpUrl': '',
            'code_generator': '''
function(block) {
    var button = block.getFieldValue('BUTTON');
    var action = block.getFieldValue('ACTION');
    var eventName = button === 'SIDE' ? 'sideClick' : button === 'SCROLL_UP' ? 'scrollUp' : 'scrollDown';
    var code = `// Hardware button trigger: ${button} ${action}\\n`;
    code += `window.addEventListener('${eventName}', function() {\\n`;
    return code;
}'''
        })
        
        self.register_block('triggers', 'accelerometer_trigger', {
            'type': 'accelerometer_trigger',
            'message0': 'when device is tilted %1 than %2',
            'args0': [
                {
                    'type': 'field_dropdown',
                    'name': 'DIRECTION',
                    'options': [
                        ['more left', 'LEFT'],
                        ['more right', 'RIGHT'],
                        ['more forward', 'FORWARD'],
                        ['more backward', 'BACKWARD']
                    ]
                },
                {
                    'type': 'field_number',
                    'name': 'THRESHOLD',
                    'value': 0.5,
                    'min': 0.1,
                    'max': 1.0,
                    'precision': 0.1
                }
            ],
            'nextStatement': None,
            'colour': 120,
            'tooltip': 'Triggers when device is tilted beyond threshold',
            'helpUrl': '',
            'code_generator': '''
function(block) {
    var direction = block.getFieldValue('DIRECTION');
    var threshold = block.getFieldValue('THRESHOLD');
    var code = `// Accelerometer trigger: ${direction} > ${threshold}\\n`;
    code += `if (window.creationSensors && window.creationSensors.accelerometer) {\\n`;
    code += `  window.creationSensors.accelerometer.start(function(data) {\\n`;
    code += `    var triggered = false;\\n`;
    code += `    if ('${direction}' === 'LEFT' && data.x < -${threshold}) triggered = true;\\n`;
    code += `    if ('${direction}' === 'RIGHT' && data.x > ${threshold}) triggered = true;\\n`;
    code += `    if ('${direction}' === 'FORWARD' && data.y > ${threshold}) triggered = true;\\n`;
    code += `    if ('${direction}' === 'BACKWARD' && data.y < -${threshold}) triggered = true;\\n`;
    code += `    if (triggered) {\\n`;
    return code;
}'''
        })
        
        # Action blocks
        self.register_block('actions', 'send_notification', {
            'type': 'send_notification',
            'message0': 'show notification %1',
            'args0': [
                {
                    'type': 'field_input',
                    'name': 'MESSAGE',
                    'text': 'Hello from R1!'
                }
            ],
            'previousStatement': None,
            'nextStatement': None,
            'colour': 230,
            'tooltip': 'Shows a notification message',
            'helpUrl': '',
            'code_generator': '''
function(block) {
    var message = block.getFieldValue('MESSAGE');
    var code = `  // Show notification\\n`;
    code += `  if (typeof PluginMessageHandler !== 'undefined') {\\n`;
    code += `    PluginMessageHandler.postMessage(JSON.stringify({\\n`;
    code += `      message: "${message}",\\n`;
    code += `      useLLM: false\\n`;
    code += `    }));\\n`;
    code += `  } else {\\n`;
    code += `    console.log("Notification: ${message}");\\n`;
    code += `  }\\n`;
    return code;
}'''
        })
        
        self.register_block('actions', 'speak_text', {
            'type': 'speak_text',
            'message0': 'speak %1 %2',
            'args0': [
                {
                    'type': 'field_input',
                    'name': 'TEXT',
                    'text': 'Hello'
                },
                {
                    'type': 'field_checkbox',
                    'name': 'SAVE_TO_JOURNAL',
                    'checked': False
                }
            ],
            'message1': 'save to journal %1',
            'args1': [
                {
                    'type': 'input_dummy'
                }
            ],
            'previousStatement': None,
            'nextStatement': None,
            'colour': 230,
            'tooltip': 'Speaks text using R1 voice',
            'helpUrl': '',
            'code_generator': '''
function(block) {
    var text = block.getFieldValue('TEXT');
    var saveToJournal = block.getFieldValue('SAVE_TO_JOURNAL') === 'TRUE';
    var code = `  // Speak text\\n`;
    code += `  if (typeof PluginMessageHandler !== 'undefined') {\\n`;
    code += `    PluginMessageHandler.postMessage(JSON.stringify({\\n`;
    code += `      message: "${text}",\\n`;
    code += `      useLLM: true,\\n`;
    code += `      wantsR1Response: true,\\n`;
    code += `      wantsJournalEntry: ${saveToJournal}\\n`;
    code += `    }));\\n`;
    code += `  } else {\\n`;
    code += `    console.log("Speak: ${text}");\\n`;
    code += `  }\\n`;
    return code;
}'''
        })
        
        self.register_block('actions', 'web_request', {
            'type': 'web_request',
            'message0': 'send %1 request to %2',
            'args0': [
                {
                    'type': 'field_dropdown',
                    'name': 'METHOD',
                    'options': [
                        ['GET', 'GET'],
                        ['POST', 'POST']
                    ]
                },
                {
                    'type': 'field_input',
                    'name': 'URL',
                    'text': 'https://api.example.com'
                }
            ],
            'previousStatement': None,
            'nextStatement': None,
            'colour': 230,
            'tooltip': 'Sends an HTTP request',
            'helpUrl': '',
            'code_generator': '''
function(block) {
    var method = block.getFieldValue('METHOD');
    var url = block.getFieldValue('URL');
    var code = `  // Web request\\n`;
    code += `  fetch('${url}', { method: '${method}' })\\n`;
    code += `    .then(response => response.json())\\n`;
    code += `    .then(data => console.log('Response:', data))\\n`;
    code += `    .catch(error => console.error('Error:', error));\\n`;
    return code;
}'''
        })
        
        self.register_block('actions', 'store_data', {
            'type': 'store_data',
            'message0': 'store %1 as %2 %3',
            'args0': [
                {
                    'type': 'field_input',
                    'name': 'VALUE',
                    'text': 'my data'
                },
                {
                    'type': 'field_input',
                    'name': 'KEY',
                    'text': 'my_key'
                },
                {
                    'type': 'field_dropdown',
                    'name': 'STORAGE_TYPE',
                    'options': [
                        ['securely', 'secure'],
                        ['normally', 'plain']
                    ]
                }
            ],
            'previousStatement': None,
            'nextStatement': None,
            'colour': 230,
            'tooltip': 'Stores data in device storage',
            'helpUrl': '',
            'code_generator': '''
function(block) {
    var value = block.getFieldValue('VALUE');
    var key = block.getFieldValue('KEY');
    var storageType = block.getFieldValue('STORAGE_TYPE');
    var code = `  // Store data\\n`;
    code += `  if (window.creationStorage && window.creationStorage.${storageType}) {\\n`;
    code += `    window.creationStorage.${storageType}.setItem('${key}', btoa('${value}'));\\n`;
    code += `  } else {\\n`;
    code += `    localStorage.setItem('${key}', '${value}');\\n`;
    code += `  }\\n`;
    return code;
}'''
        })
        
        # Logic blocks
        self.register_block('logic', 'wait_block', {
            'type': 'wait_block',
            'message0': 'wait %1 %2',
            'args0': [
                {
                    'type': 'field_number',
                    'name': 'DURATION',
                    'value': 1,
                    'min': 0.1
                },
                {
                    'type': 'field_dropdown',
                    'name': 'UNIT',
                    'options': [
                        ['seconds', 'SECONDS'],
                        ['minutes', 'MINUTES']
                    ]
                }
            ],
            'previousStatement': None,
            'nextStatement': None,
            'colour': 160,
            'tooltip': 'Waits for specified duration',
            'helpUrl': '',
            'code_generator': '''
function(block) {
    var duration = block.getFieldValue('DURATION');
    var unit = block.getFieldValue('UNIT');
    var multiplier = unit === 'MINUTES' ? 60000 : 1000;
    var code = `  // Wait ${duration} ${unit.toLowerCase()}\\n`;
    code += `  await new Promise(resolve => setTimeout(resolve, ${duration * multiplier}));\\n`;
    return code;
}'''
        })
    
    def register_block(self, category: str, block_type: str, block_definition: Dict[str, Any]):
        """Register a new block in the registry."""
        if category not in self.blocks:
            self.blocks[category] = {}
        
        self.blocks[category][block_type] = block_definition
    
    def get_all_blocks(self) -> Dict[str, Dict[str, Any]]:
        """Get all registered blocks."""
        return self.blocks
    
    def get_blocks_by_category(self, category: str) -> Dict[str, Any]:
        """Get blocks by category."""
        return self.blocks.get(category, {})
    
    def get_block(self, category: str, block_type: str) -> Dict[str, Any]:
        """Get a specific block definition."""
        return self.blocks.get(category, {}).get(block_type, {})
    
    def get_categories(self) -> List[str]:
        """Get all available categories."""
        return list(self.blocks.keys())
