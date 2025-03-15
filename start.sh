#!/bin/bash

# Start script for MyBackyardDwelling project
echo "Starting MyBackyardDwelling application..."

# Temporarily skipping MySQL check while using SQLite
# Check if port 5001 is in use
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
    echo "Warning: Port 5001 is already in use!"
    echo "Please stop any services using port 5001 and try again."
    exit 1
fi

# Start the backend server
echo "Starting backend server on port 5001..."
cd backend
source venv/bin/activate

# Start the backend server in the background
python -m flask run --port 5001 &
BACKEND_PID=$!
cd ..

# Start the frontend server
echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Function to handle clean shutdown
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

# Set up trap to catch Ctrl+C and other termination signals
trap cleanup SIGINT SIGTERM

echo "Both servers are running!"
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:8080"
echo "Press Ctrl+C to stop both servers"

# Wait for user input
wait 