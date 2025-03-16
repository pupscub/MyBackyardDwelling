# Setting Up Vercel Postgres

This guide will help you set up Vercel Postgres for your MyBackyardDwelling application.

## Step 1: Create a Postgres Database on Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to the "Storage" tab
3. Click on "Create Database"
4. Select "Postgres" as the database type
5. Choose a database region close to your users
6. Click "Create" to provision your Postgres database

## Step 2: Get Database Connection Details

1. After the database is created, click on it to view its details
2. Navigate to the "Connect" tab
3. You will see a section titled "Application Connection Strings"
4. Click "Show" next to the `.env.local` file configuration
5. Copy all the environment variables, including:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

## Step 3: Add Environment Variables to Your Project

1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" tab
3. Add all the Postgres environment variables you copied in Step 2
4. Click "Save" to apply your changes

## Step 4: Deploy Your Application

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Implement Vercel Postgres integration"
   git push origin main
   ```

2. Vercel will automatically deploy your application with the new environment variables

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues, check the following:

- Make sure all environment variables are correctly set in Vercel
- Verify that your backend code is using the correct environment variable name (`POSTGRES_URL`)
- Check the Vercel logs for any specific error messages

### Database Initialization

The database tables should be automatically created when the application starts. If they are not:

1. Use the Vercel CLI to connect to your application:
   ```bash
   vercel env pull
   ```

2. Run the database initialization locally:
   ```bash
   cd backend
   python -c "import pg_database; pg_database.init_db()"
   ```

### Data Management

To manage your database directly:

1. In the Vercel dashboard, go to your database
2. Click on "Data" to open the database browser
3. You can view, add, edit, and delete data from this interface

## Local Development

For local development, create a `.env` file in your backend directory with the following:

```
POSTGRES_URL=your_postgres_connection_string
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Replace `your_postgres_connection_string` with your Vercel Postgres connection string. 