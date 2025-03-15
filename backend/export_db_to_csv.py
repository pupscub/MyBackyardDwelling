#!/usr/bin/env python
import os
import csv
import json
import sqlite3
from datetime import datetime

def export_users_to_csv():
    """Export the users table from the SQLite database to a CSV file"""
    # Path to the SQLite database file
    db_path = "instance/mbd_database.db"
    
    # Check if database file exists
    if not os.path.exists(db_path):
        print(f"Database file {db_path} not found.")
        return False
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get column names from user table
        cursor.execute("PRAGMA table_info(user)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Fetch all user data
        cursor.execute("SELECT * FROM user")
        users = cursor.fetchall()
        
        # Prepare data for CSV export
        rows = []
        for user in users:
            user_dict = dict(zip(columns, user))
            
            # Parse analysis_data JSON if it exists and is not None
            if 'analysis_data' in user_dict and user_dict['analysis_data']:
                try:
                    analysis = json.loads(user_dict['analysis_data'])
                    
                    # Add key analysis fields as separate columns
                    if 'propertyDetails' in analysis:
                        props = analysis['propertyDetails']
                        user_dict['lot_size'] = props.get('lotSize', 'N/A')
                        user_dict['zoning'] = props.get('zoning', 'N/A')
                        user_dict['allows_adu'] = props.get('allowsAdu', False)
                        user_dict['max_adu_size'] = props.get('maxAduSize', 'N/A')
                        
                        # Add setbacks if available
                        if 'setbacks' in props:
                            user_dict['setback_front'] = props['setbacks'].get('front', 'N/A')
                            user_dict['setback_back'] = props['setbacks'].get('back', 'N/A')
                            user_dict['setback_sides'] = props['setbacks'].get('sides', 'N/A')
                except json.JSONDecodeError:
                    print(f"Warning: Could not parse analysis_data for user ID {user_dict.get('id')}")
            
            rows.append(user_dict)
        
        # Create the exports directory if it doesn't exist
        if not os.path.exists('exports'):
            os.makedirs('exports')
        
        # Generate CSV filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        csv_filename = f"exports/user_data_{timestamp}.csv"
        
        # Write data to CSV file
        with open(csv_filename, 'w', newline='') as csvfile:
            # Get all possible fields from all users (to handle any custom fields in analysis_data)
            all_fields = set()
            for row in rows:
                all_fields.update(row.keys())
            
            # Remove the raw analysis_data field to keep the CSV clean
            if 'analysis_data' in all_fields:
                all_fields.remove('analysis_data')
            
            # Sort fields to ensure consistent order
            fieldnames = sorted(list(all_fields))
            
            # Make sure id is the first column
            if 'id' in fieldnames:
                fieldnames.remove('id')
                fieldnames = ['id'] + fieldnames
            
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for row in rows:
                # Filter out analysis_data since we've extracted the important fields
                row_filtered = {k: v for k, v in row.items() if k != 'analysis_data'}
                writer.writerow(row_filtered)
        
        print(f"Successfully exported database to {csv_filename}")
        return csv_filename
        
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        return False
    except Exception as e:
        print(f"Error exporting database: {e}")
        return False
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    export_users_to_csv() 