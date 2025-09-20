"""
Main Flask application for Creations Builder.
"""

import os
import json
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
from .api.export import export_bp
from .api.templates import templates_bp
from .blocks.registry import BlockRegistry


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__, 
                static_folder='../static',
                template_folder='../templates')
    
    # Enable CORS for all routes
    CORS(app)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')
    app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Initialize block registry
    block_registry = BlockRegistry()
    app.block_registry = block_registry
    
    # Register blueprints
    app.register_blueprint(export_bp, url_prefix='/api/export')
    app.register_blueprint(templates_bp, url_prefix='/api/templates')
    
    @app.route('/')
    def index():
        """Main application page."""
        return render_template('index.html')
    
    @app.route('/api/blocks')
    def get_blocks():
        """Get all available custom blocks."""
        return jsonify(block_registry.get_all_blocks())
    
    @app.route('/api/blocks/<category>')
    def get_blocks_by_category(category):
        """Get blocks by category."""
        return jsonify(block_registry.get_blocks_by_category(category))
    
    @app.route('/api/workspace/save', methods=['POST'])
    def save_workspace():
        """Save workspace data."""
        data = request.json
        workspace_xml = data.get('workspace_xml', '')
        workspace_name = data.get('name', 'Untitled Creation')
        
        # In a real application, you'd save this to a database
        # For now, we'll just return success
        return jsonify({
            'success': True,
            'message': f'Workspace "{workspace_name}" saved successfully'
        })
    
    @app.route('/api/workspace/load/<workspace_id>')
    def load_workspace(workspace_id):
        """Load workspace data."""
        # In a real application, you'd load from a database
        # For now, return a sample workspace
        return jsonify({
            'success': True,
            'workspace_xml': '<xml></xml>',
            'name': 'Sample Creation'
        })
    
    @app.route('/static/blockly/<path:filename>')
    def serve_blockly(filename):
        """Serve Blockly files."""
        return send_from_directory(
            os.path.join(app.static_folder, 'blockly'), 
            filename
        )
    
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors."""
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors."""
        return jsonify({'error': 'Internal server error'}), 500
    
    return app
