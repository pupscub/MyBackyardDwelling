import { useState } from 'react';
import { supabase, PropertyData, PropertySubmission } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { generateSatelliteImageUrl, formatAddress } from '@/lib/maps-utils';

export function usePropertyApi() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Submit a new property analysis request
   */
  const submitProperty = async (propertyData: PropertySubmission): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Ensure we have a complete address string
      // If not provided directly, construct it from components
      const address = propertyData.address || 
        (propertyData.street && propertyData.city && propertyData.state && propertyData.zip_code ? 
          formatAddress(propertyData.street, propertyData.city, propertyData.state, propertyData.zip_code) : 
          '');
      
      if (!address) {
        throw new Error('No valid address provided. Please include either a complete address or all address components.');
      }
      
      // Store in localStorage as fallback
      localStorage.setItem('propertyFormData', JSON.stringify({
        address: address,
        street: propertyData.street || '',
        city: propertyData.city || '',
        state: propertyData.state || '',
        zipCode: propertyData.zip_code || '',
        firstName: propertyData.first_name,
        lastName: propertyData.last_name,
        email: propertyData.email,
        timestamp: new Date().toISOString()
      }));
      
      // Check if address is in Massachusetts
      const isInMassachusetts = 
        (propertyData.state && propertyData.state.toUpperCase() === 'MA') || 
        (address && address.toUpperCase().includes(', MA '));
      
      // Flag to indicate service availability
      const serviceAvailable = isInMassachusetts;
      
      // Check if we already have this address in the database to reuse the satellite image
      let satelliteImageUrl = '';
      const { data: existingProperty, error: lookupError } = await supabase
        .from('property_submissions')
        .select('satellite_image_url')
        .eq('address', address)
        .limit(1);
      
      if (lookupError) {
        console.warn("Error checking for existing address:", lookupError);
      }
      
      // If we found an existing property with the same address, reuse its satellite image
      if (existingProperty && existingProperty.length > 0 && existingProperty[0].satellite_image_url) {
        console.log("Reusing existing satellite image URL for address:", address);
        satelliteImageUrl = existingProperty[0].satellite_image_url;
      } else if (serviceAvailable) {
        // Only generate a satellite image if the service is available in this location
        console.log("Generating new satellite image URL for address:", address);
        satelliteImageUrl = generateSatelliteImageUrl(address);
      } else {
        // Use a placeholder for non-MA addresses
        console.log("Using placeholder image for non-MA address:", address);
        satelliteImageUrl = "https://via.placeholder.com/800x400?text=Service+Only+Available+in+Massachusetts";
      }
      
      console.log("Submitting property data to Supabase:", {
        ...propertyData,
        address: address, // Ensure address is included
        service_available: serviceAvailable,
        satellite_image_url: satelliteImageUrl.substring(0, 50) + '...' // Truncate for log readability
      });
      
      // Insert into Supabase with the satellite image URL and service availability flag
      const { data, error } = await supabase
        .from('property_submissions')
        .insert([{
          ...propertyData,
          address: address, // Ensure we're saving the full address
          satellite_image_url: satelliteImageUrl,
          service_available: serviceAvailable
        }])
        .select()
        .single();
      
      if (error) {
        console.error("Supabase insert error:", error);
        
        // Provide more specific error messages based on error code
        let errorMsg = "";
        if (error.code === "42P01") {
          errorMsg = "The database table doesn't exist. Please visit /supabase-setup to configure your database.";
          setError(errorMsg);
          throw new Error(errorMsg);
        } else if (error.code === "42501") {
          errorMsg = "Permission denied. Security policies need to be configured. Please visit /supabase-setup.";
          setError(errorMsg);
          throw new Error(errorMsg);
        } else if (error.message && error.message.includes("function \"exec_sql\" does not exist")) {
          errorMsg = "The exec_sql function is missing. Please visit /supabase-setup to see manual configuration instructions.";
          setError(errorMsg);
          throw new Error(errorMsg);
        } else {
          errorMsg = `Supabase error: ${error.message || error.code || "Unknown error"}`;
          setError(errorMsg);
          throw error;
        }
      }
      
      console.log("Successfully inserted data, received ID:", data.id);
      
      // Show different toast message based on location
      if (serviceAvailable) {
        toast({
          title: "Property submitted successfully!",
          description: "We'll analyze your property and get back to you soon.",
        });
      } else {
        toast({
          title: "Address submitted successfully!",
          description: "Note: Our services are currently only available in Massachusetts.",
          variant: "destructive",
        });
      }
      
      return data.id;
    } catch (error: any) {
      console.error('Error submitting property:', error);
      
      // Enhanced error logging
      if (error.message) {
        console.error('Error message:', error.message);
      }
      if (error.details) {
        console.error('Error details:', error.details);
      }
      if (error.hint) {
        console.error('Error hint:', error.hint);
      }
      
      // If error is already set in the catch blocks above, use that
      // Otherwise create a user-friendly error message
      if (!error) {
        let errorMessage = "There was a problem submitting your property. ";
        
        if (error.message && error.message.includes("table doesn't exist")) {
          errorMessage = "Database table not found. Please run the Supabase setup wizard.";
          setError(errorMessage);
        } else if (error.message && error.message.includes("Permission denied")) {
          errorMessage = "Security policies need to be configured. Please run the Supabase setup wizard.";
          setError(errorMessage);
        } else if (error.code === "42P01") {
          errorMessage = "The database table doesn't exist. Please run the Supabase setup wizard.";
          setError(errorMessage);
        } else if (error.code === "42501") {
          errorMessage = "Permission denied. Security policies need to be configured.";
          setError(errorMessage);
        } else {
          // Generic error message as fallback
          errorMessage = "Please try again or run the Supabase setup wizard.";
          setError(errorMessage);
        }
        
        toast({
          variant: "destructive",
          title: "Submission failed",
          description: errorMessage,
        });
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get property analysis by ID
   */
  const getPropertyAnalysis = async (id: string): Promise<PropertyData | null> => {
    setLoading(true);
    setError(null);
    
    // Validate the ID - more robust validation
    if (!id || id.trim() === '' || id === 'undefined' || id === 'null') {
      const errorMsg = `Invalid ID provided: '${id}'. Cannot fetch property details.`;
      console.error(errorMsg);
      setError(errorMsg);
      setLoading(false);
      return null;
    }

    try {
      console.log("Fetching property analysis for ID:", id);
      
      // Log diagnostic info for debugging
      console.log("Debug info: Attempting to connect to Supabase database");
      
      // First, test if we can even connect to Supabase
      try {
        console.log("Testing Supabase connection...");
        const { data: connectionTest, error: connectionError } = await supabase.from('property_submissions').select('count').limit(1);
        
        if (connectionError) {
          console.error("Connection to Supabase failed:", connectionError);
          throw new Error(`Cannot connect to database: ${connectionError.message || connectionError.code || "Unknown error"}. Please check your internet connection and try again.`);
        }
        
        console.log("Connection test successful:", connectionTest);
      } catch (connErr: any) {
        console.error("Connection check failed:", connErr);
        setError(`Database connection error: ${connErr.message || "Unknown error"}. Please refresh the page and try again.`);
        setLoading(false);
        return null;
      }
      
      // Now proceed with the actual query
      console.log("Executing query for ID:", id);
      const { data, error } = await supabase
        .from('property_submissions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Supabase select error:", error);
        
        // Provide more specific error messages based on error code
        let errorMsg = "";
        if (error.code === "PGRST116") {
          errorMsg = `Property with ID ${id} not found. It may have been deleted or the ID is incorrect.`;
          setError(errorMsg);
          throw new Error(errorMsg);
        } else if (error.code === "42P01") {
          errorMsg = "The database table doesn't exist. Please visit /supabase-setup to configure your database.";
          setError(errorMsg);
          throw new Error(errorMsg);
        } else if (error.code === "42501") {
          errorMsg = "Permission denied. Security policies need to be configured. Please visit /supabase-setup.";
          setError(errorMsg);
          throw new Error(errorMsg);
        } else if (error.message && error.message.includes("not found")) {
          errorMsg = `Property with ID ${id} not found. It may have been deleted or the ID is incorrect.`;
          setError(errorMsg);
          throw new Error(errorMsg);
        } else {
          errorMsg = `Supabase error: ${error.message || error.code || "Unknown error"}`;
          setError(errorMsg);
          throw error;
        }
      }
      
      if (!data) {
        const errorMsg = `No data found for property ID: ${id}`;
        console.error(errorMsg);
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log("Successfully retrieved property data:", data);
      
      // Transform the data to match the expected format
      return {
        id: data.id,
        address: data.address,
        street: data.street,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        lot_size: data.lot_size,
        zoning: data.zoning,
        allows_adu: data.allows_adu ?? true,
        max_adu_size: data.max_adu_size,
        setback_front: data.setback_front,
        setback_back: data.setback_back,
        setback_sides: data.setback_sides,
        additional_notes: data.additional_notes,
        satellite_image_url: data.satellite_image_url,
        service_available: data.service_available ?? false,
        created_at: data.created_at
      };
    } catch (error: any) {
      console.error('Error fetching property analysis:', error);
      
      // Enhanced error logging
      if (error.message) {
        console.error('Error message:', error.message);
      }
      if (error.details) {
        console.error('Error details:', error.details);
      }
      if (error.hint) {
        console.error('Error hint:', error.hint);
      }
      
      // If error was already set above, use that
      if (!error) {
        let errorMessage = "We couldn't retrieve your property analysis. ";
        
        if (error.message && error.message.includes("table doesn't exist")) {
          errorMessage = "Database table not found. Please run the Supabase setup wizard.";
          setError(errorMessage);
        } else if (error.message && error.message.includes("Permission denied")) {
          errorMessage = "Security policies need to be configured. Please run the Supabase setup wizard.";
          setError(errorMessage);
        } else {
          errorMessage = "Please try again or run the Supabase setup wizard.";
          setError(errorMessage);
        }
        
        toast({
          variant: "destructive",
          title: "Failed to load analysis",
          description: errorMessage,
        });
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submitProperty,
    getPropertyAnalysis
  };
} 