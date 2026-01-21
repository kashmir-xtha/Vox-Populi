from flask import Flask, jsonify
from flask_cors import CORS
from config import config
from routes import api
import logging

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = config.SECRET_KEY
    
    # Enable CORS for all routes
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy'}), 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    app.run(debug=True, host='127.0.0.1', port=5000)