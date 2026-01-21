from flask import Blueprint, request, jsonify
from models import User

api = Blueprint('api', __name__)

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print(data)
    if not data or not data.get('role') or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 200
    
    # Check if username already exists
    existing_user = User.get_user_by_username(data['username'])
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 200
    
    try:
        user = User.create_user(
            role=data['role'],
            username=data['username'],
            password=data['password']
        )
        
        if user:
            token = User.generate_token(user['id'], user['role'])
            return jsonify({
                'message': 'User created successfully',
                'user': {
                    'id': user['id'],
                    'role': user['role'],
                    'username': user['username']
                },
                'token': token
            }), 201
        else:
            return jsonify({'error': 'Failed to create user'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(data)
    if not data or not data.get('role') or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Authenticate user
    user = User.authenticate(
        username=data['username'],
        password=data['password'],
        role=data['role'].lower()
    )
    
    if not user:
        return jsonify({'error': 'Invalid credentials or role mismatch'}), 200
    
    # Generate token
    token = User.generate_token(user['id'], user['role'])
    
    return jsonify({
        'message': 'Login successful',
        'user': user,
        'token': token
    }), 200