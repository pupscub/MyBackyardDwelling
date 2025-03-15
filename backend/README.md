# Backend API for MyBackyardDwelling

This is the Python backend for MyBackyardDwelling that handles form submissions and stores data in a SQL database.

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Installation

1. Create and activate a virtual environment (recommended):

```bash
# Create virtual environment
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on macOS/Linux
source venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:

```bash
# Copy the example .env file
cp .env.example .env

# Edit the .env file with your actual database credentials
```

### Running the Application

To start the backend server in development mode:

```bash
python app.py
```

The server will start at `http://localhost:5000` by default.

## API Endpoints

### Health Check

- **URL**: `/api/health`
- **Method**: GET
- **Description**: Check if the API is running.
- **Response**:
  ```json
  {
    "status": "healthy",
    "message": "API is running"
  }
  ```

### Submit Property

- **URL**: `/api/submit-property`
- **Method**: POST
- **Description**: Submit property information from the contact form.
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St, Boston, MA",
    "email": "john.doe@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Property analysis request submitted successfully",
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "address": "123 Main St, Boston, MA",
      "email": "john.doe@example.com",
      "created_at": "2023-10-25T14:30:00.000Z"
    }
  }
  ```

## Database

By default, the application uses SQLite for development, which requires no additional setup.

To use a different database:

1. Edit the `.env` file and update the database configuration.
2. Uncomment the appropriate database connection string in `app.py`.
3. Install the required database driver if needed.

## Production Deployment

For production, you should:

- Use a production-ready WSGI server like Gunicorn
- Set `FLASK_ENV=production` in the environment
- Configure a proper database (PostgreSQL or MySQL)
- Set up appropriate security measures 

## Additional Security Measures

To add CORS support, you can use the `flask-cors` library.

1. Install the library:

```bash
pip install flask-cors
```

2. Add CORS support to your Flask application:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# On your server/API side (example in Node.js/Express)
app.use(cors({
  origin: 'https://yourdomain.com', // Or use '*' during development
  credentials: true
})); 
```

## Example Express.js Endpoint

```python
from flask import request, jsonify

@app.post('/api/properties')
def submit_property():
    try:
        data = request.get_json()
        if not data.get('address'):
            return jsonify({'error': 'Address is required'}), 400
        
        property_id = save_to_database(data)
        return jsonify({'success': True, 'propertyId': property_id})
    except Exception as e:
        return jsonify({'error': 'Failed to process property data', 'details': str(e)}), 500
```

## Setting up Google Maps API

The application uses Google Maps Static API to fetch satellite images of property addresses. To set this up:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Maps Static API" for your project
4. Create an API key with appropriate restrictions (consider adding HTTP referrer restrictions for security)
5. Add your API key to the `.env` file:
   ```
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

**Note:** Google Maps Platform is not free, but it offers a $200 monthly credit, which is usually sufficient for development and small-scale use. Be sure to set up billing information in your Google Cloud account.

## Exporting Database to CSV

You can export the database to a CSV file for backup or analysis purposes. There are two ways to do this:

### Using the Command-Line Tool

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the export script:
   ```bash
   python export_db.py
   ```

3. The CSV file will be saved in the `backend/exports` directory with a timestamp in the filename.

### Using the Web API

You can also download the CSV file directly from the web API:

1. Make sure the backend server is running:
   ```bash
   python app.py
   ```

2. Open a browser and navigate to:
   ```
   http://localhost:5001/api/admin/export-csv
   ```

3. The CSV file will be automatically downloaded by your browser.

The exported CSV file contains all user data from the database, along with parsed property analysis details for easier data analysis.

To test if your API key is working, you can run the test script:

```bash
cd backend
python test_maps_api.py
```

The satellite images will now appear on the property analysis page for each property with a valid address. The image quality can be adjusted by changing the size parameter in the URL if needed.