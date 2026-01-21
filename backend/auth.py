from functools import wraps
from flask import jsonify

def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        #@token_required
        def decorated(user_data, *args, **kwargs):
            if user_data['role'] not in allowed_roles:
                return jsonify({'error': 'Insufficient permissions'}), 403
            return f(user_data, *args, **kwargs)
        return decorated
    return decorator