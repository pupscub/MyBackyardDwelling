import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ui/theme-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Check, Send, Loader2 } from "lucide-react";
import { usePropertyApi } from "@/hooks/use-property-api";

// Define environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const HeroSection = () => {
  const { loading, error: apiError, submitProperty } = usePropertyApi();
  
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    firstName: '',
    lastName: '',
    email: ''
  });
  
  const [formStep, setFormStep] = useState(0);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Update error state when apiError changes
  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Enhanced validation with specific field checks
      const missingFields = [];
      
      if (!formData.firstName.trim()) missingFields.push('First Name');
      if (!formData.lastName.trim()) missingFields.push('Last Name');
      if (!formData.email.trim()) missingFields.push('Email');
      if (!formData.street.trim()) missingFields.push('Street Address');
      if (!formData.city.trim()) missingFields.push('City');
      if (!formData.state.trim()) missingFields.push('State');
      if (!formData.zipCode.trim()) missingFields.push('Zip Code');
      
      // If any fields are missing, show specific error message
      if (missingFields.length > 0) {
        setError(`Please fill out the following required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
      
      // State validation (2 characters)
      if (formData.state.trim().length !== 2) {
        setError('State should be a 2-letter code (e.g., MA, NY, CA)');
        return;
      }
      
      // Zip code validation (5 digits)
      const zipRegex = /^\d{5}$/;
      if (!zipRegex.test(formData.zipCode)) {
        setError('Please enter a valid 5-digit ZIP code');
        return;
      }
      
      // Format the complete address with proper formatting
      const fullAddress = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
      
      console.log("Submitting with formatted address:", fullAddress);
      
      // Submit to API
      const submissionId = await submitProperty({
        address: fullAddress,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email
      });
      
      if (submissionId) {
        // Store ID in session storage as backup
        try {
          sessionStorage.setItem('lastPropertySubmissionId', submissionId);
          // Also store form data with timestamp in local storage as fallback
          localStorage.setItem('propertyFormData', JSON.stringify({
            address: fullAddress,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            timestamp: new Date().toISOString()
          }));
        } catch (err) {
          console.error('Failed to store submission data in storage:', err);
        }
        
        setSubmissionId(submissionId);
        setFormStep(1);
        
        // Create the navigation URL
        const navigationUrl = `/property-analysis?id=${submissionId}&skipLoading=true`;
        console.log(`NAVIGATION: Will redirect to ${navigationUrl} in 3 seconds`);
        
        // Increased delay to 3 seconds to ensure user sees the thank you message
        setTimeout(() => {
          console.log("Navigating to property analysis page with ID:", submissionId);
          navigate(navigationUrl);
        }, 3000);
      } else {
        console.error("No submission ID returned from API");
        setError('Failed to submit property analysis request. Please try again.');
      }
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Failed to submit. Please try again later.');
    }
  };

  return (
    <section className={cn(
      "relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden",
      isDarkTheme ? "bg-navy" : ""
    )}>
      <div className={cn(
        "absolute inset-0 -z-10", 
        isDarkTheme 
          ? "bg-gradient-to-b from-navy/80 to-navy/60" 
          : "bg-gradient-to-b from-secondary/50 to-secondary/20"
      )} />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-radial from-brand-200/20 to-transparent -z-10" />
      
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <div className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium mb-2",
              isDarkTheme ? "bg-brand-700 text-white" : "bg-brand-100 text-brand-700"
            )}>
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              Transform Your Property
            </div>
            
            <h1 className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight",
              isDarkTheme ? "text-white" : "text-gray-900"
            )}>
              Unlock Your Property's <span className="text-brand-600 relative">ADU Potential</span>
            </h1>
            
            <p className={cn(
              "text-lg md:text-xl text-balance max-w-lg",
              isDarkTheme ? "text-gray-200" : "text-gray-700"
            )}>
              Discover what you can build on your property with AI-powered insights tailored to your location's zoning laws.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a 
                href="#property-analyzer" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-500 text-white font-medium transition-standard hover:bg-brand-600 hover:shadow-md"
              >
                Check Your Property
                <ArrowRight size={18} className="ml-2" />
              </a>
              
              <a 
                href="#how-it-works" 
                className={cn(
                  "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-standard hover:shadow-subtle",
                  isDarkTheme 
                    ? "bg-gray-800 border border-gray-700 text-white hover:bg-gray-700" 
                    : "bg-white/80 border border-gray-200 text-gray-700 hover:bg-white"
                )}
              >
                Learn How It Works
              </a>
            </div>
          </div>
          
          <div 
            id="property-analyzer" 
            className="relative animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="absolute inset-0 bg-gradient-radial from-brand-200/30 to-transparent rounded-2xl -z-10 blur-xl" />
            
            <div className={cn(
              "backdrop-blur rounded-2xl shadow-elevated border p-6 md:p-8 transition-standard hover:shadow-lg",
              isDarkTheme 
                ? "bg-gray-800/90 border-gray-700" 
                : "bg-white/90 border-gray-100"
            )}>
              {formStep === 0 ? (
                <>
                  <h2 className={cn(
                    "text-2xl font-semibold mb-6 text-center",
                    isDarkTheme ? "text-white" : "text-gray-900"
                  )}>
                    See What's Possible on Your Property
                  </h2>
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
                      <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span>{error}</span>
                        {(error.includes('supabase') || 
                          error.includes('database') || 
                          error.includes('setup') || 
                          error.includes('policy') || 
                          error.includes('table')) && (
                          <div className="mt-2">
                            <Link 
                              to="/supabase-setup" 
                              className="text-blue-600 hover:underline font-medium inline-flex items-center"
                            >
                              Run Supabase Setup Wizard
                              <ChevronRight size={16} className="ml-1" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className={cn(
                          "block text-sm font-medium",
                          isDarkTheme ? "text-gray-200" : "text-gray-700"
                        )}>
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          minLength={1}
                          className={cn(
                            "w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-standard text-gray-800",
                            isDarkTheme ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-800"
                          )}
                          placeholder="John"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="lastName" className={cn(
                          "block text-sm font-medium",
                          isDarkTheme ? "text-gray-200" : "text-gray-700"
                        )}>
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          minLength={1}
                          className={cn(
                            "w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-standard text-gray-800",
                            isDarkTheme ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-800"
                          )}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    {/* Street Address */}
                    <div className="space-y-2">
                      <label htmlFor="street" className={cn(
                        "block text-sm font-medium", 
                        isDarkTheme ? "text-gray-200" : "text-gray-700"
                      )}>
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        required
                        minLength={3}
                        className={cn(
                          "w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-standard text-gray-800",
                          isDarkTheme ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-800"
                        )}
                        placeholder="123 Main St"
                      />
                    </div>
                    
                    {/* City, State, Zip */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2 col-span-1">
                        <label htmlFor="city" className={cn(
                          "block text-sm font-medium",
                          isDarkTheme ? "text-gray-200" : "text-gray-700"
                        )}>
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          minLength={2}
                          className={cn(
                            "w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-standard text-gray-800",
                            isDarkTheme ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-800"
                          )}
                          placeholder="Boston"
                        />
                      </div>
                      
                      <div className="space-y-2 col-span-1">
                        <label htmlFor="state" className={cn(
                          "block text-sm font-medium",
                          isDarkTheme ? "text-gray-200" : "text-gray-700"
                        )}>
                          State
                        </label>
                        <select
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className={cn(
                            "w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-standard",
                            isDarkTheme ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-800"
                          )}
                        >
                          <option value="">Select State</option>
                          <option value="MA">MA - Massachusetts</option>
                          <option value="AL">AL - Alabama</option>
                          <option value="AK">AK - Alaska</option>
                          <option value="AZ">AZ - Arizona</option>
                          <option value="AR">AR - Arkansas</option>
                          <option value="CA">CA - California</option>
                          <option value="CO">CO - Colorado</option>
                          <option value="CT">CT - Connecticut</option>
                          <option value="DE">DE - Delaware</option>
                          <option value="FL">FL - Florida</option>
                          <option value="GA">GA - Georgia</option>
                          <option value="HI">HI - Hawaii</option>
                          <option value="ID">ID - Idaho</option>
                          <option value="IL">IL - Illinois</option>
                          <option value="IN">IN - Indiana</option>
                          <option value="IA">IA - Iowa</option>
                          <option value="KS">KS - Kansas</option>
                          <option value="KY">KY - Kentucky</option>
                          <option value="LA">LA - Louisiana</option>
                          <option value="ME">ME - Maine</option>
                          <option value="MD">MD - Maryland</option>
                          <option value="MI">MI - Michigan</option>
                          <option value="MN">MN - Minnesota</option>
                          <option value="MS">MS - Mississippi</option>
                          <option value="MO">MO - Missouri</option>
                          <option value="MT">MT - Montana</option>
                          <option value="NE">NE - Nebraska</option>
                          <option value="NV">NV - Nevada</option>
                          <option value="NH">NH - New Hampshire</option>
                          <option value="NJ">NJ - New Jersey</option>
                          <option value="NM">NM - New Mexico</option>
                          <option value="NY">NY - New York</option>
                          <option value="NC">NC - North Carolina</option>
                          <option value="ND">ND - North Dakota</option>
                          <option value="OH">OH - Ohio</option>
                          <option value="OK">OK - Oklahoma</option>
                          <option value="OR">OR - Oregon</option>
                          <option value="PA">PA - Pennsylvania</option>
                          <option value="RI">RI - Rhode Island</option>
                          <option value="SC">SC - South Carolina</option>
                          <option value="SD">SD - South Dakota</option>
                          <option value="TN">TN - Tennessee</option>
                          <option value="TX">TX - Texas</option>
                          <option value="UT">UT - Utah</option>
                          <option value="VT">VT - Vermont</option>
                          <option value="VA">VA - Virginia</option>
                          <option value="WA">WA - Washington</option>
                          <option value="WV">WV - West Virginia</option>
                          <option value="WI">WI - Wisconsin</option>
                          <option value="WY">WY - Wyoming</option>
                          <option value="DC">DC - District of Columbia</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2 col-span-1">
                        <label htmlFor="zipCode" className={cn(
                          "block text-sm font-medium",
                          isDarkTheme ? "text-gray-200" : "text-gray-700"
                        )}>
                          Zip Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                          pattern="[0-9]{5}"
                          title="Five digit zip code"
                          inputMode="numeric"
                          className={cn(
                            "w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-standard text-gray-800",
                            isDarkTheme ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-800"
                          )}
                          placeholder="02108"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className={cn(
                        "block text-sm font-medium",
                        isDarkTheme ? "text-gray-200" : "text-gray-700"
                      )}>
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                        title="Please enter a valid email address"
                        className={cn(
                          "w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-standard text-gray-800",
                          isDarkTheme ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-800"
                        )}
                        placeholder="your@email.com"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        "w-full py-3 px-4 rounded-lg font-medium text-white transition-standard",
                        "bg-brand-500 hover:bg-brand-600 hover:shadow-md mt-2",
                        loading && "opacity-70 cursor-not-allowed"
                      )}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Get My Property Analysis"
                      )}
                    </button>
                    
                    <p className={cn(
                      "text-xs text-center pt-2",
                      isDarkTheme ? "text-gray-400" : "text-gray-500"
                    )}>
                      By submitting, you agree to our <a href="/terms" className="text-brand-500 hover:underline">Terms</a> and <a href="/privacy" className="text-brand-500 hover:underline">Privacy Policy</a>.
                    </p>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className={cn(
                    "text-2xl font-semibold mb-3",
                    isDarkTheme ? "text-white" : "text-gray-900"
                  )}>Thank You!</h3>
                  <p className={cn(
                    "mb-6 max-w-md mx-auto",
                    isDarkTheme ? "text-gray-300" : "text-gray-600"
                  )}>
                    We've received your information and are preparing your property analysis report.
                  </p>
                  
                  <div className="mt-2 mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div className="bg-brand-500 h-2 rounded-full animate-progress"></div>
                    </div>
                  </div>
                  
                  <Link 
                    to={submissionId ? `/property-analysis?id=${submissionId}&skipLoading=true` : "/"}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium inline-block mt-2",
                      isDarkTheme 
                        ? "bg-brand-600 text-white hover:bg-brand-700" 
                        : "bg-brand-500 text-white hover:bg-brand-600"
                    )}
                  >
                    View Property Analysis Now
                  </Link>

                  <div className="mt-6 flex justify-center">
                    <button 
                      onClick={() => {
                        setFormStep(0);
                        setFormData({
                          firstName: "",
                          lastName: "",
                          street: "",
                          city: "",
                          state: "",
                          zipCode: "",
                          email: "",
                        });
                      }}
                      className={cn(
                        "text-sm font-medium underline",
                        isDarkTheme ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                      )}
                    >
                      Submit another property
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
