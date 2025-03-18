import { supabase } from './supabase';

/**
 * Test function to diagnose Supabase connection and setup issues
 * Run this function in the browser console to test your Supabase setup:
 * 
 * import('/src/lib/supabase-test.js').then(module => module.testSupabaseSetup())
 */
export async function testSupabaseSetup() {
  console.log("Starting Supabase diagnostic tests...");
  
  // Test 1: Check connection
  console.log("Test 1: Checking Supabase connection...");
  try {
    const { data: connectionTest, error: connectionError } = await supabase.from('pg_catalog.pg_tables').select('*').limit(1);
    
    if (connectionError) {
      console.error("❌ Connection failed:", connectionError);
      return;
    } else {
      console.log("✅ Connection successful");
    }
  } catch (e) {
    console.error("❌ Connection failed with exception:", e);
    return;
  }
  
  // Test 2: Check if property_submissions table exists
  console.log("Test 2: Checking if property_submissions table exists...");
  const { data: tableTest, error: tableError } = await supabase.from('property_submissions').select('count(*)');
  
  if (tableError) {
    if (tableError.code === "42P01") {
      console.error("❌ The 'property_submissions' table doesn't exist");
      console.log("You need to create the property_submissions table in the Supabase dashboard.");
      console.log("Go to Supabase > SQL Editor and run the SQL from SUPABASE_SETUP.md");
      
      // Direct link to create a table in Supabase
      console.log("Or go directly to: https://app.supabase.com/project/_/editor/new");
      return;
    } else {
      console.error("❌ Error checking table:", tableError);
      return;
    }
  } else {
    console.log("✅ Table 'property_submissions' exists");
  }
  
  // Test 3: Check RLS policies
  console.log("Test 3: Testing Row Level Security policies...");
  
  // Try to insert a test record
  const testData = {
    address: "Test Address (will be deleted)",
    first_name: "Test",
    last_name: "User",
    email: "test@example.com"
  };
  
  const { data: insertTest, error: insertError } = await supabase
    .from('property_submissions')
    .insert([testData])
    .select();
  
  if (insertError) {
    console.error("❌ Insert test failed, likely due to missing RLS policies:", insertError);
    console.log("You need to enable RLS and create appropriate policies in the Supabase dashboard.");
    console.log("For insert: CREATE POLICY \"Anyone can insert property submissions\" ON property_submissions FOR INSERT TO anon WITH CHECK (true);");
    console.log("For select: CREATE POLICY \"Anyone can view property submissions by ID\" ON property_submissions FOR SELECT TO anon USING (true);");
    return;
  } else {
    console.log("✅ Insert test succeeded");
    
    // Clean up test data
    if (insertTest && insertTest.length > 0) {
      const { error: deleteError } = await supabase
        .from('property_submissions')
        .delete()
        .eq('id', insertTest[0].id);
      
      if (deleteError) {
        console.warn("⚠️ Couldn't clean up test data:", deleteError);
      } else {
        console.log("✅ Test data cleaned up");
      }
    }
  }
  
  // Test 4: Check Google Maps API key
  console.log("Test 4: Checking Google Maps API key configuration...");
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey || apiKey === "your-google-maps-api-key") {
    console.warn("⚠️ Google Maps API key not properly configured");
    console.log("Set a valid API key in your .env file");
  } else {
    // Test it with a simple URL
    const testAddress = "1600 Amphitheatre Parkway, Mountain View, CA";
    const encodedAddress = encodeURIComponent(testAddress);
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=14&size=400x200&maptype=satellite&key=${apiKey}`;
    
    console.log("✅ Google Maps API key is configured");
    console.log("Testing Maps API with URL:", mapUrl);
    console.log("Open this URL in your browser to verify the API key works correctly");
  }
  
  console.log("Diagnostic tests completed.");
  return "Tests completed! Check the console output for results.";
} 