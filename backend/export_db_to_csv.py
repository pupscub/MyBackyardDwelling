#!/usr/bin/env python
import os
import csv
import json
import shutil
from datetime import datetime

# Import our CSV database module
import csv_database

def export_users_to_csv():
    """Export the users CSV database to a separate CSV file with timestamp"""
    try:
        # Read all users from the CSV database
        users = csv_database.get_all_users()
        
        # Create the exports directory if it doesn't exist
        if not os.path.exists('exports'):
            os.makedirs('exports')
        
        # Generate CSV filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        csv_filename = f"exports/user_data_{timestamp}.csv"
        
        # Create a copy of the users CSV file with the timestamp
        shutil.copy2(csv_database.USERS_CSV, csv_filename)
        
        print(f"Successfully exported database to {csv_filename}")
        return csv_filename
        
    except Exception as e:
        print(f"Error exporting database: {e}")
        return False

if __name__ == "__main__":
    export_users_to_csv() 