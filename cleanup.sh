#!/bin/bash

# My Backyard Dwelling Repository Cleanup Script
# This script removes unnecessary files and organizes test files

echo "Starting repository cleanup..."

# Remove redundant files
echo "Removing redundant files..."
rm -f .htaccess
rm -f start.sh
rm -f bun.lockb
rm -f GITHUB_SETUP.md
rm -f DEPLOYMENT.md
rm -f SUPABASE_SETUP.md
rm -f SUPABASE_SETUP_MANUAL.md
rm -f setup-exec-sql-function.sql
rm -f update_property_table.sql

# Remove source test files now that they've been moved to the test directory
echo "Removing source test files..."
rm -f src/lib/supabase-test.ts
rm -f src/pages/SupabaseTest.tsx
rm -f src/pages/SupabaseSetup.tsx
rm -f src/setup-supabase.ts

# Create a consolidated SQL file for Supabase setup
echo "Creating a consolidated Supabase setup SQL file..."
cat > sql/supabase-setup.sql << 'EOF'
-- Supabase Setup SQL File
-- Run this in the Supabase SQL Editor to set up your database

-- Create the exec_sql function
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Create the property_submissions table
CREATE TABLE IF NOT EXISTS property_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  address TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  street TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  service_available BOOLEAN,
  lot_size TEXT,
  zoning TEXT,
  allows_adu BOOLEAN DEFAULT true,
  max_adu_size TEXT,
  setback_front TEXT,
  setback_back TEXT,
  setback_sides TEXT,
  additional_notes TEXT[],
  satellite_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER property_submissions_updated_at
BEFORE UPDATE ON property_submissions
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS property_submissions_address_idx ON property_submissions (address);
CREATE INDEX IF NOT EXISTS property_submissions_state_idx ON property_submissions (state);
CREATE INDEX IF NOT EXISTS property_submissions_email_idx ON property_submissions (email);

-- Enable RLS on the table
ALTER TABLE property_submissions ENABLE ROW LEVEL SECURITY;

-- Create insert policy for anonymous users
DROP POLICY IF EXISTS "Anyone can insert property submissions" ON property_submissions;
CREATE POLICY "Anyone can insert property submissions" 
ON property_submissions
FOR INSERT TO anon
WITH CHECK (true);

-- Create select policy for anonymous users
DROP POLICY IF EXISTS "Anyone can view property submissions by ID" ON property_submissions;
CREATE POLICY "Anyone can view property submissions by ID" 
ON property_submissions
FOR SELECT TO anon
USING (true);
EOF

# Update README with Vercel and Supabase focus
echo "Updating README.md with Vercel and Supabase focus..."
cat > README.md << 'EOF'
# My Backyard Dwelling - ADU Property Analysis

This application allows users to submit a property address and receive ADU (Accessory Dwelling Unit) potential analysis for their property. The service provides information on zoning rules, setback requirements, and ADU eligibility, with a special focus on Massachusetts properties.

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: React Context + React Query
- **Deployment**: Vercel
- **Backend**: Supabase (PostgreSQL + Auth)
- **Mapping**: Google Maps Static API

## Local Development

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your Supabase and Google Maps API credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Supabase Setup

This project requires a Supabase project with the following setup:

1. Create a new Supabase project
2. Run the SQL script in `sql/supabase-setup.sql` in the SQL Editor
3. Add your Supabase URL and anon key to the `.env` file

## Deployment to Vercel

1. Push your repository to GitHub
2. Import the repository in Vercel
3. Add the following environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY`
4. Deploy

## Testing

Testing utilities are available in the `test/` directory. See `test/README.md` for more information on how to use these utilities.

## Features

- Property form with validation
- Massachusetts-only service checking
- Google Maps satellite imagery
- Property analysis with ADU potential information
- Responsive design for all devices

## License

This project is proprietary and confidential.
EOF

# Create sql directory if it doesn't exist
mkdir -p sql

echo "Repository cleanup complete!"
echo "Please review the changes before committing." 