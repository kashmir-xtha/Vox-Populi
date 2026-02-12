from flask import Blueprint, request, jsonify
from models import User, Position, Candidate
import base64

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
            newPos.append(pos)

        print(newPos)
        if positions is None:
            positions = []
        return jsonify({
            'message': 'Positions retrieved successfully',
            'positions': newPos
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/candidates', methods=['POST'])
def submit_application():
    try:
        data = request.get_json()
        
        if not data:
            print("Missing data")   
        if not data.get('user_id'):
            print("Missing user_id")
        if not data.get('full_name'):
            print("Missing full_name")
        if not data.get('pos_id'):
            print("Missing pos_id")
        if not data.get('photo'):
            print("Missing photo")
            return jsonify({'error': 'Missing required fields'}), 400
        
        user_id = data['user_id']
        full_name = data['full_name'].strip()
        pos_id = data['pos_id']
        photo = data['photo']  # base64 encoded image
        statement = data.get('statement', '').strip()
        
        if not full_name:
            return jsonify({'error': 'Full name cannot be empty'}), 400
        
        # Check if user already applied
        existing = Candidate.get_candidate_by_user_id(user_id)
        if existing:
            return jsonify({'error': 'You have already submitted an application'}), 409
        
        # Verify position exists
        position = Position.get_position_by_id(pos_id)
        if not position:
            return jsonify({'error': 'Invalid position selected'}), 404
        
        # Convert base64 image to bytes
        try:
            photo_bytes = base64.b64decode(photo.split(',')[1] if ',' in photo else photo)
        except Exception as e:
            return jsonify({'error': 'Invalid image format'}), 400
        
        # Create candidate application
        candidate = Candidate.create_application(user_id, full_name, photo_bytes, pos_id, statement)
        
        return jsonify({
            'message': 'Application submitted successfully',
            'candidate': {
                'candidate_id': candidate['candidate_id'],
                'full_name': candidate['full_name'],
                'pos_id': candidate['pos_id'],
                'status': candidate['status']
            }
        }), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/candidates', methods=['GET'])
def get_candidates():
    try:
        candidates = Candidate.get_all_candidates()
        newCandidates = []
        for candidate in candidates:
            newCandidates.append({
                'full_name': candidate[0],
                'position': candidate[1],
                'status': candidate[2],
                'id': candidate[3]
            })
        print(newCandidates)
        return jsonify({
            'message': 'Candidates retrieved successfully',
            'candidates': newCandidates
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/candidates/status', methods=['POST'])
def update_candidate_status():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Missing data'}), 400
        print(data)
        Candidate.update_status(candidate_id=data.get('id'), new_status=data.get('status'))
        print(data)
        return jsonify({'message': 'Candidate status updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
