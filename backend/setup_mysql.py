#!/usr/bin/env python3
"""
MySQL Database Setup Script for MyBackyardDwelling

This script creates the MySQL database and required user if they don't exist.
Run this script before starting the application for the first time.
"""

import os
import sys
import pymysql
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database configuration from environment variables
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "mbd_database")

def create_database():
    """Create the MySQL database and user if they don't exist."""
    try:
        # Connect to MySQL server as root
        print(f"Connecting to MySQL server at {DB_HOST}...")
        connection = pymysql.connect(
            host=DB_HOST,
            user='root',  # Using root to create database and user
            password=DB_PASSWORD,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        with connection.cursor() as cursor:
            # Check if database exists
            cursor.execute(f"SHOW DATABASES LIKE '{DB_NAME}'")
            result = cursor.fetchone()
            
            if not result:
                print(f"Creating database '{DB_NAME}'...")
                cursor.execute(f"CREATE DATABASE `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
                print(f"Database '{DB_NAME}' created successfully.")
            else:
                print(f"Database '{DB_NAME}' already exists.")
            
            # If DB_USER is not root, create the user and grant privileges
            if DB_USER != 'root':
                # Check if user exists
                cursor.execute(f"SELECT user FROM mysql.user WHERE user = '{DB_USER}'")
                user_exists = cursor.fetchone()
                
                if not user_exists:
                    print(f"Creating user '{DB_USER}'...")
                    cursor.execute(f"CREATE USER '{DB_USER}'@'{DB_HOST}' IDENTIFIED BY '{DB_PASSWORD}'")
                    cursor.execute(f"GRANT ALL PRIVILEGES ON `{DB_NAME}`.* TO '{DB_USER}'@'{DB_HOST}'")
                    cursor.execute("FLUSH PRIVILEGES")
                    print(f"User '{DB_USER}' created with access to '{DB_NAME}'.")
                else:
                    print(f"User '{DB_USER}' already exists.")
        
        print("Database setup completed successfully!")
        return True
        
    except pymysql.MySQLError as e:
        print(f"Error: {e}")
        return False
    finally:
        if 'connection' in locals() and connection.open:
            connection.close()
            print("MySQL connection closed.")

if __name__ == "__main__":
    print("Setting up MySQL database for MyBackyardDwelling...")
    success = create_database()
    
    if success:
        print("\nMySQL setup complete. You can now run the application.")
        sys.exit(0)
    else:
        print("\nMySQL setup failed. Please check your configuration and try again.")
        sys.exit(1) 