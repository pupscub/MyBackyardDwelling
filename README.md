# Backyard Magic - ADU Property Analysis

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
