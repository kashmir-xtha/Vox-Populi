from flask import Blueprint, request, jsonify
from models import User, Election, Candidate, Vote
from auth import token_required, role_required
from datetime import datetime

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

@api.route('/profile', methods=['GET'])
@token_required
def get_profile(user_data):
    user = User.get_user_by_id(user_data['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'user': dict(user)}), 200

@api.route('/elections', methods=['GET'])
def get_elections():
    status = request.args.get('status')
    elections = Election.get_elections(status)
    return jsonify({'elections': [dict(e) for e in elections]}), 200

@api.route('/elections', methods=['POST'])
@role_required(['admin'])
def create_election(user_data):
    data = request.get_json()
    
    required_fields = ['title', 'description', 'start_date', 'end_date']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
        
        election = Election.create_election(
            title=data['title'],
            description=data['description'],
            start_date=start_date,
            end_date=end_date,
            created_by=user_data['user_id']
        )
        
        return jsonify({
            'message': 'Election created successfully',
            'election': dict(election)
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/elections/<int:election_id>/candidates', methods=['GET'])
def get_candidates(election_id):
    candidates = Candidate.get_candidates(election_id)
    return jsonify({'candidates': [dict(c) for c in candidates]}), 200

@api.route('/elections/<int:election_id>/register', methods=['POST'])
@role_required(['candidate'])
def register_candidate(user_data, election_id):
    data = request.get_json()
    
    if not data or not data.get('manifesto'):
        return jsonify({'error': 'Missing manifesto'}), 400
    
    # Check if election exists
    election = Election.get_election_by_id(election_id)
    if not election:
        return jsonify({'error': 'Election not found'}), 404
    
    try:
        candidate = Candidate.register_candidate(
            election_id=election_id,
            user_id=user_data['user_id'],
            manifesto=data['manifesto']
        )
        
        return jsonify({
            'message': 'Candidate registered successfully',
            'candidate': dict(candidate)
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/elections/<int:election_id>/vote', methods=['POST'])
@role_required(['voter'])
def cast_vote(user_data, election_id):
    data = request.get_json()
    
    if not data or not data.get('candidate_id'):
        return jsonify({'error': 'Missing candidate_id'}), 400
    
    # Check if election exists and is active
    election = Election.get_election_by_id(election_id)
    if not election:
        return jsonify({'error': 'Election not found'}), 404
    
    current_time = datetime.utcnow()
    if current_time < election['start_date']:
        return jsonify({'error': 'Election has not started yet'}), 400
    if current_time > election['end_date']:
        return jsonify({'error': 'Election has ended'}), 400
    
    try:
        vote = Vote.cast_vote(
            election_id=election_id,
            voter_id=user_data['user_id'],
            candidate_id=data['candidate_id']
        )
        
        if not vote:
            return jsonify({'error': 'You have already voted in this election'}), 400
        
        return jsonify({
            'message': 'Vote cast successfully',
            'vote_id': vote['id']
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/elections/<int:election_id>/results', methods=['GET'])
def get_results(election_id):
    # Get candidates with votes
    candidates = Candidate.get_candidates(election_id)
    
    # Get total votes
    vote_count = Vote.get_vote_count(election_id)
    
    return jsonify({
        'election_id': election_id,
        'candidates': [dict(c) for c in candidates],
        'total_votes': vote_count['total_votes'] if vote_count else 0
    }), 200