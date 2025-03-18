# Backyard Magic Testing Resources

This directory contains testing and setup utilities that were moved from the main source code to keep the production codebase clean.

## Structure

- `/test` - Root folder for testing resources
  - `SupabaseTest.tsx` - Component for testing Supabase connection and configuration
  - `SupabaseSetup.tsx` - Setup wizard component for Supabase configuration
  - `/lib` - Library test utilities
    - `supabase-test.ts` - Utility functions for testing Supabase connection
    - `setup-supabase.ts` - Setup script for initializing Supabase tables and policies

## Using These Utilities

If you need to run the Supabase configuration tests or setup wizard:

1. Temporarily import the component in `src/App.tsx`:
   ```typescript
   import SupabaseTest from '../test/SupabaseTest';
   // or
   import SupabaseSetup from '../test/SupabaseSetup';
   ```

2. Add the route:
   ```typescript
   {
     path: "/supabase-test",
     element: <SupabaseTest />,
   },
   // or
   {
     path: "/supabase-setup",
     element: <SupabaseSetup />,
   },
   ```

3. Navigate to `/supabase-test` or `/supabase-setup` in your browser.

4. **Important**: Remove the imports and routes before deployment to production.

## Notes

- These utilities are for development and testing purposes only
- They are not intended to be used in a production environment
- Keep these files in the test directory to maintain a clean production codebase 