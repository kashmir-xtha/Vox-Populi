from flask import Blueprint, request, jsonify
from models import User, Position

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
            return jsonify({
                'message': 'User created successfully',
                'user': {
                    'id': user['id'],
                    'role': user['role'],
                    'username': user['username']
                }
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
    
    return jsonify({
        'message': 'Login successful',
        'user': user
    }), 200


@api.route('/positions', methods=['POST'])
def create_position():
    data = request.get_json()

    if not data or not data.get('title'):
        return jsonify({'error': 'Missing required fields'}), 400

    title = data['title'].strip()

    if not title:
        return jsonify({'error': 'Position title cannot be empty'}), 400

    existing = Position.get_position_by_title(title)
    if existing:
        return jsonify({'error': 'Position title already exists'}), 409

    position = Position.create_position(title)
    return jsonify({
        'message': 'Position created successfully',
        'position': position
    }), 201

@api.route('/positions', methods=['GET'])
def get_positions():
    try:
        positions = Position.get_all_positions()
        newPos = []
        for pos in positions:
            newPos.append(pos[0])

        if positions is None:
            positions = []
        return jsonify({
            'message': 'Positions retrieved successfully',
            'positions': newPos
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500