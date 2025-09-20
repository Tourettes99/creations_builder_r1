"""
Export API endpoints for generating R1 creation files.
"""

import json
import os
from flask import Blueprint, request, jsonify, render_template_string, current_app
from datetime import datetime

export_bp = Blueprint('export', __name__)


@export_bp.route('/html', methods=['POST'])
def export_html():
    """Export workspace as HTML/JS/CSS bundle."""
    data = request.json
    workspace_xml = data.get('workspace_xml', '')
    workspace_name = data.get('name', 'Untitled Creation')
    generated_code = data.get('generated_code', '')
    
    # Load the R1 creation HTML template
    template_path = os.path.join(current_app.template_folder, 'exports', 'r1_creation_template.html')
    
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            template_content = f.read()
    except FileNotFoundError:
        # Fallback to inline template
        template_content = get_default_r1_template()
    
    # Replace placeholders in template
    html_content = template_content.replace('{{CREATION_NAME}}', workspace_name)
    html_content = html_content.replace('{{GENERATED_CODE}}', generated_code)
    html_content = html_content.replace('{{CREATION_DATE}}', datetime.now().isoformat())
    
    return jsonify({
        'success': True,
        'html_content': html_content,
        'filename': f"{workspace_name.replace(' ', '_').lower()}.html"
    })


@export_bp.route('/json', methods=['POST'])
def export_json():
    """Export workspace as JSON data."""
    data = request.json
    workspace_xml = data.get('workspace_xml', '')
    workspace_name = data.get('name', 'Untitled Creation')
    generated_code = data.get('generated_code', '')
    
    export_data = {
        'name': workspace_name,
        'version': '1.0.0',
        'created_at': datetime.now().isoformat(),
        'workspace_xml': workspace_xml,
        'generated_code': generated_code,
        'metadata': {
            'creator': 'Creations Builder',
            'format_version': '1.0'
        }
    }
    
    return jsonify({
        'success': True,
        'json_content': json.dumps(export_data, indent=2),
        'filename': f"{workspace_name.replace(' ', '_').lower()}.json"
    })


@export_bp.route('/xml', methods=['POST'])
def export_xml():
    """Export workspace as XML data."""
    data = request.json
    workspace_xml = data.get('workspace_xml', '')
    workspace_name = data.get('name', 'Untitled Creation')
    
    # Wrap the workspace XML with metadata
    full_xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<r1_creation name="{workspace_name}" version="1.0" created_at="{datetime.now().isoformat()}">
    <metadata>
        <creator>Creations Builder</creator>
        <format_version>1.0</format_version>
    </metadata>
    <workspace>
        {workspace_xml}
    </workspace>
</r1_creation>'''
    
    return jsonify({
        'success': True,
        'xml_content': full_xml,
        'filename': f"{workspace_name.replace(' ', '_').lower()}.xml"
    })


def get_default_r1_template():
    """Get the default R1 creation HTML template."""
    return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=240, height=282, initial-scale=1.0">
    <title>{{CREATION_NAME}}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            width: 240px;
            height: 282px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            font-size: 12px;
            background: #0a0a0a;
            color: #fff;
            overflow: hidden;
            position: relative;
        }
        
        #app {
            width: 100%;
            height: 100%;
            border: 5px solid #00ff00;
            display: flex;
            flex-direction: column;
            position: relative;
            transition: border-color 0.3s ease;
        }
        
        header {
            background: #1a1a1a;
            padding: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            border-bottom: 1px solid #333;
        }
        
        header h1 {
            font-size: 16px;
            font-weight: bold;
        }
        
        main {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            background: #0a0a0a;
        }
        
        .status {
            text-align: center;
            padding: 20px;
            color: #888;
        }
        
        .active {
            color: #00ff00;
        }
    </style>
</head>
<body>
    <div id="app">
        <header>
            <h1>{{CREATION_NAME}}</h1>
        </header>
        <main>
            <div class="status" id="status">R1 Creation Active</div>
        </main>
    </div>

    <script>
        // Generated R1 Creation Code
        // Created: {{CREATION_DATE}}
        
        console.log('R1 Creation: {{CREATION_NAME}} starting...');
        
        // Initialize creation
        document.addEventListener('DOMContentLoaded', function() {
            console.log('R1 Creation loaded');
            document.getElementById('status').classList.add('active');
            
            // Check if running as R1 plugin
            if (typeof PluginMessageHandler !== 'undefined') {
                console.log('Running as R1 Creation');
            } else {
                console.log('Running in browser mode');
            }
            
            // Initialize generated code
            initializeCreation();
        });
        
        // Plugin message handler
        window.onPluginMessage = function(data) {
            console.log('Received plugin message:', data);
            // Handle incoming messages here
        };
        
        // Main creation logic
        async function initializeCreation() {
            try {
                // Generated code will be inserted here
                {{GENERATED_CODE}}
                
                console.log('R1 Creation initialized successfully');
            } catch (error) {
                console.error('Error initializing R1 Creation:', error);
            }
        }
        
        // Utility functions
        function updateAppBorderColor(hexColor) {
            const app = document.getElementById('app');
            if (app) {
                app.style.borderColor = hexColor;
            }
        }
        
        function showStatus(message) {
            const status = document.getElementById('status');
            if (status) {
                status.textContent = message;
            }
        }
    </script>
</body>
</html>'''
