from database import db
import bcrypt
from datetime import datetime

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
    def count_voters():
        """Count total users with 'voter' role"""
        query = "SELECT COUNT(*) AS total_voters FROM users WHERE role = 'voter'"
        result = db.execute(query, fetchone=True)
        return result['total_voters'] if result else 0


class Position:
    @staticmethod
    def create_position(title):
        query = """
        INSERT INTO positions (title)
        VALUES (%s)
        RETURNING pos_id, title
        """

        return db.execute(query, (title,), fetchone=True)

    @staticmethod
    def get_position_by_title(title):
        query = "SELECT pos_id, title FROM positions WHERE title = %s"
        return db.execute(query, (title,), fetchone=True)
    
    @staticmethod
    def get_all_positions():
        query = "SELECT pos_id, title FROM positions ORDER BY pos_id"
        return db.execute(query, (), fetchall=True)
    
    @staticmethod
    def get_position_by_id(pos_id):
        query = "SELECT pos_id, title FROM positions WHERE pos_id = %s"
        return db.execute(query, (pos_id,), fetchone=True)
    
    @staticmethod
    def count_active_positions():
        """Count total positions with approved candidates"""
        query = """
        SELECT COUNT(DISTINCT pos_id) AS total_positions
        FROM positions
        """
        result = db.execute(query, fetchone=True)
        return result['total_positions'] if result else 0


class Candidate:
    @staticmethod
    def create_application(user_id, full_name, photo_path, pos_id, statement):
        """
        Create a new candidate application
        
        Args:
            user_id: ID of the user applying
            full_name: Full name of candidate
            photo_path: File path to the candidate's photo (VARCHAR)
            pos_id: Position ID they're applying for
            statement: Candidate statement
        """
        query = """
        INSERT INTO candidates (user_id, full_name, photo, pos_id, statement, status)
        VALUES (%s, %s, %s, %s, %s, 'pending')
        RETURNING candidate_id, user_id, full_name, photo, pos_id, statement, status, created_at
        """
        
        return db.execute(query, (user_id, full_name, photo_path, pos_id, statement), fetchone=True)
    
    @staticmethod
    def get_candidate_by_id(candidate_id):
        """Get candidate by ID"""
        query = """
        SELECT candidate_id, user_id, full_name, photo, pos_id, statement, status, created_at
        FROM candidates
        WHERE user_id = %s
        """
        return db.execute(query, (candidate_id,), fetchone=True)
    
    @staticmethod
    def get_all_candidates():
        """Get all candidates"""
        query = """
        SELECT c.candidate_id, c.user_id, c.full_name, c.photo, c.pos_id, p.title, c.statement, c.status, c.created_at
        FROM candidates c
        JOIN positions p ON c.pos_id = p.pos_id
        """
        return db.execute(query, fetchall=True)
    
    @staticmethod
    def update_status(candidate_id, new_status):
        query = """
            UPDATE candidates
            SET status = %s
            WHERE candidate_id = %s"""
        return db.execute(query, (new_status, candidate_id))
    
    @staticmethod
    def count_pending_approvals():
        """Count candidates with 'pending' status"""
        query = "SELECT COUNT(*) AS pending_count FROM candidates WHERE status = 'pending'"
        result = db.execute(query, fetchone=True)
        return result['pending_count'] if result else 0

class Vote:
    @staticmethod
    def cast_vote(voter_id, candidate_id, pos_id):
        """
        Insert a new vote into the votes table.
        Ensures a voter can only vote once per position.
        """
        query = """
        INSERT INTO votes (voter_id, candidate_id, pos_id, created_at)
        VALUES (%s, %s, %s, %s)
        RETURNING vote_id, voter_id, candidate_id, pos_id, created_at
        """
        return db.execute(
            query, 
            (voter_id, candidate_id, pos_id, datetime.now()), 
            fetchone=True
        )

    @staticmethod
    def get_votes_by_position(pos_id):
        """
        Get all votes for a specific position.
        """
        query = "SELECT * FROM votes WHERE pos_id = %s"
        return db.execute(query, (pos_id,), fetchall=True)
    
    @staticmethod
    def get_votes_by_voter(voter_id):
        """
        Get all votes cast by a specific voter.
        """
        query = "SELECT * FROM votes WHERE voter_id = %s"
        return db.execute(query, (voter_id,), fetchall=True)

    @staticmethod
    def get_vote(voter_id, pos_id):
        """
        Check if a voter has already voted for a position.
        """
        query = "SELECT * FROM votes WHERE voter_id = %s AND pos_id = %s"
        return db.execute(query, (voter_id, pos_id), fetchone=True)
    
    @staticmethod
    def count_votes_for_candidate(candidate_id, pos_id):
        """
        Count total votes for a candidate in a position.
        """
        query = "SELECT COUNT(*) AS total_votes FROM votes WHERE candidate_id = %s AND pos_id = %s"
        return db.execute(query, (candidate_id, pos_id), fetchone=True)

    @staticmethod
    def get_live_results():
        """
        Get live vote counts per candidate grouped by position.
        Only approved candidates are included.
        """
        query = """
        SELECT
            p.pos_id,
            p.title AS position_title,
            c.candidate_id,
            c.full_name,
            c.photo,
            c.status,
            COUNT(v.vote_id) AS vote_count
        FROM positions p
        JOIN candidates c ON c.pos_id = p.pos_id
        LEFT JOIN votes v ON v.candidate_id = c.candidate_id AND v.pos_id = p.pos_id
        WHERE c.status = 'approved'
        GROUP BY p.pos_id, p.title, c.candidate_id, c.full_name, c.photo, c.status
        ORDER BY p.pos_id, vote_count DESC, c.full_name
        """
        return db.execute(query, fetchall=True)

    @staticmethod
    def get_vote_monitoring_log():
        """
        Get complete vote monitoring log with voter name, position, candidate, and timestamp.
        Used for admin dashboard live monitoring.
        """
        query = """
        SELECT
            u.username AS voter_name,
            p.title AS position_title,
            c.full_name AS candidate_name,
            v.created_at AS timestamp
        FROM votes v
        JOIN users u ON v.voter_id = u.id
        JOIN positions p ON v.pos_id = p.pos_id
        JOIN candidates c ON v.candidate_id = c.candidate_id
        ORDER BY v.created_at DESC
        LIMIT 500
        """
        return db.execute(query, fetchall=True)