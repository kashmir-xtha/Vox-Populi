from flask import Blueprint, request, jsonify, send_from_directory
from models import User, Position, Candidate
import base64
import os
from werkzeug.utils import secure_filename
import uuid
from datetime import datetime

UPLOAD_FOLDER = 'uploads/candidates'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


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

# route to serve images
@api.route('/uploads/candidates/<filename>')
def serve_candidate_photo(filename):
    """Serve candidate photos"""
    try:
        upload_dir = os.path.abspath(UPLOAD_FOLDER)
        return send_from_directory(upload_dir, filename)
    except FileNotFoundError:
        return jsonify({'error': 'Image not found'}), 404

@api.route('/candidates', methods=['POST'])
def submit_application():
    try:
        # Get form data instead of JSON
        user_id = request.form.get('user_id')
        full_name = request.form.get('full_name', '').strip()
        pos_id = request.form.get('pos_id')
        statement = request.form.get('statement', '').strip()
        
        # Get file from request
        if 'photo' not in request.files:
            return jsonify({'error': 'No photo provided'}), 400
        
        photo_file = request.files['photo']
        
        # Validation
        if not user_id or not full_name or not pos_id:
            return jsonify({'error': 'Missing required fields'}), 400
        
        if photo_file.filename == '':
            return jsonify({'error': 'No photo selected'}), 400
        
        if not allowed_file(photo_file.filename):
            return jsonify({'error': 'Invalid file type. Only PNG, JPG, and GIF allowed'}), 400
        
        if not full_name:
            return jsonify({'error': 'Full name cannot be empty'}), 400
        
        # Verify position exists
        position = Position.get_position_by_id(int(pos_id))
        if not position:
            return jsonify({'error': 'Invalid position selected'}), 404
        
        # Generate unique filename
        file_ext = photo_file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{file_ext}"
        
        # Save file
        filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
        photo_file.save(filepath)
        
        # Convert to forward slashes for database storage (cross-platform compatible)
        filepath_normalized = filepath.replace('\\', '/')

        try:
            # Create candidate application with file path
            candidate = Candidate.create_application(
                int(user_id), 
                full_name, 
                filepath_normalized,  # Store with forward slashes
                int(pos_id), 
                statement
            )
            
            return jsonify({
                'message': 'Application submitted successfully',
                'candidate': {
                    'candidate_id': candidate['candidate_id'],
                    'full_name': candidate['full_name'],
                    'pos_id': candidate['pos_id'],
                    'status': candidate['status'],
                    'photo_path': candidate['photo']
                }
            }), 201
            
        except Exception as db_error:
            # Clean up file if database insert fails
            if os.path.exists(filepath):
                os.remove(filepath)
            raise db_error
    
    except Exception as e:
        print(f"Error in submit_application: {str(e)}")
        return jsonify({'error': str(e)}), 500

@api.route('/candidates', methods=['GET'])
def get_candidates():
    try:
        candidates = Candidate.get_all_candidates()
        newCandidates = []
        for candidate in candidates:
            newCandidates.append({
                'full_name': candidate[2],
                'position': candidate[5],
                'status': candidate[7],
                'photo_url': f'http://localhost:5000/api/{candidate[3]}',  # ✅ Full URL
                'id': candidate[0]  # this is candidate_id from candidates table
            })
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
