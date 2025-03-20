import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, Home, Ruler, MapPin, Check, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ui/theme-provider';
import { usePropertyApi } from '@/hooks/use-property-api';
import { PropertyData as SupabasePropertyData } from '@/lib/supabase';
import { generateSatelliteImageUrl, generateGoogleMapsUrl } from '@/lib/maps-utils';

// API Base URL - should match the one in HeroSection
const API_BASE_URL = "/api";

// Interface for property data (frontend format)
interface PropertyData {
  address: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  propertyDetails: {
    lotSize: string;
    zoning: string;
    allowsAdu: boolean;
    maxAduSize: string;
    setbacks: {
      front: string;
      back: string;
      sides: string;
    };
    additionalNotes: string[];
  };
  satelliteImageUrl: string;
  generatedAt: string;
  service_available: boolean;
}

// Convert Supabase data format to frontend format
const mapSupabaseToFrontend = (data: SupabasePropertyData | null): PropertyData => {
  console.log("Inside mapSupabaseToFrontend with data:", data);
  
  if (!data) {
    console.error("Null data provided to mapSupabaseToFrontend");
    
    // Return default data structure instead of null
    return {
      address: "Unknown address",
      firstName: "User",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zip_code: "",
      propertyDetails: {
        lotSize: "Not available",
        zoning: "Not available",
        allowsAdu: true,
        maxAduSize: "Not available",
        setbacks: {
          front: "Not available",
          back: "Not available",
          sides: "Not available",
        },
        additionalNotes: ["Unable to load property details."],
      },
      satelliteImageUrl: "https://via.placeholder.com/800x400?text=Satellite+Image+Unavailable",
      generatedAt: new Date().toISOString(),
      service_available: false, // Default to false when no data is available
    };
  }
  
  try {
    // Generate satellite image URL if not provided from database
    const satelliteImageUrl = data.satellite_image_url || generateSatelliteImageUrl(data.address);
    
    return {
      address: data.address || "Unknown address",
      firstName: data.first_name || "User",
      lastName: data.last_name || "",
      email: data.email || "",
      street: data.street || "",
      city: data.city || "",
      state: data.state || "",
      zip_code: data.zip_code || "",
      propertyDetails: {
        lotSize: data.lot_size || 'Not available',
        zoning: data.zoning || 'Not available',
        allowsAdu: data.allows_adu ?? true, // Use nullish coalescing to ensure boolean
        maxAduSize: data.max_adu_size || 'Not available',
        setbacks: {
          front: data.setback_front || 'Not available',
          back: data.setback_back || 'Not available',
          sides: data.setback_sides || 'Not available',
        },
        additionalNotes: data.additional_notes || ['Your property details are being processed.'],
      },
      satelliteImageUrl: satelliteImageUrl,
      generatedAt: data.created_at || new Date().toISOString(),
      service_available: data.service_available ?? (data.state === 'MA'), // Check if in MA when not explicitly set
    };
  } catch (e) {
    console.error("Error in mapSupabaseToFrontend:", e);
    
    // Return default data on error
    return {
      address: data.address || "Unknown address",
      firstName: data.first_name || "User",
      lastName: data.last_name || "",
      email: data.email || "",
      street: data.street || "",
      city: data.city || "",
      state: data.state || "",
      zip_code: data.zip_code || "",
      propertyDetails: {
        lotSize: "Error loading",
        zoning: "Error loading",
        allowsAdu: true,
        maxAduSize: "Error loading",
        setbacks: {
          front: "Error loading",
          back: "Error loading",
          sides: "Error loading",
        },
        additionalNotes: ["An error occurred while loading property details."],
      },
      satelliteImageUrl: "https://via.placeholder.com/800x400?text=Error+Loading+Image",
      generatedAt: new Date().toISOString(),
      service_available: true,
    };
  }
};

