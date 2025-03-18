import { createClient } from '@supabase/supabase-js';

// These values will be read from environment variables defined in the .env file
// In production, make sure to properly set these values in your deployment environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for property data
export interface PropertyData {
  id: string;
  address: string;
  street: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  first_name: string;
  last_name: string;
  email: string;
  lot_size: string | null;
  zoning: string | null;
  allows_adu: boolean;
  max_adu_size: string | null;
  setback_front: string | null;
  setback_back: string | null;
  setback_sides: string | null;
  additional_notes: string[] | null;
  satellite_image_url: string | null;
  service_available: boolean | null;
  created_at: string;
}

// Types for new property submissions
export interface PropertySubmission {
  address: string;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  first_name: string;
  last_name: string;
  email: string;
} 