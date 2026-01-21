from functools import wraps
from flask import request, jsonify
from models import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1] if " " in request.headers['Authorization'] else None
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        user_data = User.verify_token(token)
        if not user_data:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        return f(user_data, *args, **kwargs)
    
    return decorated

def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated(user_data, *args, **kwargs):
            if user_data['role'] not in allowed_roles:
                return jsonify({'error': 'Insufficient permissions'}), 403
            return f(user_data, *args, **kwargs)
        return decorated
    return decorator