# MyBackyardDwelling Setup Guide

This guide explains how to set up and run both the frontend and backend servers for the MyBackyardDwelling application.

## Prerequisites

- Node.js (v14 or later)
- Python 3.8 or higher
- MySQL Server (v8.0 or later)
- npm or yarn

## First-Time Setup

### MySQL Database Setup

1. **Install MySQL Server**

Follow the installation instructions for your operating system:
- [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
- For macOS, you can use Homebrew: `brew install mysql`
- For Ubuntu: `sudo apt install mysql-server`

2. **Configure MySQL**

Start the MySQL service:
```bash
# macOS
brew services start mysql

# Ubuntu
sudo systemctl start mysql
```

3. **Set MySQL root password**

If you haven't set a root password during installation:
```bash
# For macOS / Linux
mysql -u root
```

In MySQL command prompt:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpassword';
FLUSH PRIVILEGES;
quit
```

4. **Update .env file with MySQL credentials**

Edit the `backend/.env` file with your MySQL credentials:
```
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_NAME=mbd_database
```

### Backend Setup

1. **Create and activate a Python virtual environment:**

```bash
cd backend
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

2. **Install backend dependencies:**

```bash
pip install -r requirements.txt
```

3. **Set up the MySQL database:**

```bash
python setup_mysql.py
```

This script will create the database and user if they don't exist.

### Frontend Setup

1. **Install frontend dependencies:**

```bash
npm install
# or
yarn
```

## Running the Application

You have several options to run the application:

### Option 1: All-in-One Script (Recommended)

We've created a shell script that starts both the frontend and backend servers with a single command:

```bash
# Make the script executable (first time only)
chmod +x start.sh

# Run both servers
./start.sh
```

The script will:
- Check if MySQL is running
- Set up the database if needed
- Start both frontend and backend servers
- Show the URLs where each server is running

### Option 2: Using npm/yarn Scripts

We've added several useful scripts to package.json:

```bash
# Start both servers together
npm run start:dev

# Start just the backend server
npm run backend

# Start just the frontend server
npm run dev

# Run the backend as a background service
npm run backend:service

# Check if the backend service is running
npm run backend:status

# Stop the backend service
npm run backend:stop
```

### Option 3: Running as a Background Service

For a more permanent setup, you can run the backend as a background service:

```bash
cd backend
python run_service.py start
```

You can then check its status:

```bash
python run_service.py status
```

And stop it when needed:

```bash
python run_service.py stop
```

## Troubleshooting

### MySQL Connection Issues

If you're having issues connecting to MySQL:

1. **Check MySQL service status:**
   ```bash
   # macOS
   brew services list | grep mysql
   
   # Ubuntu
   sudo systemctl status mysql
   ```

2. **Verify your MySQL credentials:**
   Test your connection with:
   ```bash
   mysql -u root -p
   # Enter your password when prompted
   ```

3. **Check database existence:**
   In MySQL prompt:
   ```sql
   SHOW DATABASES;
   ```
   You should see `mbd_database` in the list.

### Connection Refused Errors

If you see "Failed to parse server response. Is the server running?" errors:

1. **Check if the backend is running:**
   ```bash
   npm run backend:status
   # or
   cd backend && python run_service.py status
   ```

2. **Check backend logs:**
   ```bash
   cat backend/backend.log
   ```

3. **Restart the backend:**
   ```bash
   npm run backend:service
   # or
   cd backend && python run_service.py restart
   ```

## Development Workflow

The best development workflow is:

1. Ensure MySQL server is running
2. Start the backend server as a service: `npm run backend:service`
3. Start the frontend development server: `npm run dev`
4. Make changes to your code
5. When finished, stop the backend service: `npm run backend:stop`

This approach ensures the backend is always running while you work on the frontend code. 