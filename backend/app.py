from flask import Flask, jsonify
from flask_cors import CORS
from config import config
from routes import api
import logging
import cloudinary
import os

def create_app():
    app = Flask(__name__, static_folder=None)
    app.config['SECRET_KEY'] = config.SECRET_KEY
    
    # Configure Cloudinary
    cloudinary.config(
        cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
        api_key=os.environ.get('CLOUDINARY_API_KEY'),
        api_secret=os.environ.get('CLOUDINARY_API_SECRET')
    )

    # Enable CORS for all routes
    CORS(app, resources={r"/api/*": {"origins": [
        "http://localhost:5173",
        "https://vox-populi-eta.vercel.app"
    ]}})
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    @app.route('/')
    def home():
        """Serve the homepage"""
        return jsonify({
            'message': 'Vox Populi API is running!',
            'endpoints': {
                'health_check': '/health',
                'login': '/api/login',
                'signup': '/api/signup',
                'routes_list': '/routes'
            },
            'test_credentials': {
                'admin': 'username: admin, password: admin123, role: admin'
            }
        }), 200

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
    
    @app.route('/routes', methods=['GET'])
    def list_routes():
        """List all available routes for debugging"""
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append({
                'endpoint': rule.endpoint,
                'methods': list(rule.methods),
                'path': str(rule)
            })
        return jsonify({'routes': routes}), 200


    return app

if __name__ == '__main__':
    app = create_app()
    
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    app.run(debug=True, host='127.0.0.1', port=5000)