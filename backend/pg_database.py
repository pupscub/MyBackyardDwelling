import os
import json
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection string from Vercel Postgres
DATABASE_URL = os.environ.get("POSTGRES_URL")

# Create SQLAlchemy engine and session
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
Session = sessionmaker(bind=engine)
Base = declarative_base()

# Define User model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    address = Column(String(255), nullable=False)
    email = Column(String(120), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    analysis_completed = Column(Boolean, default=False)
    analysis_data = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<User {self.first_name} {self.last_name}>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "address": self.address,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
            "analysis_completed": self.analysis_completed
        }

# Create tables
def init_db():
    Base.metadata.create_all(engine)

# Database operations
def get_all_users():
    """Retrieve all users from the database"""
    session = Session()
    try:
        users = session.query(User).all()
        return [user.to_dict() for user in users]
    except Exception as e:
        print(f"Error retrieving users: {str(e)}")
        return []
    finally:
        session.close()

def get_user_by_id(user_id):
    """Retrieve a user by ID"""
    session = Session()
    try:
        user = session.query(User).get(user_id)
        return user.to_dict() if user else None
    except Exception as e:
        print(f"Error retrieving user {user_id}: {str(e)}")
        return None
    finally:
        session.close()

def get_user_by_email(email):
    """Retrieve a user by email"""
    session = Session()
    try:
        user = session.query(User).filter_by(email=email).first()
        return user.to_dict() if user else None
    except Exception as e:
        print(f"Error retrieving user with email {email}: {str(e)}")
        return None
    finally:
        session.close()

def create_user(first_name, last_name, address, email):
    """Create a new user in the database"""
    session = Session()
    try:
        # Check if user already exists
        existing_user = session.query(User).filter_by(email=email).first()
        if existing_user:
            return existing_user.to_dict()
        
        # Create new user
        user = User(
            first_name=first_name,
            last_name=last_name,
            address=address,
            email=email
        )
        session.add(user)
        session.commit()
        return user.to_dict()
    except Exception as e:
        session.rollback()
        print(f"Error creating user: {str(e)}")
        return None
    finally:
        session.close()

def update_user(user_id, **kwargs):
    """Update a user by ID"""
    session = Session()
    try:
        user = session.query(User).get(user_id)
        if not user:
            return None
        
        # Update provided fields
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)
        
        session.commit()
        return user.to_dict()
    except Exception as e:
        session.rollback()
        print(f"Error updating user {user_id}: {str(e)}")
        return None
    finally:
        session.close()

def delete_user(user_id):
    """Delete a user by ID"""
    session = Session()
    try:
        user = session.query(User).get(user_id)
        if user:
            session.delete(user)
            session.commit()
            return True
        return False
    except Exception as e:
        session.rollback()
        print(f"Error deleting user {user_id}: {str(e)}")
        return False
    finally:
        session.close() 