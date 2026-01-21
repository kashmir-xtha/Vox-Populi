import psycopg2
from config import config
import bcrypt

def init_database():
    conn = None
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            host=config.DB_HOST,
            port=config.DB_PORT,
            database="postgres",  # Connect to default database to create our database
            user=config.DB_USER,
            password=config.DB_PASSWORD
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Create database if not exists
        cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{config.DB_NAME}'")
        exists = cursor.fetchone()
        
        if not exists:
            cursor.execute(f"CREATE DATABASE {config.DB_NAME}")
            print(f"Database '{config.DB_NAME}' created successfully")
        else:
            print(f"Database '{config.DB_NAME}' already exists")
        
        cursor.close()
        conn.close()
        
        # Now connect to our database and create tables
        conn = psycopg2.connect(
            host=config.DB_HOST,
            port=config.DB_PORT,
            database=config.DB_NAME,
            user=config.DB_USER,
            password=config.DB_PASSWORD
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'candidate', 'voter')),
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # Create elections table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS elections (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            start_date TIMESTAMP NOT NULL,
            end_date TIMESTAMP NOT NULL,
            status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
            created_by INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # Create candidates table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS candidates (
            id SERIAL PRIMARY KEY,
            election_id INTEGER REFERENCES elections(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id),
            manifesto TEXT,
            votes INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(election_id, user_id)
        )
        """)
        
        # Create votes table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS votes (
            id SERIAL PRIMARY KEY,
            election_id INTEGER REFERENCES elections(id) ON DELETE CASCADE,
            voter_id INTEGER REFERENCES users(id),
            candidate_id INTEGER REFERENCES candidates(id),
            voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(election_id, voter_id)
        )
        """)
        
        # Create indexes for better performance
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_elections_status ON elections(status)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_candidates_election ON candidates(election_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_votes_election_voter ON votes(election_id, voter_id)")
        
        # Create default admin user if not exists
        cursor.execute("SELECT id FROM users WHERE username = 'admin'")
        if not cursor.fetchone():
            hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cursor.execute(
                "INSERT INTO users (role, username, password) VALUES (%s, %s, %s)",
                ('admin', 'admin', hashed_password)
            )
            print("Default admin user created: username='admin', password='admin123'")
        
        print("Database tables created successfully!")
        
        cursor.close()
        
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    init_database()