// Add this function after the mapSupabaseToFrontend function
const tryRecoverSubmissionId = (): string | null => {
  try {
    const sessionId = sessionStorage.getItem('lastPropertySubmissionId');
    if (sessionId) {
      console.log("Recovered submission ID from session storage:", sessionId);
      return sessionId;
    }
  } catch (err) {
    console.error("Failed to retrieve ID from session storage:", err);
  }
  return null;
};

export default function PropertyAnalysis() {
  const [searchParams, setSearchParams] = useSearchParams();
  const providedId = searchParams.get('id');
  const skipLoading = searchParams.get('skipLoading') === 'true';
  
  // Try to recover ID if none provided in URL
  const submissionId = providedId || tryRecoverSubmissionId();
  
  // If we recovered an ID but it's not in the URL, update the URL
  useEffect(() => {
    if (submissionId && !providedId) {
      console.log("Updating URL with recovered ID:", submissionId);
      const newParams = new URLSearchParams(searchParams);
      newParams.set('id', submissionId);
      setSearchParams(newParams);
    }
  }, [submissionId, providedId, setSearchParams, searchParams]);
  
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const { loading: apiLoading, error: apiError, getPropertyAnalysis } = usePropertyApi();

  const [loading, setLoading] = useState(!skipLoading); // Skip loading state if skipLoading is true
  const [error, setError] = useState<string | null>(null);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [debugInfo, setDebugInfo] = useState<{
    submissionId: string | null;
    hasLocalData: boolean;
    apiError: string | null;
    lastAttemptTime: string;
    validationIssues: string[];
  }>({
    submissionId: null,
    hasLocalData: false,
    apiError: null,
    lastAttemptTime: new Date().toISOString(),
    validationIssues: []
  });

  // Immediately try to get locally stored form data for faster rendering
  const getLocalFormData = useCallback(() => {
    try {
      const storedData = localStorage.getItem('propertyFormData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log("Found local form data:", parsedData);
        setDebugInfo(prev => ({ ...prev, hasLocalData: true }));
        return parsedData;
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    return null;
  }, []);

  // Function to create property data from local data
  const createPropertyDataFromLocal = useCallback((localData: any): PropertyData => {
    // Determine if the address is in MA
    const isInMA = localData.state && localData.state.toUpperCase() === 'MA';
    
    return {
      address: localData.address || "Unknown address",
      firstName: localData.firstName || "User",
      lastName: localData.lastName || "",
      email: localData.email || "",
      street: localData.street || "",
      city: localData.city || "",
      state: localData.state || "",
      zip_code: localData.zipCode || "",
      propertyDetails: {
        lotSize: "Not available",
        zoning: "Not available",
        allowsAdu: true, // Default to positive
        maxAduSize: "Not available",
        setbacks: {
          front: "Not available",
          back: "Not available",
          sides: "Not available",
        },
        additionalNotes: ["Your property details are being processed. Check back soon for updates."],
      },
      satelliteImageUrl: localData.satelliteImageUrl || generateSatelliteImageUrl(localData.address),
      generatedAt: localData.timestamp || new Date().toISOString(),
      service_available: isInMA, // Set based on state
    };
  }, []);

  // If skipLoading is true and we have local data, use it immediately
  useEffect(() => {
    if (skipLoading) {
      const localData = getLocalFormData();
      if (localData) {
        setPropertyData(createPropertyDataFromLocal(localData));
        setLoading(false);
      }
    }
  }, [skipLoading, getLocalFormData, createPropertyDataFromLocal]);

  // Set error if apiError changes
  useEffect(() => {
    if (apiError) {
      setError(apiError);
      setDebugInfo(prev => ({ ...prev, apiError }));
    }
  }, [apiError]);

  // Validate ID function
  const validateID = (id: string | null): { valid: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    if (!id) {
      issues.push("ID is null or undefined");
      return { valid: false, issues };
    }
    
    if (id.trim() === '') {
      issues.push("ID is empty string");
      return { valid: false, issues };
    }
    
    if (id === 'undefined' || id === 'null') {
      issues.push(`ID has invalid literal value: ${id}`);
      return { valid: false, issues };
    }
    
    // UUID validation (common format for Supabase IDs)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      issues.push(`ID does not appear to be a valid UUID format: ${id}`);
      // Not a critical error, just a warning
    }
    
    return { valid: issues.length === 0, issues };
  };

  // Main data fetching effect
  useEffect(() => {
    // If we're already showing content from local data due to skipLoading, 
    // still fetch from API but don't show loading state
    if (skipLoading && propertyData) {
      console.log("Already showing content from local data, fetching API data in the background");
    }

    const fetchPropertyData = async () => {
      // Validate the ID
      const { valid, issues } = validateID(submissionId);
      
      // Update debug info
      setDebugInfo(prev => ({ 
        ...prev, 
        submissionId,
        lastAttemptTime: new Date().toISOString(),
        validationIssues: issues
      }));
      
      if (!valid) {
        console.warn("ID validation issues:", issues);
      }
      
      // Try to get locally stored form data as fallback
      let localFormData = getLocalFormData();
    
      if (!submissionId) {
        console.log("No submission ID provided, checking for local data");
        if (localFormData) {
          // Use locally stored data if no submission ID
          console.log("Using local data since no submission ID is available");
          setPropertyData(createPropertyDataFromLocal(localFormData));
          setLoading(false);
          return;
        } else {
          console.error("No submission ID and no local data available");
          setError('No submission ID provided. Please try submitting the form again.');
          setLoading(false);
          return;
        }
      }

      try {
        console.log("Fetching property data for ID:", submissionId);
        // Use the Supabase hook to fetch property data
        const supabaseData = await getPropertyAnalysis(submissionId);
        
        console.log("Received Supabase data:", supabaseData);
        
        if (supabaseData) {
          // Map Supabase data to frontend format
          console.log("Mapping Supabase data to frontend format");
          const frontendData = mapSupabaseToFrontend(supabaseData);
          console.log("Frontend data after mapping:", frontendData);
          
          setPropertyData(frontendData);
        } else {
          console.error("No data returned from getPropertyAnalysis");
          
          // If we have local data, use it as fallback
          if (localFormData) {
            console.log("Using local data as fallback since no API data returned");
            setPropertyData(createPropertyDataFromLocal(localFormData));
          } else {
            throw new Error('Failed to fetch property analysis. No data returned from the database.');
          }
        }
      } catch (err: any) {
        console.error('Error fetching property data:', err);
        
        // If we have local data, use it as fallback
        if (localFormData) {
          console.log("Using local data as fallback due to fetch error");
          setPropertyData(createPropertyDataFromLocal(localFormData));
        } else {
          console.error("No local data available to use as fallback");
          setError(err.message || 'Unable to load property analysis data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [submissionId, getPropertyAnalysis, getLocalFormData, createPropertyDataFromLocal, skipLoading, propertyData]);

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // If loading, and not skipLoading, show a minimal loading indicator
  if ((loading || apiLoading) && !skipLoading) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <Link 
            to="/"
            className="text-brand-600 hover:text-brand-800 font-medium flex items-center mb-4"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to form
          </Link>
          
          {submissionId ? (
            <div className="bg-white/80 backdrop-blur border border-gray-100 rounded-lg shadow-sm p-6 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Preparing your property analysis...</p>
              <p className="mt-2 text-xs text-muted-foreground">ID: <span className="font-mono">{submissionId}</span></p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4" 
                onClick={() => setLoading(false)}
              >
                Skip waiting
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-red-600">No property ID found</p>
              <Button asChild className="mt-4">
                <Link to="/">Submit a property</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If error and no data, show error state
  if (error && !propertyData) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl bg-destructive/10 p-6 rounded-lg border border-destructive">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Property Analysis</h2>
          <p className="mb-4">{error || 'Unable to load property data'}</p>
          
          <details className="mb-6" open>
            <summary className="cursor-pointer text-sm text-muted-foreground mb-2">Debug Information</summary>
            <div className="bg-black/5 p-4 rounded text-xs font-mono">
              <p>Submission ID: {debugInfo.submissionId || 'None'}</p>
              <p>Has Local Data: {debugInfo.hasLocalData ? 'Yes' : 'No'}</p>
              <p>API Error: {debugInfo.apiError || 'None'}</p>
              <p>Last Attempt: {debugInfo.lastAttemptTime}</p>
              {debugInfo.validationIssues.length > 0 && (
                <div className="mt-2">
                  <p>ID Validation Issues:</p>
                  <ul className="list-disc pl-4">
                    {debugInfo.validationIssues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {submissionId && (
                <div className="mt-4 p-2 bg-black/10 rounded">
                  <p className="font-bold">Direct API Testing:</p>
                  <p className="mt-1 break-all">
                    Try directly accessing: <br/>
                    <a 
                      href={`${window.location.origin}/api/properties/${submissionId}`} 
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {window.location.origin}/api/properties/{submissionId}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </details>
          
          <div className="flex gap-4 flex-wrap">
            <Button asChild variant="outline">
              <Link to="/">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            {submissionId && (
              <Button
                variant="secondary"
                onClick={() => {
                  const testUrl = `${window.location.origin}/api/properties/${submissionId}`;
                  window.open(testUrl, '_blank');
                }}
              >
                Test API Directly
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If we have property data, show it, even if there's an error
  // This allows for showing partial data even when there's an API error
  if (!propertyData) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white/80 backdrop-blur border border-gray-100 rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Property Data Unavailable</h2>
          <p className="mb-4 text-gray-600">We couldn't load your property analysis data. Please try submitting your information again.</p>
          <Button asChild>
            <Link to="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen pb-16",
      isDarkTheme ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    )}>
      {/* Header */}
      <header className={cn(
        "p-4 shadow-sm border-b sticky top-0 z-10",
        isDarkTheme ? "bg-gray-900/95 border-gray-800" : "bg-white/95 border-gray-100"
      )}>
        <div className="container flex justify-between items-center">
          <Link 
            to="/" 
            className={cn(
              "flex items-center gap-2 text-lg font-semibold",
              isDarkTheme ? "text-white" : "text-gray-900"
            )}
          >
            <img 
              src="/house-icon.svg"
              alt="House Icon" 
              className="h-6 w-6" 
            />
            <span>My Backyard Dwelling</span>
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-8 md:py-12">
        {/* Title Section */}
        <div className="mb-10 text-center">
          <h1 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            isDarkTheme ? "text-white" : "text-gray-900"
          )}>
            {propertyData.service_available === false 
              ? "Service Area Information" 
              : "Your Property Analysis"
            }
          </h1>
          <p className={cn(
            "text-lg max-w-2xl mx-auto",
            isDarkTheme ? "text-gray-300" : "text-gray-600"
          )}>
            {propertyData.service_available === false 
              ? `We've received your information for ${propertyData?.address || "your property"}`
              : `We've analyzed ${propertyData?.address || "your property"} to determine its potential for an ADU`
            }
          </p>
          <div className={cn(
            "text-sm mt-2",
            isDarkTheme ? "text-gray-400" : "text-gray-500"
          )}>
            Generated on {formatDate(propertyData?.generatedAt || new Date().toISOString())}
          </div>
        </div>

        {/* Service Area Notice - Show this instead of property details when outside of service area */}
        {propertyData.service_available === false && (
          <div className="max-w-2xl mx-auto mb-10">
            <div className={cn(
              "rounded-xl border p-8 text-center",
              isDarkTheme ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
            )}>
              <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-amber-600" />
              </div>
              
              <h2 className={cn(
                "text-2xl font-semibold mb-4",
                isDarkTheme ? "text-white" : "text-gray-900"
              )}>
                Service Area Limitation
              </h2>
              
              <p className={cn(
                "mb-6 text-lg",
                isDarkTheme ? "text-gray-300" : "text-gray-600"
              )}>
                We're currently only offering our ADU analysis and services in <span className="font-semibold">Massachusetts (MA)</span>.
              </p>
              
              <p className={cn(
                "mb-8",
                isDarkTheme ? "text-gray-300" : "text-gray-600"
              )}>
                We've saved your information for {propertyData.address || "your property"} ({propertyData.state || "non-MA"}) and will notify you when we expand to your area.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link to="/">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                
                <Button asChild>
                  <a 
                    href="mailto:info@mybackyarddwelling.com?subject=Service%20Area%20Expansion%20Request"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact Us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Only show property analysis content if service is available */}
        {propertyData.service_available !== false && (
          <>
            {/* Property Overview Card */}
            <div className="grid gap-8 md:grid-cols-2 mb-10">
              {/* Left Column: Satellite Image */}
              <div className={cn(
                "rounded-xl overflow-hidden border shadow-sm",
                isDarkTheme ? "border-gray-700" : "border-gray-200"
              )}>
                <div className="aspect-video relative">
                  {/* Satellite image from Google Maps */}
                  <img 
                    src={propertyData.satelliteImageUrl} 
                    alt="Aerial view of property" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If the image fails to load, use a placeholder
                      e.currentTarget.src = "https://via.placeholder.com/800x400?text=Satellite+Image+Unavailable";
                    }}
                    loading="eager"
                  />
                  <div className={cn(
                    "absolute bottom-0 left-0 right-0 p-3",
                    isDarkTheme ? "bg-gradient-to-t from-black/80 to-transparent" : "bg-gradient-to-t from-white/80 to-transparent"
                  )}>
                    <a 
                      href={generateGoogleMapsUrl(propertyData.address)} 
                      target="_blank"
                      rel="noopener noreferrer" 
                      className={cn(
                        "flex items-center gap-2",
                        isDarkTheme ? "text-white hover:text-blue-300" : "text-gray-800 hover:text-blue-600"
                      )}
                    >
                      <MapPin className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{propertyData?.address || "Address unavailable"}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Property Details */}
              <div className={cn(
                "rounded-xl border p-6",
                isDarkTheme ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
              )}>
                <h2 className={cn(
                  "text-xl font-semibold mb-4",
                  isDarkTheme ? "text-white" : "text-gray-900"
                )}>
                  Property Overview
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Ruler className={cn(
                      "h-5 w-5 mt-0.5 flex-shrink-0",
                      isDarkTheme ? "text-gray-300" : "text-gray-700"
                    )} />
                    <div>
                      <h3 className={cn(
                        "font-medium",
                        isDarkTheme ? "text-gray-200" : "text-gray-800"
                      )}>
                        Lot Size
                      </h3>
                      <p className={cn(
                        isDarkTheme ? "text-gray-300" : "text-gray-700"
                      )}>
                        {propertyData?.propertyDetails?.lotSize || "Not available"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Home className={cn(
                      "h-5 w-5 mt-0.5 flex-shrink-0",
                      isDarkTheme ? "text-gray-300" : "text-gray-700"
                    )} />
                    <div>
                      <h3 className={cn(
                        "font-medium",
                        isDarkTheme ? "text-gray-200" : "text-gray-800"
                      )}>
                        Zoning
                      </h3>
                      <p className={cn(
                        isDarkTheme ? "text-gray-300" : "text-gray-700"
                      )}>
                        {propertyData?.propertyDetails?.zoning || "Not available"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-1 rounded-full",
                      propertyData?.propertyDetails?.allowsAdu 
                        ? (isDarkTheme ? "bg-green-500/20" : "bg-green-100") 
                        : (isDarkTheme ? "bg-red-500/20" : "bg-red-100")
                    )}>
                      {propertyData?.propertyDetails?.allowsAdu 
                        ? <Check className={`h-4 w-4 ${isDarkTheme ? "text-green-400" : "text-green-600"}`} /> 
                        : <X className={`h-4 w-4 ${isDarkTheme ? "text-red-400" : "text-red-600"}`} />
                      }
                    </div>
                    <div>
                      <h3 className={cn(
                        "font-medium",
                        isDarkTheme ? "text-gray-200" : "text-gray-800"
                      )}>
                        ADU Eligibility
                      </h3>
                      <p className={cn(
                        propertyData?.propertyDetails?.allowsAdu 
                          ? (isDarkTheme ? "text-green-400" : "text-green-600") 
                          : (isDarkTheme ? "text-red-400" : "text-red-600")
                      )}>
                        {propertyData?.propertyDetails?.allowsAdu 
                          ? "Your property qualifies for an ADU" 
                          : "Your property may not qualify for an ADU"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ADU Details Section */}
            <div className="grid gap-8 md:grid-cols-3 mb-10">
              {/* ADU Size Info */}
              <div className={cn(
                "rounded-xl border p-6",
                isDarkTheme ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
              )}>
                <h3 className={cn(
                  "text-lg font-semibold mb-3",
                  isDarkTheme ? "text-white" : "text-gray-900"
                )}>
                  Maximum ADU Size
                </h3>
                <p className={cn(
                  "text-2xl font-bold",
                  isDarkTheme ? "text-white" : "text-gray-900"
                )}>
                  {propertyData?.propertyDetails?.maxAduSize || "Not available"}
                </p>
                <p className={cn(
                  "mt-2 text-sm",
                  isDarkTheme ? "text-gray-400" : "text-gray-500"
                )}>
                  Based on local regulations and your property specifications
                </p>
              </div>

              {/* Setbacks Info */}
              <div className={cn(
                "rounded-xl border p-6",
                isDarkTheme ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
              )}>
                <h3 className={cn(
                  "text-lg font-semibold mb-3",
                  isDarkTheme ? "text-white" : "text-gray-900"
                )}>
                  Required Setbacks
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>Front:</span>
                    <span className="font-medium">{propertyData?.propertyDetails?.setbacks?.front || "Not available"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>Back:</span>
                    <span className="font-medium">{propertyData?.propertyDetails?.setbacks?.back || "Not available"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>Sides:</span>
                    <span className="font-medium">{propertyData?.propertyDetails?.setbacks?.sides || "Not available"}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className={cn(
                "rounded-xl border p-6",
                isDarkTheme 
                  ? "bg-primary/10 border-primary/20" 
                  : "bg-primary/5 border-primary/10"
              )}>
                <h3 className={cn(
                  "text-lg font-semibold mb-3",
                  isDarkTheme ? "text-primary-foreground" : "text-primary"
                )}>
                  Next Steps
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className={cn(
                      "h-5 w-5 mt-0.5 flex-shrink-0",
                      isDarkTheme ? "text-primary-foreground" : "text-primary"
                    )} />
                    <span className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>
                      Schedule a free consultation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className={cn(
                      "h-5 w-5 mt-0.5 flex-shrink-0",
                      isDarkTheme ? "text-primary-foreground" : "text-primary"
                    )} />
                    <span className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>
                      Explore available ADU designs
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className={cn(
                      "h-5 w-5 mt-0.5 flex-shrink-0",
                      isDarkTheme ? "text-primary-foreground" : "text-primary"
                    )} />
                    <span className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>
                      Get financing pre-approval
                    </span>
                  </li>
                </ul>
                <Button className="w-full mt-4">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={cn(
        "mt-auto py-6 border-t",
        isDarkTheme ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}>
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={isDarkTheme ? "text-gray-400" : "text-gray-600"}>
              &copy; {new Date().getFullYear()} My Backyard Dwelling. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link to="/" className={isDarkTheme ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}>
                Privacy Policy
              </Link>
              <Link to="/" className={isDarkTheme ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 