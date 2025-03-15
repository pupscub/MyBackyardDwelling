import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, Home, Ruler, MapPin, Check, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ui/theme-provider';

// API Base URL - should match the one in HeroSection
const API_BASE_URL = "/api";

// Interface for property data
interface PropertyData {
  address: string;
  firstName: string;
  lastName: string;
  email: string;
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
}

export default function PropertyAnalysis() {
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get('id');
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);

  useEffect(() => {
    const fetchPropertyData = async () => {
      // Try to get locally stored form data as fallback
      let localFormData = null;
      try {
        const storedData = localStorage.getItem('propertyFormData');
        if (storedData) {
          localFormData = JSON.parse(storedData);
          console.log("Found local form data:", localFormData);
        }
      } catch (e) {
        console.error("Error reading from localStorage:", e);
      }
    
      if (!submissionId) {
        if (localFormData) {
          // Use locally stored data if no submission ID
          console.log("No submission ID, using local data");
          setPropertyData({
            address: localFormData.address,
            firstName: localFormData.firstName,
            lastName: localFormData.lastName,
            email: localFormData.email,
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
              additionalNotes: ["Your property details are being processed."],
            },
            satelliteImageUrl: "https://via.placeholder.com/800x400?text=Property+Image+Loading",
            generatedAt: new Date().toISOString(),
          });
          setLoading(false);
          return;
        } else {
          setError('No submission ID provided');
          setLoading(false);
          return;
        }
      }

      try {
        console.log("Fetching property data for ID:", submissionId);
        const response = await fetch(`${API_BASE_URL}/property-analysis/${submissionId}`, {
          // Add credentials to ensure cookies are sent
          credentials: "include"
        });
        
        if (!response.ok) {
          console.error("API error status:", response.status);
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response:", data);
        
        if (data.success && data.analysis) {
          setPropertyData(data.analysis);
        } else {
          throw new Error(data.error || 'Failed to fetch property analysis');
        }
      } catch (err) {
        console.error('Error fetching property data:', err);
        
        // If we have local data, use it as fallback
        if (localFormData) {
          console.log("Using local data as fallback");
          setPropertyData({
            address: localFormData.address,
            firstName: localFormData.firstName,
            lastName: localFormData.lastName,
            email: localFormData.email,
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
              additionalNotes: ["Your property details are being processed."],
            },
            satelliteImageUrl: "https://via.placeholder.com/800x400?text=Property+Image+Loading",
            generatedAt: new Date().toISOString(),
          });
        } else {
          setError('Unable to load property analysis data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [submissionId]);

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <h3 className="mt-4 text-xl font-semibold">Loading your property analysis...</h3>
          <p className="mt-2 text-muted-foreground">This may take a few moments</p>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error || !propertyData) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl bg-destructive/10 p-6 rounded-lg border border-destructive">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Property Analysis</h2>
          <p className="mb-4">{error || 'Unable to load property data'}</p>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link to="/">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
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
            <span>Backyard Magic</span>
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
            Your Property Analysis
          </h1>
          <p className={cn(
            "text-lg max-w-2xl mx-auto",
            isDarkTheme ? "text-gray-300" : "text-gray-600"
          )}>
            We've analyzed {propertyData.address} to determine its potential for an ADU
          </p>
          <div className={cn(
            "text-sm mt-2",
            isDarkTheme ? "text-gray-400" : "text-gray-500"
          )}>
            Generated on {formatDate(propertyData.generatedAt)}
          </div>
        </div>

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
                <div className={cn(
                  "flex items-center gap-2",
                  isDarkTheme ? "text-white" : "text-gray-800"
                )}>
                  <MapPin className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">{propertyData.address}</span>
                </div>
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
                    {propertyData.propertyDetails.lotSize}
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
                    {propertyData.propertyDetails.zoning}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-1 rounded-full",
                  propertyData.propertyDetails.allowsAdu 
                    ? (isDarkTheme ? "bg-green-500/20" : "bg-green-100") 
                    : (isDarkTheme ? "bg-red-500/20" : "bg-red-100")
                )}>
                  {propertyData.propertyDetails.allowsAdu 
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
                    propertyData.propertyDetails.allowsAdu 
                      ? (isDarkTheme ? "text-green-400" : "text-green-600") 
                      : (isDarkTheme ? "text-red-400" : "text-red-600")
                  )}>
                    {propertyData.propertyDetails.allowsAdu 
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
              {propertyData.propertyDetails.maxAduSize}
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
                <span className="font-medium">{propertyData.propertyDetails.setbacks.front}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>Back:</span>
                <span className="font-medium">{propertyData.propertyDetails.setbacks.back}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>Sides:</span>
                <span className="font-medium">{propertyData.propertyDetails.setbacks.sides}</span>
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

        {/* Additional Notes */}
        <div className={cn(
          "rounded-xl border p-6 mb-10",
          isDarkTheme ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
        )}>
          <h3 className={cn(
            "text-xl font-semibold mb-4",
            isDarkTheme ? "text-white" : "text-gray-900"
          )}>
            Additional Notes
          </h3>
          <ul className="space-y-2">
            {propertyData.propertyDetails.additionalNotes.map((note, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className={cn(
                  "p-1 rounded-full mt-0.5",
                  isDarkTheme ? "bg-gray-700" : "bg-gray-100"
                )}>
                  <Check className={cn(
                    "h-4 w-4",
                    isDarkTheme ? "text-gray-300" : "text-gray-700"
                  )} />
                </div>
                <span className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>
                  {note}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button className="gap-2">
            Schedule Consultation
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className={cn(
        "mt-auto py-6 border-t",
        isDarkTheme ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}>
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={isDarkTheme ? "text-gray-400" : "text-gray-600"}>
              &copy; {new Date().getFullYear()} Backyard Magic. All rights reserved.
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