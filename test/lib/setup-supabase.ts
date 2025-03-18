import { supabase } from './lib/supabase';

/**
 * Setup script to create the necessary Supabase table and RLS policies
 * This script tries to use the exec_sql RPC function if available,
 * but will provide manual SQL commands if that function doesn't exist.
 */
export async function setupSupabase() {
  console.log("🚀 Starting Supabase setup...");
  
  try {
    // Step 0: Test connection to Supabase
    console.log("Step 0: Testing connection to Supabase...");
    try {
      const { data: connectionTest, error: connectionError } = await supabase.from('pg_catalog.pg_tables').select('*').limit(1);
      
      if (connectionError) {
        console.error("❌ Connection failed:", connectionError);
        console.log("⚠️ Please check your Supabase URL and anon key in the .env file");
        return "Setup failed! Connection to Supabase failed.";
      } else {
        console.log("✅ Connection successful!");
      }
    } catch (e) {
      console.error("❌ Connection failed with exception:", e);
      return "Setup failed! Connection to Supabase failed.";
    }
    
    // Step 1: Check if the property_submissions table exists
    console.log("Step 1: Checking if property_submissions table exists...");
    
    const { error: checkError } = await supabase
      .from('property_submissions')
      .select('count(*)')
      .limit(1);
    
    let tableExists = false;
    let tableCreationFailed = false;
    
    if (checkError && checkError.code === '42P01') {
      console.log("Table doesn't exist, creating it...");
      
      // Create the table using SQL
      const createTableSQL = `
        CREATE TABLE property_submissions (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          address TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL,
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
        
        CREATE TRIGGER property_submissions_updated_at
        BEFORE UPDATE ON property_submissions
        FOR EACH ROW
        EXECUTE FUNCTION update_modified_column();
      `;
      
      // Try using the exec_sql RPC function (may not exist)
      const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
      
      if (createError) {
        console.error("❌ Error creating table via RPC:", createError);
        
        if (createError.message && createError.message.includes("function \"exec_sql\" does not exist")) {
          console.error("❌ The exec_sql function doesn't exist in your Supabase instance.");
          console.log("⚠️ You need to create the exec_sql function first, then create the table manually.");
          console.log("");
          console.log("== STEP 1: Create the exec_sql function ==");
          console.log(`
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;`);
          console.log("");
          console.log("== STEP 2: Create the property_submissions table ==");
          console.log(createTableSQL);
        } else {
          console.log("⚠️ You need to create the table manually in the Supabase dashboard SQL editor.");
          console.log("Copy this SQL and run it in your Supabase SQL Editor:");
          console.log(createTableSQL);
        }
        
        tableCreationFailed = true;
      } else {
        console.log("✅ Table created successfully!");
        tableExists = true;
      }
    } else {
      console.log("✅ Table already exists, skipping creation.");
      tableExists = true;
    }
    
    // Step 2: Set up RLS if the table exists or was just created
    if (tableExists) {
      console.log("Step 2: Setting up Row Level Security policies...");
      
      const rlsSQL = `
        -- Enable RLS on the table
        ALTER TABLE property_submissions ENABLE ROW LEVEL SECURITY;
        
        -- Create insert policy for anonymous users
        CREATE POLICY "Anyone can insert property submissions" 
        ON property_submissions
        FOR INSERT TO anon
        WITH CHECK (true);
        
        -- Create select policy for anonymous users
        CREATE POLICY "Anyone can view property submissions by ID" 
        ON property_submissions
        FOR SELECT TO anon
        USING (true);
      `;
      
      const { error: rlsError } = await supabase.rpc('exec_sql', { sql: rlsSQL });
      
      if (rlsError) {
        console.error("❌ Error setting up RLS:", rlsError);
        console.log("⚠️ You need to set up RLS manually in the Supabase dashboard SQL editor.");
        console.log("Copy this SQL and run it in your Supabase SQL Editor:");
        console.log(rlsSQL);
      } else {
        console.log("✅ RLS policies created successfully!");
      }
    } else if (tableCreationFailed) {
      console.log("⚠️ Skipping RLS setup because table creation failed.");
      return "Setup failed! Please run the SQL commands manually.";
    }
    
    // Step 3: Test the setup by inserting a test record
    console.log("Step 3: Testing setup with a sample insertion...");
    
    const testData = {
      address: "Test Address (will be deleted)",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com"
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('property_submissions')
      .insert([testData])
      .select();
    
    if (insertError) {
      console.error("❌ Test insertion failed:", insertError);
      console.log("⚠️ You may need to check your RLS policies or table structure.");
      return "Setup failed! Test insertion failed.";
    } else {
      console.log("✅ Test insertion successful!");
      
      // Clean up test data
      if (insertData && insertData.length > 0) {
        const { error: deleteError } = await supabase
          .from('property_submissions')
          .delete()
          .eq('id', insertData[0].id);
        
        if (deleteError) {
          console.warn("⚠️ Couldn't clean up test data:", deleteError);
        } else {
          console.log("✅ Test data cleaned up successfully.");
        }
      }
    }
    
    console.log("🎉 Setup process completed!");
    console.log("Try submitting your property form again - it should work now!");
    
    return "Setup completed! Check the console for details.";
    
  } catch (error) {
    console.error("❌ Unexpected error during setup:", error);
    return "Setup failed! Check the console for details.";
  }
} 