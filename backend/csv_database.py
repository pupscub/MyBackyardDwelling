import csv
import os
import json
from datetime import datetime
import threading

# File path for the CSV database
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
USERS_CSV = os.path.join(DATA_DIR, 'users.csv')

# Lock for thread safety when writing to the CSV
csv_lock = threading.Lock()

# Ensure the data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# User fields
USER_FIELDS = ['id', 'first_name', 'last_name', 'address', 'email', 'created_at', 
               'analysis_completed', 'analysis_data']

def _init_csv_if_needed():
    """Create the CSV file with headers if it doesn't exist"""
    if not os.path.exists(USERS_CSV):
        with open(USERS_CSV, 'w', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=USER_FIELDS)
            writer.writeheader()

def _read_users():
    """Read all users from the CSV file"""
    _init_csv_if_needed()
    
    users = []
    try:
        with open(USERS_CSV, 'r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Convert string values to appropriate types
                user = {
                    'id': int(row['id']) if row['id'] else None,
                    'first_name': row['first_name'],
                    'last_name': row['last_name'],
                    'address': row['address'],
                    'email': row['email'],
                    'created_at': row['created_at'],
                    'analysis_completed': row['analysis_completed'].lower() == 'true',
                    'analysis_data': row['analysis_data']
                }
                users.append(user)
    except Exception as e:
        print(f"Error reading CSV: {str(e)}")
        
    return users

def _write_users(users):
    """Write all users to the CSV file"""
    _init_csv_if_needed()
    
    with csv_lock:
        try:
            with open(USERS_CSV, 'w', newline='') as file:
                writer = csv.DictWriter(file, fieldnames=USER_FIELDS)
                writer.writeheader()
                for user in users:
                    writer.writerow(user)
        except Exception as e:
            print(f"Error writing to CSV: {str(e)}")
            raise e

def _get_next_id():
    """Get the next available ID for a new user"""
    users = _read_users()
    if not users:
        return 1
    return max(user['id'] for user in users) + 1

# Database operations

def get_all_users():
    """Retrieve all users from the CSV database"""
    return _read_users()

def get_user_by_id(user_id):
    """Retrieve a user by ID"""
    users = _read_users()
    for user in users:
        if user['id'] == user_id:
            return user
    return None

def get_user_by_email(email):
    """Retrieve a user by email"""
    users = _read_users()
    for user in users:
        if user['email'].lower() == email.lower():
            return user
    return None

def create_user(first_name, last_name, address, email):
    """Create a new user in the CSV database"""
    users = _read_users()
    
    # Check if user with this email already exists
    for user in users:
        if user['email'].lower() == email.lower():
            return user
    
    # Create new user
    new_user = {
        'id': _get_next_id(),
        'first_name': first_name,
        'last_name': last_name,
        'address': address,
        'email': email,
        'created_at': datetime.utcnow().isoformat(),
        'analysis_completed': False,
        'analysis_data': ''
    }
    
    # Add user to list and write back to CSV
    users.append(new_user)
    _write_users(users)
    
    return new_user

def update_user(user_id, **kwargs):
    """Update a user by ID"""
    users = _read_users()
    
    for i, user in enumerate(users):
        if user['id'] == user_id:
            # Update provided fields
            for key, value in kwargs.items():
                if key in user:
                    user[key] = value
            
            # Write changes back to CSV
            _write_users(users)
            return user
    
    return None

def delete_user(user_id):
    """Delete a user by ID"""
    users = _read_users()
    
    for i, user in enumerate(users):
        if user['id'] == user_id:
            # Remove user from list
            del users[i]
            
            # Write changes back to CSV
            _write_users(users)
            return True
    
    return False

# Helper function for exporting to CSV (already exists in app) 