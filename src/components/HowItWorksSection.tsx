import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ui/theme-provider";

const steps = [
  {
    number: "01",
    title: "Property Analysis",
    description: "We analyze your property using AI to determine ADU feasibility based on local zoning laws and regulations.",
    image: "/process-1.jpg", // Placeholder - will use a default gradient instead
  },
  {
    number: "02",
    title: "Design & Planning",
    description: "Choose from pre-approved designs or create a custom ADU that maximizes your property's potential.",
    image: "/process-2.jpg", // Placeholder - will use a default gradient instead
  },
  {
    number: "03",
    title: "Permitting",
    description: "Our experts handle the complex permitting process, ensuring all approvals are secured properly.",
    image: "/process-3.jpg", // Placeholder - will use a default gradient instead
  },
  {
    number: "04",
    title: "Construction",
    description: "Experienced builders construct your ADU with quality materials and attention to detail.",
    image: "/process-4.jpg", // Placeholder - will use a default gradient instead
  },
];

const HowItWorksSection = () => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  return (
    <section id="how-it-works" className={cn(
      "py-20 relative overflow-hidden",
      isDarkTheme ? "bg-gray-900" : "bg-secondary/30"
    )}>
      <div className={cn(
        "absolute top-0 left-0 right-0 h-40 bg-gradient-to-b -z-10",
        isDarkTheme ? "from-navy to-transparent" : "from-white to-transparent"
      )} />
      
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            isDarkTheme ? "text-white" : "text-gray-900"
          )}>
            How It Works
          </h2>
          <p className={cn(
            "text-lg",
            isDarkTheme ? "text-gray-300" : "text-gray-700"
          )}>
            Our streamlined process takes the complexity out of ADU development, guiding you from concept to completion.
          </p>
        </div>

        <div className="relative">
          <div className={cn(
            "absolute left-1/2 -translate-x-1/2 w-0.5 h-full hidden lg:block",
            isDarkTheme ? "bg-brand-700" : "bg-brand-200"
          )} />
          
          {steps.map((step, index) => (
            <div 
              key={index}
              className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-center mb-20 last:mb-0 relative"
            >
              <div className={`order-2 ${index % 2 !== 0 ? "lg:order-2" : "lg:order-1"}`}>
                <div className={cn(
                  "backdrop-blur rounded-xl p-6 md:p-8 shadow-elevated border relative z-10 transition-standard hover:shadow-lg hover:translate-y-[-4px]",
                  isDarkTheme 
                    ? "bg-gray-800/90 border-gray-700" 
                    : "bg-white/90 border-gray-100"
                )}>
                  <div className={cn(
                    "inline-flex h-10 w-10 rounded-lg items-center justify-center font-mono text-lg font-semibold mb-4",
                    isDarkTheme 
                      ? "bg-brand-900/50 text-brand-400" 
                      : "bg-brand-100 text-brand-600"
                  )}>
                    {step.number}
                  </div>
                  <h3 className={cn(
                    "text-2xl font-bold mb-3",
                    isDarkTheme ? "text-white" : "text-gray-900"
                  )}>
                    {step.title}
                  </h3>
                  <p className={cn(
                    "mb-4",
                    isDarkTheme ? "text-gray-300" : "text-gray-700"
                  )}>
                    {step.description}
                  </p>
                  
                  {index === steps.length - 1 && (
                    <a 
                      href="#property-analyzer" 
                      className={cn(
                        "inline-flex items-center font-medium transition-standard group",
                        isDarkTheme ? "text-brand-400 hover:text-brand-300" : "text-brand-600 hover:text-brand-700"
                      )}
                    >
                      Start your project
                      <ArrowRight size={18} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
              
              <div className={`order-1 ${index % 2 !== 0 ? "lg:order-1" : "lg:order-2"}`}>
                <div className="aspect-video rounded-xl overflow-hidden shadow-elevated">
                  <div className={`w-full h-full bg-gradient-to-br ${
                    index % 4 === 0 ? "from-brand-200 to-brand-400" :
                    index % 4 === 1 ? "from-blue-200 to-brand-300" :
                    index % 4 === 2 ? "from-amber-200 to-brand-300" :
                    "from-rose-200 to-brand-300"
                  } flex items-center justify-center`}>
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-5xl font-bold text-white text-opacity-90">
                        STEP {index + 1}
                      </div>
                      {/* Add a visual indicator for better visibility */}
                      <div className="mt-2 h-1 w-16 bg-white rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={cn(
                  "hidden lg:block absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4",
                  isDarkTheme 
                    ? "bg-brand-500 border-gray-900" 
                    : "bg-brand-400 border-white"
                )} style={{ top: "calc(100% + 2.5rem)" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
