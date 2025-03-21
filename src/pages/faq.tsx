import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ui/theme-provider";

// FAQ data structure with questions, answers, and resource links
const faqData = [
  {
    question: "What qualifies as an ADU?",
    answer: "An Accessory Dwelling Unit (ADU) is a secondary housing unit on a single-family residential lot. ADUs can be detached structures (like backyard cottages), attached to the main house, or converted spaces within the existing home (like basement or garage conversions).",
    // resources: [
    //   { text: "Massachusetts ADU Guidelines", url: "/resources/ma-adu-guidelines" },
    //   { text: "ADU Types and Styles", url: "/resources/adu-types" }
    // ]
  },
  {
    question: "How can an ADU add value to my property?",
    answer: "ADUs can significantly increase your property value while providing rental income, flexible space for family members, or a home office. In many markets, homes with ADUs sell for 20-30% more than comparable properties without them.",
    // resources: [
    //   { text: "ADU ROI Calculator", url: "/resources/adu-roi-calculator" },
    //   { text: "Property Value Impact Study", url: "/resources/property-value-impact" }
    // ]
  },
  {
    question: "What are the zoning requirements for building an ADU in Massachusetts?",
    answer: "Zoning requirements vary by municipality in Massachusetts. Generally, you'll need to consider setbacks (distance from property lines), maximum size limitations, height restrictions, parking requirements, and design guidelines. Our property analysis tool can help determine your specific zoning requirements.",
    // resources: [
    //   { text: "Massachusetts Zoning Map", url: "/resources/ma-zoning-map" },
    //   { text: "Local ADU Regulations", url: "/resources/local-regulations" }
    // ]
  },
  {
    question: "How much does it cost to build an ADU?",
    answer: "The cost to build an ADU in Massachusetts typically ranges from $150,000 to $350,000, depending on size, finishes, site conditions, and whether it's attached or detached. Conversion ADUs (like finishing a basement) can be less expensive than ground-up construction.",
    // resources: [
    //   { text: "ADU Cost Breakdown", url: "/resources/adu-cost-breakdown" },
    //   { text: "Financing Options", url: "/resources/financing-options" }
    // ]
  },
  {
    question: "How long does it take to build an ADU?",
    answer: "The timeline for an ADU project typically ranges from 8-14 months from start to finish. This includes 2-4 months for design and permitting, and 6-10 months for construction. Conversion projects may be completed more quickly than new detached structures.",
    // resources: [
    //   { text: "Project Timeline Guide", url: "/resources/project-timeline" },
    //   { text: "Permitting Process Overview", url: "/resources/permitting-process" }
    // ]
  },
  {
    question: "What are the possible uses for an ADU?",
    answer: "ADUs offer versatile living spaces that can be used as rental units, housing for family members (such as aging parents or adult children), home offices, studios, guest houses, or short-term rentals depending on local regulations.",
    // resources: [
    //   { text: "ADU Use Cases", url: "/resources/adu-use-cases" },
    //   { text: "Rental Income Strategies", url: "/resources/rental-strategies" }
    // ]
  },
  {
    question: "Do I need permits to build an ADU?",
    answer: "Yes, you will need building permits and possibly other approvals to build an ADU in Massachusetts. Requirements typically include building permits, zoning approvals, and in some areas, design review. Our team can help guide you through the permitting process.",
    // resources: [
    //   { text: "Massachusetts Permitting Guide", url: "/resources/ma-permitting-guide" },
    //   { text: "Common Permit Obstacles", url: "/resources/permit-obstacles" }
    // ]
  },
  {
    question: "Can I rent out my ADU in Massachusetts?",
    answer: "Yes, in most Massachusetts municipalities, you can rent out your ADU. However, regulations regarding rental terms (short-term vs. long-term) vary by location. Some areas have owner-occupancy requirements, meaning you must live in either the main house or the ADU.",
    // resources: [
    //   { text: "MA Rental Regulations", url: "/resources/ma-rental-regulations" },
    //   { text: "ADU Rental Agreement Template", url: "/resources/rental-agreement" }
    // ]
  },
  {
    question: "What financing options are available for building an ADU?",
    answer: "Financing options for ADUs include home equity loans, cash-out refinancing, construction loans, renovation loans (like FHA 203k), and in some areas, specialized ADU loans. Massachusetts also offers various grants and incentives for affordable housing ADUs.",
    // resources: [
    //   { text: "ADU Financing Comparison", url: "/resources/financing-comparison" },
    //   { text: "Massachusetts ADU Incentives", url: "/resources/ma-incentives" }
    // ]
  },
  {
    question: "How does MyBackyardDwelling help with the ADU process?",
    answer: "MyBackyardDwelling provides end-to-end support for your ADU project. We start with a property analysis to determine feasibility, help with design and permitting, connect you with qualified contractors, and guide you through the construction process. Our goal is to make adding an ADU as simple and stress-free as possible.",
    // resources: [
    //   { text: "Our Process", url: "/resources/our-process" },
    //   { text: "Success Stories", url: "/success-stories" }
    // ]
  },
];

