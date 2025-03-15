import { useState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ui/theme-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Check, Send, Loader2 } from "lucide-react";

// Define API base URL - can be moved to environment config
// Use relative URL to avoid CORS issues
const API_BASE_URL = "/api";  // Changed from http://localhost:5001/api

const HeroSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("Submitting form data:", formData);
      
      // Basic validation
      if (!formData.firstName || !formData.lastName || !formData.address || !formData.email) {
        throw new Error("Please fill out all required fields");
      }
      
      // Send data to our backend API
      const response = await fetch(`${API_BASE_URL}/submit-property`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        // Add credentials to ensure cookies are sent
        credentials: "include"
      });
      
      console.log("Response status:", response.status);
      
      // Try to parse the response as JSON
      let result;
      try {
        result = await response.json();
        console.log("Response data:", result);
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
        throw new Error("Failed to parse server response. Is the server running?");
      }
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit form");
      }
      
      console.log("Form submitted successfully:", result);
      
      // Store the form data in localStorage as a fallback
      localStorage.setItem('propertyFormData', JSON.stringify(formData));
      
      // Check if there's a redirect URL in the response
      if (result.redirect) {
        console.log("Will redirect to:", result.redirect);
        setFormStep(1); // Move to success state before navigation
        
        // Allow time for the success message to be seen
        setTimeout(() => {
          console.log("Navigating to:", result.redirect);
          // Use navigate instead of direct window.location to avoid page reload
          navigate(result.redirect);
        }, 1500);
      } else {
        // If no redirect but successful submission, just show success
        setFormStep(1); 
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
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
                      <span>{error}</span>
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
                          className={cn(
                            "w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-standard text-gray-800",
                            isDarkTheme ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-800"
                          )}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="address" className={cn(
                        "block text-sm font-medium", 
                        isDarkTheme ? "text-gray-200" : "text-gray-700"
                      )}>
                        Enter Your Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className={cn(
                          "w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-standard text-gray-800",
                          isDarkTheme ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-800"
                        )}
                        placeholder="123 Main St, Boston, MA"
                      />
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
                        className={cn(
                          "w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-standard text-gray-800",
                          isDarkTheme ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-800"
                        )}
                        placeholder="your@email.com"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "w-full py-3 px-4 rounded-lg font-medium text-white transition-standard",
                        "bg-brand-500 hover:bg-brand-600 hover:shadow-md mt-2",
                        isSubmitting && "opacity-70 cursor-not-allowed"
                      )}
                    >
                      {isSubmitting ? (
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
                    We've received your information and will send your property analysis to {formData.email} within 24 hours.
                  </p>
                  <button 
                    onClick={() => {
                      setFormStep(0);
                      setFormData({
                        firstName: "",
                        lastName: "",
                        address: "",
                        email: "",
                      });
                    }}
                    className={cn(
                      "font-medium",
                      isDarkTheme ? "text-brand-400 hover:text-brand-300" : "text-brand-600 hover:text-brand-700"
                    )}
                  >
                    Submit another property
                  </button>
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
