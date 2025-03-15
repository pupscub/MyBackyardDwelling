#!/usr/bin/env python
"""
Database Export Tool for MyBackyardDwelling

This script exports the database to a CSV file.
Run it from the backend directory.
"""
import os
import sys
from export_db_to_csv import export_users_to_csv

def main():
    """Main function to export the database to CSV"""
    print("MyBackyardDwelling Database Export Tool")
    print("---------------------------------------")
    
    # Check if we're in the right directory
    if not os.path.exists("instance/mbd_database.db"):
        print("Error: Database file not found.")
        print("Please run this script from the backend directory.")
        return 1
    
    print("Exporting database to CSV...")
    csv_file = export_users_to_csv()
    
    if csv_file:
        print("\nExport successful!")
        print(f"CSV file saved to: {os.path.abspath(csv_file)}")
        return 0
    else:
        print("\nExport failed. Please check the error messages above.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 