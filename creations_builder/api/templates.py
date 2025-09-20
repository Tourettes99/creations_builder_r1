"""
Templates API endpoints for providing starter templates.
"""

from flask import Blueprint, jsonify

templates_bp = Blueprint('templates', __name__)


@templates_bp.route('/list')
def list_templates():
    """Get list of available starter templates."""
    templates = [
        {
            'id': 'hello_world',
            'name': 'Hello World',
            'description': 'Simple greeting creation that responds to voice commands',
            'category': 'beginner',
            'tags': ['voice', 'speech', 'basic']
        },
        {
            'id': 'timer_reminder',
            'name': 'Timer Reminder',
            'description': 'Set reminders that trigger at regular intervals',
            'category': 'productivity',
            'tags': ['timer', 'notification', 'reminder']
        },
        {
            'id': 'tilt_controller',
            'name': 'Tilt Controller',
            'description': 'Control actions by tilting the R1 device',
            'category': 'sensors',
            'tags': ['accelerometer', 'tilt', 'gesture']
        },
        {
            'id': 'button_counter',
            'name': 'Button Counter',
            'description': 'Count button presses and provide feedback',
            'category': 'interaction',
            'tags': ['buttons', 'counter', 'hardware']
        },
        {
            'id': 'weather_checker',
            'name': 'Weather Checker',
            'description': 'Check weather using voice commands and web requests',
            'category': 'advanced',
            'tags': ['api', 'weather', 'voice', 'web']
        },
        {
            'id': 'data_logger',
            'name': 'Data Logger',
            'description': 'Log sensor data and store it securely',
            'category': 'advanced',
            'tags': ['storage', 'sensors', 'logging']
        }
    ]
    
    return jsonify({
        'success': True,
        'templates': templates
    })


@templates_bp.route('/<template_id>')
def get_template(template_id):
    """Get specific template workspace XML."""
    templates_data = {
        'hello_world': {
            'name': 'Hello World',
            'workspace_xml': '''<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="voice_command" id="start_block" x="20" y="20">
    <field name="COMMAND">hello</field>
    <next>
      <block type="speak_text" id="speak_block">
        <field name="TEXT">Hello! I am your R1 assistant!</field>
        <field name="SAVE_TO_JOURNAL">FALSE</field>
      </block>
    </next>
  </block>
</xml>''',
            'description': 'A simple creation that responds to "hello" voice commands'
        },
        
        'timer_reminder': {
            'name': 'Timer Reminder',
            'workspace_xml': '''<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="timer_trigger" id="timer_block" x="20" y="20">
    <field name="INTERVAL">5</field>
    <field name="UNIT">MINUTES</field>
    <next>
      <block type="speak_text" id="remind_block">
        <field name="TEXT">Time for a reminder!</field>
        <field name="SAVE_TO_JOURNAL">TRUE</field>
      </block>
    </next>
  </block>
</xml>''',
            'description': 'Reminds you every 5 minutes with a voice message'
        },
        
        'tilt_controller': {
            'name': 'Tilt Controller',
            'workspace_xml': '''<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="accelerometer_trigger" id="tilt_left" x="20" y="20">
    <field name="DIRECTION">LEFT</field>
    <field name="THRESHOLD">0.7</field>
    <next>
      <block type="send_notification" id="left_notify">
        <field name="MESSAGE">Tilted left!</field>
      </block>
    </next>
  </block>
  <block type="accelerometer_trigger" id="tilt_right" x="20" y="120">
    <field name="DIRECTION">RIGHT</field>
    <field name="THRESHOLD">0.7</field>
    <next>
      <block type="send_notification" id="right_notify">
        <field name="MESSAGE">Tilted right!</field>
      </block>
    </next>
  </block>
</xml>''',
            'description': 'Responds to device tilting with notifications'
        },
        
        'button_counter': {
            'name': 'Button Counter',
            'workspace_xml': '''<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="counter_var">counter</variable>
  </variables>
  <block type="hardware_button" id="button_trigger" x="20" y="20">
    <field name="BUTTON">SIDE</field>
    <field name="ACTION">CLICK</field>
    <next>
      <block type="store_data" id="increment_counter">
        <field name="VALUE">counter + 1</field>
        <field name="KEY">button_count</field>
        <field name="STORAGE_TYPE">plain</field>
        <next>
          <block type="speak_text" id="count_speak">
            <field name="TEXT">Button pressed! Count updated.</field>
            <field name="SAVE_TO_JOURNAL">FALSE</field>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>''',
            'description': 'Counts side button presses and provides feedback'
        },
        
        'weather_checker': {
            'name': 'Weather Checker',
            'workspace_xml': '''<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="voice_command" id="weather_trigger" x="20" y="20">
    <field name="COMMAND">weather</field>
    <next>
      <block type="web_request" id="weather_request">
        <field name="METHOD">GET</field>
        <field name="URL">https://api.openweathermap.org/data/2.5/weather</field>
        <next>
          <block type="speak_text" id="weather_speak">
            <field name="TEXT">Getting weather information...</field>
            <field name="SAVE_TO_JOURNAL">FALSE</field>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>''',
            'description': 'Voice-activated weather checking with web API'
        },
        
        'data_logger': {
            'name': 'Data Logger',
            'workspace_xml': '''<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="timer_trigger" id="log_timer" x="20" y="20">
    <field name="INTERVAL">10</field>
    <field name="UNIT">SECONDS</field>
    <next>
      <block type="accelerometer_trigger" id="get_sensor_data" x="20" y="100">
        <field name="DIRECTION">LEFT</field>
        <field name="THRESHOLD">0.1</field>
        <next>
          <block type="store_data" id="log_data">
            <field name="VALUE">sensor_data_timestamp</field>
            <field name="KEY">sensor_log</field>
            <field name="STORAGE_TYPE">secure</field>
            <next>
              <block type="send_notification" id="log_notify">
                <field name="MESSAGE">Data logged securely</field>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>''',
            'description': 'Logs sensor data every 10 seconds to secure storage'
        }
    }
    
    template_data = templates_data.get(template_id)
    if not template_data:
        return jsonify({
            'success': False,
            'error': f'Template {template_id} not found'
        }), 404
    
    return jsonify({
        'success': True,
        'template': template_data
    })


@templates_bp.route('/categories')
def get_categories():
    """Get available template categories."""
    categories = [
        {
            'id': 'beginner',
            'name': 'Beginner',
            'description': 'Simple templates for getting started',
            'color': '#4CAF50'
        },
        {
            'id': 'productivity',
            'name': 'Productivity',
            'description': 'Templates for productivity and reminders',
            'color': '#2196F3'
        },
        {
            'id': 'sensors',
            'name': 'Sensors',
            'description': 'Templates using device sensors',
            'color': '#FF9800'
        },
        {
            'id': 'interaction',
            'name': 'Interaction',
            'description': 'Templates for user interaction',
            'color': '#9C27B0'
        },
        {
            'id': 'advanced',
            'name': 'Advanced',
            'description': 'Complex templates with multiple features',
            'color': '#F44336'
        }
    ]
    
    return jsonify({
        'success': True,
        'categories': categories
    })
