import os
import json
import random
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from datetime import datetime, timedelta
from dotenv import load_dotenv
from dataclasses import dataclass
from export_db_to_csv import export_users_to_csv

# Import our new CSV database module instead of SQLAlchemy
import csv_database

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS to allow requests from frontend
CORS(app, resources={r"/api/*": {"origins": "*", "supports_credentials": True}})

# Simple exception class for database errors
class DatabaseError(Exception):
    """Custom exception for database errors"""
    pass

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
    notes = []
    
    if allows_adu:
        note_options = [
            "Property is eligible for ADU development",
            "Zoning allows for accessory dwelling units",
            "Check with local planning department for specific ADU requirements",
            "Consider consulting with an architect for ADU design options"
        ]
        notes.append(random.choice(note_options))
    else:
        note_options = [
            "Current zoning may not permit ADU construction",
            "Zoning variance might be required for ADU development",
            "Consider consulting with the planning department about ADU options"
        ]
        notes.append(random.choice(note_options))
    
    # Random additional notes
    additional_notes = [
        "Property is in a neighborhood with growing property values",
        "Check for utility access for any ADU construction",
        "Consider solar orientation for optimal energy efficiency",
        "Verify if property is in a historic district or has special requirements",
        "Water and sewer connections may require upgrades for additional unit"
    ]
    
    # Add 1-3 additional random notes
    for _ in range(random.randint(1, 3)):
        note = random.choice(additional_notes)
        if note not in notes:
            notes.append(note)
    
    # Analysis object structure
    return {
        "propertyDetails": {
            "address": user.get("address", "Unknown"),
            "lotSize": lot_size,
            "zoning": zoning,
            "allowsAdu": allows_adu,
            "maxAduSize": max_adu_size,
            "setbacks": setbacks
        },
        "analysisDate": datetime.now().isoformat(),
        "notes": notes,
        "constructionEstimate": {
            "lowEstimate": f"${random.randint(100, 150) * 1000:,}",
            "highEstimate": f"${random.randint(150, 250) * 1000:,}",
            "estimateDisclaimer": "Estimates are approximate and subject to change based on specific design, materials, and contractor selection."
        },
        "nextSteps": [
            "Schedule a consultation with a local architect",
            "Contact your municipality's planning department",
            "Research local ADU regulations and requirements",
            "Consider financing options for your ADU project"
        ]
    }

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
        existing_user = csv_database.get_user_by_email(data["email"])
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
        user_dict = csv_database.create_user(
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
        
    except Exception as e:
        # Log the error (in a production environment)
        print(f"Error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

# Get property analysis by ID
@app.route("/api/property-analysis/<int:user_id>", methods=["GET"])
def get_property_analysis(user_id):
    try:
        # Get user by ID
        user = csv_database.get_user_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Check if analysis exists
        if user['analysis_completed'] and user['analysis_data']:
            # Return existing analysis
            analysis_data = json.loads(user['analysis_data'])
        else:
            # Generate new analysis
            analysis_data = generate_mock_analysis(user)
            
            # Save analysis to database
            csv_database.update_user(
                user_id, 
                analysis_completed=True,
                analysis_data=json.dumps(analysis_data)
            )
        
        return jsonify({
            "success": True,
            "analysis": analysis_data
        }), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

# Add a route to get all submissions (admin purpose)
@app.route("/api/admin/submissions", methods=["GET"])
def get_submissions():
    try:
        users = csv_database.get_all_users()
        return jsonify({
            "success": True,
            "count": len(users),
            "submissions": users
        }), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

# Route to export database to CSV (we can use the existing functionality)
@app.route("/api/admin/export-csv", methods=["GET"])
def export_csv():
    try:
        # Since our data is already in CSV, we can just send the file directly
        return send_file(csv_database.USERS_CSV, as_attachment=True, 
                        download_name=f"user_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv")
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

# Route to serve the main page
@app.route("/api", methods=["GET"])
def api_root():
    """API root endpoint"""
    return jsonify({
        "message": "It works!",
        "version": "Python 3.10.16"
    }), 200

# Run the application
if __name__ == "__main__":
    # Use port 5001 to avoid conflicts with AirPlay on macOS
    app.run(debug=True, port=5001) 