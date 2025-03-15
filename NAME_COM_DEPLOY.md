# Deploying MyBackyardDwelling on Name.com

This guide provides step-by-step instructions for deploying your MyBackyardDwelling application on Name.com hosting services.

## Prerequisites

Before starting, ensure you have:
- A Name.com account with a hosting plan
- Your domain registered and pointing to Name.com nameservers
- The frontend build files (`frontend-dist.zip`)
- The backend files (`backend-files.zip`)

## Step 1: Set Up Hosting on Name.com

1. **Log in** to your Name.com account at [name.com](https://www.name.com)
2. Navigate to **Hosting** in the dashboard
3. If you haven't purchased hosting yet:
   - Click **Add Hosting**
   - Select a plan that supports Python (Basic hosting or higher)
   - Complete the purchase process

## Step 2: Configure Your Domain

1. In your Name.com dashboard, go to **Domains**
2. Select your domain
3. Navigate to **DNS Records**
4. Ensure the A records point to your Name.com hosting IP address
   - If unsure about the IP, check your hosting details or contact Name.com support

## Step 3: Access Your Hosting Control Panel

1. From your Name.com dashboard, go to **Hosting**
2. Find your hosting package and click **Manage**
3. Click on **cPanel Login** to access the control panel

## Step 4: Deploy the Frontend

1. In cPanel, navigate to **File Manager**
2. Go to the public_html directory (or create a subdirectory if preferred)
3. Click **Upload** and select your `frontend-dist.zip` file
4. Once uploaded, select the zip file and click **Extract**
5. Extract the contents to your desired directory (e.g., public_html)

## Step 5: Set Up the Backend

Name.com hosting with cPanel supports Python applications through Passenger WSGI. Follow these steps:

1. In cPanel, go to **Setup Python App**
   - If you don't see this option, contact Name.com support to ensure Python is enabled on your hosting account
2. Click **Create Application**
3. Configure the application:
   - **Python Version**: Select 3.9 or newer
   - **Application Root**: Choose or create a directory for your backend (e.g., `python_apps/mybackyarddwelling`)
   - **Application URL**: Choose a path (e.g., `/api` or a subdomain)
   - **Application Startup File**: Set to `passenger_wsgi.py`
4. Click **Create**

## Step 6: Upload Backend Files

1. Go back to the File Manager
2. Navigate to your Python application directory
3. Upload `backend-files.zip`
4. Extract the contents to this directory
5. Ensure `passenger_wsgi.py` is in the root of your application directory

## Step 7: Configure Environment Variables

1. In the backend directory, locate the `.env.example` file
2. Create a new file named `.env`
3. Copy contents from `.env.example` and update with your production values:
   ```
   # Backend Configuration
   FLASK_APP=app.py
   FLASK_ENV=production
   DEBUG=False
   PORT=5000
   HOST=0.0.0.0

   # API Keys
   GOOGLE_MAPS_API_KEY=your_actual_api_key_here

   # Database Configuration
   # For SQLite (simple option)
   DB_PATH=mbd_database.db

   # Security
   SECRET_KEY=your_secure_random_key_here

   # CORS Settings
   ALLOW_CORS_ORIGIN=https://yourdomain.com
   ```

## Step 8: Install Python Dependencies

1. In cPanel, go to **Setup Python App**
2. Select your application
3. Click on **Enter Console**
4. In the console, run:
   ```bash
   pip install -r requirements.txt
   ```

## Step 9: Update Frontend API Configuration

You need to update the frontend to point to your backend API:

1. In the File Manager, navigate to your frontend files
2. Find configuration files (usually in the assets directory with names like `index-*.js`)
3. Open these files and search for API URLs that need to be updated
4. Change any localhost URLs to your production backend URL (e.g., `https://yourdomain.com/api`)

## Step 10: Restart Your Application

1. In cPanel, go to **Setup Python App**
2. Select your application
3. Click **Restart**

## Step 11: Testing Your Deployment

1. Visit your website at `https://yourdomain.com`
2. Test the frontend functionality
3. Test API endpoints at `https://yourdomain.com/api/*`
4. Verify form submissions are working correctly
5. Test Google Maps integration

## Troubleshooting

- **500 Internal Server Error**: Check the Python application logs in cPanel
- **API Connection Issues**: Verify CORS settings in your backend `.env` file
- **Database Errors**: Ensure your database file is writable or connection string is correct
- **Missing Dependencies**: Verify all requirements were installed correctly

## Additional Resources

- [Name.com Python Hosting Documentation](https://www.name.com/support)
- [Working with cPanel](https://www.name.com/support/articles/cpanel)
- Contact Name.com support for specific hosting configuration help 