const FAQ = () => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const [openItems, setOpenItems] = useState<string[]>([]);

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      isDarkTheme 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    )}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6 mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className={cn(
              "text-3xl md:text-4xl font-bold mb-4",
              isDarkTheme ? "text-white" : "text-gray-900"
            )}>
              Frequently Asked Questions
            </h1>
            <p className={cn(
              "text-lg max-w-3xl mx-auto",
              isDarkTheme ? "text-gray-300" : "text-gray-600"
            )}>
              Find answers to common questions about ADUs, regulations, and our services.
              If you don't see your question here, please reach out to our team.
            </p>
          </div>
          
          {/* FAQ Accordion Section */}
          <div className="max-w-3xl mx-auto mb-16">
            <Accordion type="multiple" value={openItems} 
              onValueChange={setOpenItems}
              className={cn(
                "rounded-xl overflow-hidden shadow-elevated border",
                isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              )}
            >
              {faqData.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className={cn(
                    "border-b transition-colors",
                    isDarkTheme ? "border-gray-700" : "border-gray-200",
                    index === faqData.length - 1 && "border-b-0"
                  )}
                >
                  <AccordionTrigger 
                    className={cn(
                      "py-5 px-6 text-left hover:no-underline transition-all",
                      isDarkTheme 
                        ? "text-white hover:bg-gray-700/50" 
                        : "text-gray-900 hover:bg-gray-100/50"
                    )}
                  >
                    <span className="text-lg font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5">
                    <div className={cn(
                      "mb-4",
                      isDarkTheme ? "text-gray-300" : "text-gray-700"
                    )}>
                      {faq.answer}
                    </div>
                    
                    {faq.resources && faq.resources.length > 0 && (
                      <div>
                        <h4 className={cn(
                          "text-sm font-medium mb-2",
                          isDarkTheme ? "text-gray-400" : "text-gray-600"
                        )}>
                          Helpful Resources:
                        </h4>
                        <ul className="space-y-1">
                          {faq.resources.map((resource, idx) => (
                            <li key={idx}>
                              <Link
                                to={resource.url}
                                className={cn(
                                  "flex items-center text-sm group",
                                  isDarkTheme 
                                    ? "text-sunnyellow hover:text-yellow-300" 
                                    : "text-brand-600 hover:text-brand-700"
                                )}
                              >
                                <ExternalLink className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                <span>{resource.text}</span>
                                <ChevronRight className="h-3.5 w-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          {/* Call to Action */}
          <div className={cn(
            "max-w-3xl mx-auto text-center py-10 px-6 rounded-2xl shadow-elevated border",
            isDarkTheme 
              ? "bg-gray-800/50 border-gray-700" 
              : "bg-white border-gray-200"
          )}>
            <h2 className={cn(
              "text-2xl md:text-3xl font-bold mb-4",
              isDarkTheme ? "text-white" : "text-gray-900"
            )}>
              Still Have Questions?
            </h2>
            <p className={cn(
              "text-lg mb-8 max-w-2xl mx-auto",
              isDarkTheme ? "text-gray-300" : "text-gray-600"
            )}>
              We're here to help you understand everything about ADUs and your specific property.
              Schedule a free consultation with our experts to get personalized answers.
            </p>
            <Link to="/contact#get-in-touch">
              <Button 
                size="lg"
                className="gap-2 text-base px-8 py-6 h-auto rounded-full bg-sunnyellow hover:bg-amber-400 text-gray-900 font-medium"
              >
                Schedule a Free Consultation
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
