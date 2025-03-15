
import { useState } from "react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote: "The team at MyBackyardDwelling made building our ADU so much easier than we expected. From navigating permits to finding the perfect design, they were with us every step of the way.",
    author: "Sarah Johnson",
    location: "Portland, OR",
    image: "https://randomuser.me/api/portraits/women/42.jpg",
    rating: 5,
  },
  {
    quote: "I was hesitant about adding an ADU to my property, but their property analysis showed me how much value it would add. The process was smooth and the results exceeded my expectations.",
    author: "Michael Chen",
    location: "Los Angeles, CA",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    quote: "The AI-powered zoning analysis saved us months of research. We now have a beautiful backyard cottage that serves as both a guest house and a source of rental income.",
    author: "Emily Rodriguez",
    location: "Austin, TX",
    image: "https://randomuser.me/api/portraits/women/63.jpg",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="success-stories" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-brand-100 rounded-full opacity-50 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/70 rounded-full opacity-50 blur-3xl -z-10" />
      
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Success Stories</h2>
          <p className="text-lg text-gray-700">
            Hear from homeowners who have transformed their properties with MyBackyardDwelling.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-elevated border border-gray-100 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-300 to-brand-500" />
            
            <div className="p-8 md:p-10">
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonials[activeIndex].rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <blockquote className="text-xl md:text-2xl text-gray-800 font-medium mb-6 relative">
                <span className="absolute -top-2 -left-2 text-6xl text-brand-200">"</span>
                <p className="relative z-10 text-balance">
                  {testimonials[activeIndex].quote}
                </p>
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{testimonials[activeIndex].author}</div>
                  <div className="text-sm text-gray-600">{testimonials[activeIndex].location}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index === activeIndex ? "bg-brand-500 w-8" : "bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <a 
            href="#property-analyzer" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-500 text-white font-medium transition-standard hover:bg-brand-600 hover:shadow-md"
          >
            Start Your ADU Journey Today
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
