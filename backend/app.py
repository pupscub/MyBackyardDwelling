import os
import json
import random
from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
from dotenv import load_dotenv
from sqlalchemy.exc import SQLAlchemyError as DatabaseError
from dataclasses import dataclass
from export_db_to_csv import export_users_to_csv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS to allow requests from frontend
CORS(app, resources={r"/api/*": {"origins": "*", "supports_credentials": True}})

# Configure database
# Use environment variables for sensitive information
db_user = os.getenv("DB_USER", "root")
db_password = os.getenv("DB_PASSWORD", "")
db_host = os.getenv("DB_HOST", "localhost")
db_name = os.getenv("DB_NAME", "mbd_database")

# Use SQLite for now (until MySQL is set up)
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///mbd_database.db"

# Uncomment and use MySQL configuration
# app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_name}"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database
db = SQLAlchemy(app)

# Define database models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # Flag to track if analysis has been performed
    analysis_completed = db.Column(db.Boolean, default=False)
    # Store analysis results as JSON string
    analysis_data = db.Column(db.Text, nullable=True)

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

# Create database tables
with app.app_context():
    db.create_all()

# Import database operations after models are defined
import database

# Mock data function for demonstration
def generate_mock_analysis(user):
    """Generate mock property analysis data for demo purposes"""
    # In a real application, this would call external APIs or services
    # to gather property data based on the address
    
    # Random lot size between 4000 and 10000 sq ft
    lot_size = f"{random.randint(4000, 10000):,} sq ft"
    
    # Random zoning from common residential types
    zoning_types = ["Residential R-1", "Residential R-2", "Mixed-Use", "Urban Residential"]
    zoning = random.choice(zoning_types)
    
    # 80% chance of ADU being allowed
    allows_adu = random.random() < 0.8
    
    # Max ADU size is typically a percentage of the main dwelling or lot size
    max_adu_size = f"{random.randint(600, 1200)} sq ft" if allows_adu else "Not applicable"
    
    # Setbacks vary by municipality
    setbacks = {
        "front": f"{random.randint(15, 30)} ft",
        "back": f"{random.randint(10, 20)} ft",
        "sides": f"{random.randint(5, 10)} ft"
    }
    
    # Possible notes about the property
    all_notes = [
        "Property is eligible for detached ADU",
        "Local regulations allow up to 2-story ADU",
        "Water and sewer connections available",
        "Permit processing typically takes 3-4 months",
        "Solar panel installation recommended for energy efficiency",
        "Property in historic district - additional review required",
        "Corner lot allows for flexible ADU placement",
        "Recent zoning changes may affect ADU regulations"
    ]
    
    # Select 3-5 random notes
    num_notes = random.randint(3, 5) if allows_adu else random.randint(1, 3)
    notes = random.sample(all_notes, num_notes)
    
    # If ADU is not allowed, add explanation
    if not allows_adu:
        notes.insert(0, "Property does not meet minimum lot size requirements for ADU")
    
    # Get Google Maps API key from environment variables
    maps_api_key = os.environ.get("GOOGLE_MAPS_API_KEY", "")
    
    # Generate a Google Maps static image URL with proper address encoding
    encoded_address = user.address.replace(' ', '+')
    satellite_url = f"https://maps.googleapis.com/maps/api/staticmap?center={encoded_address}&zoom=18&size=800x400&maptype=satellite&key={maps_api_key}"
    
    # If no API key is provided, use a placeholder image
    if not maps_api_key or maps_api_key == "YOUR_GOOGLE_MAPS_API_KEY":
        satellite_url = "https://via.placeholder.com/800x400?text=Satellite+Image+Not+Available"
    
    # Full analysis data
    analysis_data = {
        "address": user.address,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "email": user.email,
        "propertyDetails": {
            "lotSize": lot_size,
            "zoning": zoning,
            "allowsAdu": allows_adu,
            "maxAduSize": max_adu_size,
            "setbacks": setbacks,
            "additionalNotes": notes
        },
        "satelliteImageUrl": satellite_url,
        "generatedAt": datetime.utcnow().isoformat()
    }
    
    return analysis_data

# API Routes
@app.route("/api/submit-property", methods=["POST"])
def submit_property():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ["firstName", "lastName", "address", "email"]
        for field in required_fields:
            if field not in data or not data[field].strip():
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Check if user with email already exists
        existing_user = database.get_user_by_email(db, User, data["email"])
        if existing_user:
            # In a real app, you might want to check if the address matches too
            # For demo, we'll just return the existing ID
            user_id = existing_user.get("id")
            
            return jsonify({
                "success": True,
                "message": "Email already registered for property analysis",
                "user": existing_user,
                "redirect": f"/property-analysis?id={user_id}"
            }), 200
        
        # Create new user record
        user_dict = database.create_user(
            db, User,
            first_name=data["firstName"],
            last_name=data["lastName"],
            address=data["address"],
            email=data["email"]
        )
        
        # Return success with redirect instruction
        return jsonify({
            "success": True,
            "message": "Property analysis request submitted successfully",
            "user": user_dict,
            "redirect": f"/property-analysis?id={user_dict['id']}"
        }), 201
        
    except DatabaseError as e:
        # Log the database error
        print(f"Database error: {str(e)}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        # Log the error (in a production environment)
        print(f"Error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

# Get property analysis by ID
@app.route("/api/property-analysis/<int:user_id>", methods=["GET"])
def get_property_analysis(user_id):
    try:
        # Get user by ID
        user_dict = database.get_user_by_id(db, User, user_id)
        if not user_dict:
            return jsonify({"error": "User not found"}), 404
        
        # Get the User object directly (for analysis)
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Check if analysis exists
        if user.analysis_completed and user.analysis_data:
            # Return existing analysis
            analysis_data = json.loads(user.analysis_data)
        else:
            # Generate new analysis
            analysis_data = generate_mock_analysis(user)
            
            # Save analysis to database
            user.analysis_completed = True
            user.analysis_data = json.dumps(analysis_data)
            db.session.commit()
        
        return jsonify({
            "success": True,
            "analysis": analysis_data
        }), 200
        
    except DatabaseError as e:
        print(f"Database error: {str(e)}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

# Add a route to get all submissions (admin purpose)
@app.route("/api/admin/submissions", methods=["GET"])
def get_submissions():
    try:
        users = database.get_all_users(db, User)
        return jsonify({
            "success": True,
            "count": len(users),
            "submissions": users
        }), 200
    except DatabaseError as e:
        print(f"Database error: {str(e)}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

# Route to export database to CSV
@app.route("/api/admin/export-csv", methods=["GET"])
def export_csv():
    try:
        csv_file = export_users_to_csv()
        if csv_file:
            return send_file(csv_file, as_attachment=True)
        else:
            return jsonify({"error": "Failed to generate CSV file"}), 500
    except Exception as e:
        print(f"Error exporting CSV: {str(e)}")
        return jsonify({"error": "Failed to generate CSV file", "details": str(e)}), 500

# Health check endpoint
@app.route("/api/health", methods=["GET"])
def health_check():
    """API health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "API is running"
    }), 200

# Run the application
if __name__ == "__main__":
    # Use port 5001 to avoid conflicts with AirPlay on macOS
    app.run(debug=True, port=5001) 