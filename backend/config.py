import os
from pathlib import Path
from dotenv import load_dotenv

# Get the current directory (where config.py is located)
BASE_DIR = Path(__file__).resolve().parent

# Try loading .env from multiple locations
env_paths = [
    BASE_DIR / '.env',           # Same directory as config.py
    BASE_DIR / '.env.local',     # Local override
    '.env',                      # Current working directory
]

# Try each path until we find one that works
env_loaded = False
for env_path in env_paths:
    if env_path.exists():
        print(f"Loading environment from: {env_path}")
        load_dotenv(dotenv_path=env_path, override=True)
        env_loaded = True
        break

if not env_loaded:
    print("No .env file found. Using system environment variables.")

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = os.getenv('DB_PORT')
    DB_NAME = os.getenv('DB_NAME')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    
    @property
    def DATABASE_URL(self):
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

config = Config()