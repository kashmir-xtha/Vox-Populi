from database import db
import bcrypt
import jwt
from datetime import datetime, timedelta
from config import config

class User:
    @staticmethod
    def hash_password(password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    @staticmethod
    def check_password(hashed_password, password):
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    @staticmethod
    def create_user(role, username, password):
        hashed_password = User.hash_password(password)
        
        query = """
        INSERT INTO users (role, username, password, created_at)
        VALUES (%s, %s, %s, %s)
        RETURNING id, role, username, created_at
        """
        
        return db.execute(query, (role, username, hashed_password, datetime.now()), fetchone=True)
    
    @staticmethod
    def get_user_by_username(username):
        query = "SELECT * FROM users WHERE username = %s"
        return db.execute(query, (username,), fetchone=True)
    
    @staticmethod
    def get_user_by_id(user_id):
        query = "SELECT id, role, username, created_at FROM users WHERE id = %s"
        return db.execute(query, (user_id,), fetchone=True)
    
    @staticmethod
    def authenticate(username, password, role):
        user = User.get_user_by_username(username)
        
        if not user:
            return None
        
        if user['role'] != role:
            return None
        
        if not User.check_password(user['password'], password):
            return None
        
        return {
            'id': user['id'],
            'role': user['role'],
            'username': user['username']
        }
    
    @staticmethod
    def generate_token(user_id, role):
        payload = {
            'user_id': user_id,
            'role': role,
            'exp': datetime.utcnow() + timedelta(days=7)
        }
        return jwt.encode(payload, config.JWT_SECRET_KEY, algorithm='HS256')
    
    @staticmethod
    def verify_token(token):
        try:
            payload = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

class Election:
    @staticmethod
    def create_election(title, description, start_date, end_date, created_by):
        query = """
        INSERT INTO elections (title, description, start_date, end_date, created_by, status)
        VALUES (%s, %s, %s, %s, %s, 'upcoming')
        RETURNING id, title, description, start_date, end_date, status, created_at
        """
        return db.execute(query, (title, description, start_date, end_date, created_by), fetchone=True)
    
    @staticmethod
    def get_elections(status=None):
        if status:
            query = "SELECT * FROM elections WHERE status = %s ORDER BY created_at DESC"
            return db.execute(query, (status,), fetchall=True)
        else:
            query = "SELECT * FROM elections ORDER BY created_at DESC"
            return db.execute(query, fetchall=True)
    
    @staticmethod
    def get_election_by_id(election_id):
        query = "SELECT * FROM elections WHERE id = %s"
        return db.execute(query, (election_id,), fetchone=True)

class Candidate:
    @staticmethod
    def register_candidate(election_id, user_id, manifesto):
        query = """
        INSERT INTO candidates (election_id, user_id, manifesto, votes)
        VALUES (%s, %s, %s, 0)
        RETURNING id, election_id, user_id, manifesto, votes
        """
        return db.execute(query, (election_id, user_id, manifesto), fetchone=True)
    
    @staticmethod
    def get_candidates(election_id):
        query = """
        SELECT c.*, u.username 
        FROM candidates c
        JOIN users u ON c.user_id = u.id
        WHERE c.election_id = %s
        """
        return db.execute(query, (election_id,), fetchall=True)

class Vote:
    @staticmethod
    def cast_vote(election_id, voter_id, candidate_id):
        # Check if voter has already voted in this election
        check_query = "SELECT id FROM votes WHERE election_id = %s AND voter_id = %s"
        existing_vote = db.execute(check_query, (election_id, voter_id), fetchone=True)
        
        if existing_vote:
            return None
        
        # Record the vote
        vote_query = """
        INSERT INTO votes (election_id, voter_id, candidate_id, voted_at)
        VALUES (%s, %s, %s, %s)
        RETURNING id
        """
        
        # Update candidate's vote count
        update_query = "UPDATE candidates SET votes = votes + 1 WHERE id = %s"
        
        try:
            vote_result = db.execute(vote_query, (election_id, voter_id, candidate_id, datetime.now()), fetchone=True)
            db.execute(update_query, (candidate_id,))
            return vote_result
        except Exception as e:
            db.conn.rollback()
            raise
    
    @staticmethod
    def get_vote_count(election_id):
        query = "SELECT COUNT(*) as total_votes FROM votes WHERE election_id = %s"
        return db.execute(query, (election_id,), fetchone=True)