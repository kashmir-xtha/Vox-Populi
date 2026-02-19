from flask import Blueprint, request, jsonify, send_from_directory
from models import User, Position, Candidate, Vote
import os
import uuid
from datetime import datetime
import cloudinary.uploader

# # Uncomment this, if want to host images locally
# UPLOAD_FOLDER = 'uploads/candidates'
# MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


api = Blueprint('api', __name__)

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
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

        if positions is None:
            positions = []
        return jsonify({
            'message': 'Positions retrieved successfully',
            'positions': newPos
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# # Uncomment this, to host images locally and serve images to localhost backend
# @api.route('/uploads/candidates/<filename>')
# def serve_candidate_photo(filename):
#     """Serve candidate photos"""
#     try:
#         upload_dir = os.path.abspath(UPLOAD_FOLDER)
#         return send_from_directory(upload_dir, filename)
#     except FileNotFoundError:
#         return jsonify({'error': 'Image not found'}), 404

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

        # # Uncomment this, to host image file locally
        # # Generate unique filename
        # file_ext = photo_file.filename.rsplit('.', 1)[1].lower()
        # unique_filename = f"{uuid.uuid4().hex}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{file_ext}"
        # # Save file
        # filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
        # photo_file.save(filepath)
        # # Convert to forward slashes for database storage (cross-platform compatible)
        # filepath_normalized = filepath.replace('\\', '/')

        # Upload directly to Cloudinary (no local saving needed)
        upload_result = cloudinary.uploader.upload(
            photo_file,
            folder="candidates",          # organizes files in Cloudinary dashboard
            allowed_formats=["png", "jpg", "jpeg", "gif"],
            max_bytes=5 * 1024 * 1024     # 5MB limit
        )
        # This is the permanent public URL — store this in your DB
        photo_url = upload_result['secure_url']
        candidate = Candidate.create_application(
            int(user_id),
            full_name,
            # filepath_normalized,  # Store with forward slashes for locally hosting images
            photo_url,   # store the URL instead of a file path
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
                'statement': candidate[6],
                'photo_url': candidate[3],  
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
        if (len(data) == 1):
            status = Candidate.get_candidate_by_id(candidate_id=data.get('id'))
            if (status):
                return jsonify({'already_submitted': True})
            else:
                return jsonify({'already_submitted': False})
        Candidate.update_status(candidate_id=data.get('id'), new_status=data.get('status'))
        return jsonify({'message': 'Candidate status updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/votes', methods=['POST'])
def cast_vote():
    """
    Endpoint to cast a vote.
    Expects JSON: { "voter_id": int, "candidate_id": int, "pos_id": int }
    """
    data = request.get_json()

    # Validate input
    required_fields = ['voter_id', 'candidate_id', 'pos_id']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    voter_id = data['voter_id']
    candidate_id = data['candidate_id']
    pos_id = data['pos_id']

    # Check if voter already voted for this position
    existing_vote = Vote.get_vote(voter_id, pos_id)
    if existing_vote:
        return jsonify({'error': 'You have already voted for this position'}), 409

    # Cast the vote
    vote = Vote.cast_vote(voter_id, candidate_id, pos_id)
    if vote:
        return jsonify({
            'message': 'Vote cast successfully',
            'vote': vote
        }), 201
    else:
        return jsonify({'error': 'Failed to cast vote'}), 500

@api.route('/votes/position/<int:pos_id>', methods=['GET'])
def get_votes_for_position(pos_id):
    """
    Get all votes for a specific position.
    """
    votes = Vote.get_votes_by_position(pos_id)
    return jsonify({'votes': votes}), 200

@api.route('/votes/voter/<int:voter_id>', methods=['GET'])
def get_votes_by_voter(voter_id):
    """
    Get all votes cast by a specific voter.
    """
    votes = Vote.get_votes_by_voter(voter_id)
    return jsonify({
        'already_voted': len(votes) > 0,
        'votes': votes
        }), 200

@api.route('/results/live', methods=['GET'])
def get_live_results():
    """
    Get live election results grouped by position.
    """
    try:
        rows = Vote.get_live_results()
        positions_map = {}

        for row in rows or []:
            pos_id = row['pos_id']
            if pos_id not in positions_map:
                positions_map[pos_id] = {
                    'total_votes': 0,
                    'candidates': []
                }

            vote_count = int(row['vote_count'] or 0)
            positions_map[pos_id]['total_votes'] += vote_count

            positions_map[pos_id]['candidates'].append({
                'pos_id': pos_id,
                'position_title': row['position_title'],
                'full_name': row['full_name'],
                'photo_url': row['photo'],
                'votes': vote_count
            })

        results = []
        for position in positions_map.values():
            total_votes = position['total_votes']
            for candidate in position['candidates']:
                candidate['total_votes'] = total_votes
                if total_votes > 0:
                    candidate['percentage'] = round((candidate['votes'] / total_votes) * 100, 1)
                else:
                    candidate['percentage'] = 0.0
            results.append(position['candidates'])
        return jsonify({
            'message': 'Live results retrieved successfully',
            'results': results
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/dashboard/monitoring-log', methods=['GET'])
def get_vote_monitoring_log():
    """
    Get vote monitoring log for admin dashboard.
    Returns voter name, position, candidate, and timestamp for all votes.
    """
    try:
        logs = Vote.get_vote_monitoring_log()
        formatted_logs = []
        for log in logs or []:
            formatted_logs.append({
                'voter_name': log['voter_name'],
                'position_title': log['position_title'],
                'candidate_name': log['candidate_name'],
                'timestamp': log['timestamp'].strftime('%Y-%m-%d %H:%M:%S') if log['timestamp'] else None
            })
        return jsonify({
            'message': 'Vote monitoring log retrieved successfully',
            'logs': formatted_logs,
            'total_votes': len(formatted_logs)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
