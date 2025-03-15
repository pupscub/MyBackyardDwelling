from sqlalchemy.exc import SQLAlchemyError

class DatabaseError(Exception):
    """Custom exception for database errors"""
    pass

def get_all_users(db, User):
    """Retrieve all users from the database"""
    try:
        users = User.query.all()
        return [user.to_dict() for user in users]
    except SQLAlchemyError as e:
        raise DatabaseError(f"Error retrieving users: {str(e)}")

def get_user_by_id(db, User, user_id):
    """Retrieve a user by ID"""
    try:
        user = User.query.get(user_id)
        return user.to_dict() if user else None
    except SQLAlchemyError as e:
        raise DatabaseError(f"Error retrieving user {user_id}: {str(e)}")

def get_user_by_email(db, User, email):
    """Retrieve a user by email"""
    try:
        user = User.query.filter_by(email=email).first()
        return user.to_dict() if user else None
    except SQLAlchemyError as e:
        raise DatabaseError(f"Error retrieving user with email {email}: {str(e)}")

def create_user(db, User, first_name, last_name, address, email):
    """Create a new user in the database"""
    try:
        user = User(
            first_name=first_name,
            last_name=last_name,
            address=address,
            email=email
        )
        db.session.add(user)
        db.session.commit()
        return user.to_dict()
    except SQLAlchemyError as e:
        db.session.rollback()
        raise DatabaseError(f"Error creating user: {str(e)}")

def update_user(db, User, user_id, **kwargs):
    """Update a user by ID"""
    try:
        user = User.query.get(user_id)
        if not user:
            return None
        
        # Update provided fields
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)
        
        db.session.commit()
        return user.to_dict()
    except SQLAlchemyError as e:
        db.session.rollback()
        raise DatabaseError(f"Error updating user {user_id}: {str(e)}")

def delete_user(db, User, user_id):
    """Delete a user by ID"""
    try:
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return True
        return False
    except SQLAlchemyError as e:
        db.session.rollback()
        raise DatabaseError(f"Error deleting user {user_id}: {str(e)}") 