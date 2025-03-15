
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-secondary/20">
          <div className="text-center max-w-md px-4">
            <div className="text-8xl font-bold text-brand-500 mb-6">404</div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Page Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              We couldn't find the page you're looking for. Let's get you back on track.
            </p>
            <Link 
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-500 text-white font-medium transition-standard hover:bg-brand-600 hover:shadow-md"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
