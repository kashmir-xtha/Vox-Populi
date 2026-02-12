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
        query = "SELECT title FROM positions ORDER BY pos_id"
        return db.execute(query, (), fetchall=True)
    
    @staticmethod
    def get_position_by_id(pos_id):
        query = "SELECT pos_id, title FROM positions WHERE pos_id = %s"
        return db.execute(query, (pos_id,), fetchone=True)


class Candidate:
    @staticmethod
    def create_application(user_id, full_name, photo, pos_id, statement):
        query = """
        INSERT INTO candidates (user_id, full_name, photo, pos_id, statement, status)
        VALUES (%s, %s, %s, %s, %s, 'pending')
        RETURNING candidate_id, user_id, full_name, pos_id, statement, status, created_at
        """
        
        return db.execute(query, (user_id, full_name, photo, pos_id, statement), fetchone=True)
    
    @staticmethod
    def get_candidate_by_user_id(user_id):
        query = """
        SELECT candidate_id, user_id, full_name, pos_id, statement, status, created_at 
        FROM candidates WHERE user_id = %s
        """
        return db.execute(query, (user_id,), fetchone=True)

    @staticmethod
    def get_all_candidates():
        query = """
        SELECT c.full_name, p.title, c.status 
        FROM candidates c
        JOIN positions p ON c.pos_id = p.pos_id
        """
        test = db.execute(query, (), fetchall=True)
        print(test)
        return db.execute(query, (), fetchall=True)