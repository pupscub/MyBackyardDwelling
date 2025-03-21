import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Phone, Mail, Clock, CheckCircle, Loader2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const ContactInfo = () => (
  <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-elevated">
    <h3 className="text-xl font-semibold mb-6 text-sunnyellow">Contact Information</h3>
    
    <div className="space-y-6">
      <div className="flex items-start">
        <div className="bg-background p-3 rounded-full mr-4">
          <MapPin className="h-5 w-5 text-sunnyellow" />
        </div>
        <div>
          <h4 className="font-medium text-sunnyellow">Main Office</h4>
          <p className="text-white mt-1">
            501 Warren Street<br />
            Boston, MA 02121
          </p>
        </div>
      </div>
      
      <div className="flex items-start">
        <div className="bg-background p-3 rounded-full mr-4">
          <Phone className="h-5 w-5 text-sunnyellow" />
        </div>
        <div>
          <h4 className="font-medium text-sunnyellow">Phone</h4>
          <p className="text-white mt-1">
            <a href="tel:+1853817035" className="text-white hover:text-sunnyellow transition-standard">
              (857) 381-7035
            </a>
          </p>
        </div>
      </div>
      
      <div className="flex items-start">
        <div className="bg-background p-3 rounded-full mr-4">
          <Mail className="h-5 w-5 text-sunnyellow" />
        </div>
        <div>
          <h4 className="font-medium text-sunnyellow">Email</h4>
          <p className="text-white mt-1">
            <a href="mailto:info@mybackyarddwelling.com" className="text-white hover:text-sunnyellow transition-standard">
              info@mybackyarddwelling.com
            </a>
          </p>
        </div>
      </div>
      
      <div className="flex items-start">
        <div className="bg-background p-3 rounded-full mr-4">
          <Clock className="h-5 w-5 text-sunnyellow" />
        </div>
        <div>
          <h4 className="font-medium text-sunnyellow">Business Hours</h4>
          <p className="text-white mt-1">
            Monday - Friday: 9:00 AM - 6:00 PM<br />
            Saturday: 10:00 AM - 4:00 PM<br />
            Sunday: Closed
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Form submitted:", formData);
      setIsSuccess(true);
      setFormData(initialFormData);
      
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon.",
        variant: "default",
      });
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      
      toast({
        title: "Something went wrong",
        description: "Please try again later or contact us directly by phone.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-20">
        <div className="container px-4 md:px-6">
          <div id="get-in-touch" className="max-w-3xl mx-auto text-center mb-12 bg-gray-800 p-8 rounded-xl shadow-elevated">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-sunnyellow">Get in Touch</h1>
            <p className="text-lg text-white">
              Have questions about ADUs or want to start your project? Contact our team for personalized assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 mb-20">
            <div className="md:col-span-2">
              <ContactInfo />
            </div>
            
            <div className="md:col-span-3">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-elevated border border-gray-100">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">Send Us a Message</h3>
                
                {isSuccess ? (
                  <div className="bg-brand-50 border border-brand-100 rounded-lg p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-brand-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Message Sent Successfully!</h4>
                    <p className="text-gray-600 mb-4">
                      We've received your message and will get back to you shortly.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSuccess(false)}
                      className="mt-2"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Your email address"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us how we can help you"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        required
                        className="resize-none"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
          
          {/* Call to action section */}
          <div className="text-center mb-12 bg-gray-800 p-8 rounded-xl shadow-elevated">
            <h2 className="text-2xl font-bold mb-4 text-sunnyellow">Ready to Start Your ADU Project?</h2>
            <p className="text-white mb-6 max-w-2xl mx-auto">
              Skip the form and jump straight into exploring what ADU options are available for your property.
            </p>
            <Link 
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-sunnyellow text-gray-900 font-medium transition-standard hover:bg-amber-400 hover:shadow-md"
            >
              Start Your Property Analysis
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
