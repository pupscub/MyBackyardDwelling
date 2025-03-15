import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ui/theme-provider";

const features = [
  {
    title: "AI-Powered Property Analysis",
    description: "Our proprietary algorithms analyze your property's potential based on local zoning laws, setbacks, and building codes.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    title: "Custom ADU Designs",
    description: "Browse through hundreds of pre-approved ADU designs or work with our architects to create a custom solution.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "Permit Expedition",
    description: "Our team handles the entire permitting process, navigating complex regulations and approvals on your behalf.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Finance Solutions",
    description: "Explore financing options tailored to ADU development, including loans, grants, and investment partnerships.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const FeaturesSection = () => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  return (
    <section id="features" className={cn(
      "py-20 relative overflow-hidden",
      isDarkTheme ? "bg-gray-900" : "bg-white"
    )}>
      <div className={cn(
        "absolute top-0 inset-x-0 h-40 -z-10",
        isDarkTheme ? "bg-navy/30" : "bg-secondary/30"
      )} />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-100 rounded-full opacity-50 blur-3xl -z-10" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-100 rounded-full opacity-50 blur-3xl -z-10" />
      
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            isDarkTheme ? "text-white" : "text-gray-900"
          )}>
            Simplifying ADU Development
          </h2>
          <p className={cn(
            "text-lg",
            isDarkTheme ? "text-gray-300" : "text-gray-700"
          )}>
            From initial concept to final construction, we provide everything you need to add value to your property with an ADU.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={cn(
                "relative group",
                "flex flex-col p-6 rounded-xl transition-standard",
                isDarkTheme 
                  ? "bg-gray-800 border border-gray-700 shadow-subtle hover:shadow-elevated hover:border-brand-700" 
                  : "bg-white border border-gray-100 shadow-subtle hover:shadow-elevated hover:border-brand-200"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={cn(
                "flex items-center justify-center w-12 h-12 mb-5 rounded-lg",
                isDarkTheme 
                  ? "bg-brand-900/40 text-brand-400" 
                  : "bg-brand-100 text-brand-600"
              )}>
                {feature.icon}
              </div>
              <h3 className={cn(
                "text-xl font-semibold mb-3",
                isDarkTheme ? "text-white" : "text-gray-900"
              )}>
                {feature.title}
              </h3>
              <p className={cn(
                "flex-grow",
                isDarkTheme ? "text-gray-300" : "text-gray-600"
              )}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className={cn(
          "mt-16 p-8 md:p-10 rounded-2xl shadow-subtle",
          isDarkTheme 
            ? "bg-gradient-to-r from-navy to-gray-800"
            : "bg-gradient-to-r from-brand-50 to-secondary/70"
        )}>
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3 space-y-4">
              <h3 className={cn(
                "text-2xl md:text-3xl font-bold",
                isDarkTheme ? "text-white" : "text-gray-900"
              )}>
                Ready to maximize your property's potential?
              </h3>
              <p className={cn(
                isDarkTheme ? "text-gray-300" : "text-gray-700"
              )}>
                Our team of experts is ready to guide you through the entire process, from zoning analysis to move-in day.
              </p>
              <ul className="space-y-2">
                {[
                  "Free initial property assessment",
                  "Personalized design consultation",
                  "Transparent pricing and timelines",
                  "Ongoing support throughout construction",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={20} className="text-brand-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDarkTheme ? "text-white" : ""}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <a 
                href="#property-analyzer" 
                className="block w-full py-4 px-6 bg-brand-500 text-white text-center rounded-lg font-medium shadow-md hover:bg-brand-600 transition-standard"
              >
                Start Your Free Assessment
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
