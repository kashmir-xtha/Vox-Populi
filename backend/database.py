import psycopg2
import psycopg2.extras
from config import config

class Database:
    def __init__(self):
        self.conn = None
        self.connect()
    
    def connect(self):
        try:
            self.conn = psycopg2.connect(
                host=config.DB_HOST,
                port=config.DB_PORT,
                database=config.DB_NAME,
                user=config.DB_USER,
                password=config.DB_PASSWORD
            )
            self.conn.autocommit = False
        except Exception as e:
            print(f"Database connection failed: {e}")
            raise
    
    def get_cursor(self):
        try:
            if self.conn.closed:
                self.connect()
            return self.conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        except Exception as e:
            print(f"Failed to get cursor: {e}")
            self.connect()
            return self.conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    def execute(self, query, params=None, fetchone=False, fetchall=False):
        cursor = self.get_cursor()
        try:
            cursor.execute(query, params or ())
            
            if fetchone:
                result = cursor.fetchone()
            elif fetchall:
                result = cursor.fetchall()
            else:
                result = None
            
            self.conn.commit()
            return result
        except Exception as e:
            self.conn.rollback()
            print(f"Query failed: {e}")
            raise
        finally:
            cursor.close()
    
    def close(self):
        if self.conn:
            self.conn.close()

# Singleton instance
db = Database()