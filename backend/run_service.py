#!/usr/bin/env python3
"""
Service runner for the Flask backend.
This script is used to run the Flask application in the background.
"""

import os
import sys
import subprocess
import time
import signal
import atexit
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(Path(__file__).parent / "service.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("backend-service")

# Get the absolute path to the backend directory
backend_dir = Path(__file__).parent.absolute()
pid_file = backend_dir / "backend.pid"

def start_service():
    """Start the Flask backend service"""
    # Check if the service is already running
    if pid_file.exists():
        with open(pid_file, 'r') as f:
            pid = int(f.read().strip())
        try:
            # Check if the process is still running
            os.kill(pid, 0)
            logger.info(f"Service is already running with PID {pid}")
            return
        except OSError:
            # Process is not running, remove the PID file
            logger.info(f"Removing stale PID file for {pid}")
            pid_file.unlink()
    
    # Activate the virtual environment if it exists
    venv_activate = backend_dir / "venv" / "bin" / "activate"
    if venv_activate.exists():
        activate_cmd = f"source {venv_activate}"
        logger.info("Activating virtual environment")
    else:
        activate_cmd = ""
        logger.warning("Virtual environment not found, using system Python")
    
    # Run MySQL setup script if it exists
    mysql_setup = backend_dir / "setup_mysql.py"
    if mysql_setup.exists():
        logger.info("Setting up MySQL database...")
        setup_cmd = f"cd {backend_dir} && {activate_cmd} && python setup_mysql.py"
        try:
            result = subprocess.run(setup_cmd, shell=True, executable="/bin/bash", 
                                   check=True, capture_output=True, text=True)
            logger.info("MySQL setup output: " + result.stdout)
        except subprocess.CalledProcessError as e:
            logger.error(f"MySQL setup failed: {e}")
            logger.error(f"MySQL setup stderr: {e.stderr}")
            logger.error("Unable to start service due to MySQL setup failure")
            return
    
    # Command to start the Flask application
    run_cmd = "python app.py"
    
    # The full command with nohup to run in the background
    full_cmd = f"cd {backend_dir} && {activate_cmd} && nohup {run_cmd} > {backend_dir}/backend.log 2>&1 &"
    
    # Execute the command
    logger.info(f"Starting backend service with command: {full_cmd}")
    process = subprocess.Popen(full_cmd, shell=True, executable="/bin/bash")
    
    # Wait a moment for the process to start
    time.sleep(2)
    
    # Find the PID of the Flask process
    try:
        ps_cmd = f"ps aux | grep 'python app.py' | grep -v grep | awk '{{print $2}}'"
        result = subprocess.check_output(ps_cmd, shell=True, executable="/bin/bash")
        pid = int(result.strip())
        
        # Save the PID to the PID file
        with open(pid_file, 'w') as f:
            f.write(str(pid))
        
        logger.info(f"Backend service started with PID {pid}")
    except Exception as e:
        logger.error(f"Failed to get PID: {e}")
        logger.info("Service may still be running, check backend.log for details")

def stop_service():
    """Stop the Flask backend service"""
    if not pid_file.exists():
        logger.info("No PID file found, service is not running")
        return
    
    with open(pid_file, 'r') as f:
        pid = int(f.read().strip())
    
    try:
        logger.info(f"Stopping backend service with PID {pid}")
        os.kill(pid, signal.SIGTERM)
        
        # Wait a moment for the process to terminate
        time.sleep(2)
        
        # Check if the process is still running
        try:
            os.kill(pid, 0)
            logger.warning(f"Process {pid} did not terminate, sending SIGKILL")
            os.kill(pid, signal.SIGKILL)
        except OSError:
            # Process has terminated
            pass
        
        # Remove the PID file
        pid_file.unlink()
        logger.info("Backend service stopped")
    except OSError as e:
        logger.error(f"Failed to stop service: {e}")
        if pid_file.exists():
            pid_file.unlink()

def check_status():
    """Check if the service is running"""
    if not pid_file.exists():
        logger.info("Service is not running")
        return False
    
    with open(pid_file, 'r') as f:
        pid = int(f.read().strip())
    
    try:
        os.kill(pid, 0)
        logger.info(f"Service is running with PID {pid}")
        return True
    except OSError:
        logger.info("Service is not running (stale PID file)")
        pid_file.unlink()
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run_service.py [start|stop|restart|status]")
        sys.exit(1)
    
    action = sys.argv[1].lower()
    
    if action == "start":
        start_service()
    elif action == "stop":
        stop_service()
    elif action == "restart":
        stop_service()
        time.sleep(2)
        start_service()
    elif action == "status":
        check_status()
    else:
        print(f"Unknown action: {action}")
        print("Usage: python run_service.py [start|stop|restart|status]")
        sys.exit(1) 