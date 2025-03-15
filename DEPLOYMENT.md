# Deployment Guide for MyBackyardDwelling

This guide covers step-by-step instructions for deploying the MyBackyardDwelling application to various hosting providers. We focus on affordable options that work well with the React frontend and Flask backend architecture.

## Preparing for Deployment

Before deploying, make sure to:

1. Complete your GitHub repository setup
2. Test your application locally
3. Set your API keys as environment variables
4. Configure your production database

## Option 1: Render (Recommended Affordable Option)

[Render](https://render.com/) offers a generous free tier and smooth deployment process for both frontend and backend applications.

### Frontend Deployment on Render

1. Create a Render account at [render.com](https://render.com/)
2. From the dashboard, click "New" and select "Static Site"
3. Connect to your GitHub repository
4. Configure your static site:
   - **Name**: `mybackyarddwelling-frontend` (or preferred name)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Click "Create Static Site"

### Backend Deployment on Render

1. From the Render dashboard, click "New" and select "Web Service"
2. Connect to your GitHub repository
3. Configure your web service:
   - **Name**: `mybackyarddwelling-backend` (or preferred name)
   - **Branch**: `main`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn app:app`
   - **Add Environment Variables**:
     - Add all your `.env` variables here, including your Google Maps API key
4. Click "Create Web Service"

### Connecting Your Domain on Render

1. In the Render dashboard, select your frontend service
2. Go to "Settings" > "Custom Domain"
3. Click "Add Custom Domain"
4. Enter your domain name (e.g., mybackyarddwelling.com)
5. Follow the DNS configuration instructions provided by Render
6. For the backend:
   - Create a subdomain like `api.mybackyarddwelling.com`
   - Add it as a custom domain to your backend service
   - Update your frontend to point to this API endpoint

## Option 2: Vercel + Railway

A powerful combination with good free tiers.

### Frontend Deployment on Vercel

1. Create a Vercel account at [vercel.com](https://vercel.com/)
2. Connect your GitHub repository
3. Configure your deployment settings:
   - **Framework Preset**: React
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click "Deploy"

### Backend Deployment on Railway

1. Create a Railway account at [railway.app](https://railway.app/)
2. Start a new project and select "Deploy from GitHub repo"
3. Configure your deployment:
   - Add a new service pointing to your repository
   - Set the root directory to `/backend`
   - Add your environment variables
   - Set the start command to `gunicorn app:app`
4. Deploy your service

### Connecting Your Domain

1. In Vercel, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain and follow the DNS configuration instructions
4. For Railway, create a subdomain (e.g., api.mybackyarddwelling.com) and add it to your service

## Option 3: GitHub Pages + PythonAnywhere

The most economical option.

### Frontend Deployment on GitHub Pages

1. In your project's `package.json`, add:
   ```json
   "homepage": "https://yourusername.github.io/mybackyarddwelling",
   ```
2. Install the GitHub Pages package:
   ```bash
   npm install --save-dev gh-pages
   ```
3. Add to scripts in `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
4. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```
5. Go to your repository settings > Pages and verify deployment

### Backend Deployment on PythonAnywhere

1. Create a PythonAnywhere account at [pythonanywhere.com](https://www.pythonanywhere.com/)
2. From the dashboard, go to "Web" tab and create a new web app
3. Select "Flask" as the framework
4. In "Files" tab, upload your backend directory
5. Configure your WSGI file to point to your Flask app
6. Set up your environment variables
7. Reload your web app

### Connecting Your Domain

1. For GitHub Pages:
   - Go to repository settings > Pages
   - Add your custom domain and verify
2. For PythonAnywhere:
   - In the "Web" tab, scroll to "Custom Domains"
   - Add your domain (likely a subdomain like api.mybackyarddwelling.com)
   - Configure your DNS settings as instructed

## Additional Cost-Saving Tips

1. **Use Free Tiers**: Most platforms offer free tiers sufficient for low-traffic sites
2. **Optimize Assets**: Compress images and minimize JS/CSS to reduce bandwidth
3. **Lazy Loading**: Implement lazy loading for images and components
4. **Caching**: Implement proper caching strategies
5. **Database Choice**: Consider using a free tier database like MongoDB Atlas or a small Postgres instance on Railway

## Post-Deployment Checklist

- [ ] Verify frontend loads correctly
- [ ] Test API endpoints
- [ ] Check Google Maps integration
- [ ] Verify form submissions
- [ ] Test responsive design on various devices
- [ ] Set up monitoring (e.g., UptimeRobot free plan)
- [ ] Configure SSL certificates (provided free by most hosting services)

## Troubleshooting

- **CORS Issues**: Ensure your backend allows requests from your frontend domain
- **API Key Restrictions**: Make sure your Google Maps API key is properly restricted
- **Database Connections**: Verify connection strings and access permissions
- **Environment Variables**: Confirm all necessary variables are set in your hosting platform 