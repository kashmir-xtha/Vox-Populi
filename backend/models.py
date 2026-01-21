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