import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  
  // Function to handle "About Us" click - navigate to home and scroll to top
  const handleAboutUsClick = (e) => {
    e.preventDefault();
    navigate('/');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/", onClick: handleAboutUsClick },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", path: "/blog" },
        { name: "Guides", path: "/guides" },
        { name: "ADU Laws", path: "/adu-laws" },
        { name: "FAQ", path: "/faq" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Cookie Policy", path: "/cookies" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-50 text-gray-700 pt-16 pb-8">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-5" aria-label="MyBackyardDwelling Home">
              <div className="flex items-center">
                <img 
                  src="/house-icon.svg" 
                  alt="MyBackyardDwelling Logo" 
                  className="h-10 mr-3"
                />
                <span className="text-xl font-semibold text-gray-800 font-display">
                  MyBackyard<span className="text-sunnyellow">Dwelling</span>
                </span>
              </div>
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              Transforming properties with AI-powered ADU solutions that maximize value and simplify the development process.
            </p>
          </div>
          
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-medium text-lg mb-4 text-gray-800">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    {link.onClick ? (
                      <a 
                        href={link.path}
                        onClick={link.onClick}
                        className="text-gray-600 hover:text-sunnyellow transition-standard cursor-pointer"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link 
                        to={link.path} 
                        className="text-gray-600 hover:text-sunnyellow transition-standard"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} MyBackyardDwelling. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()} 
              className="text-gray-500 hover:text-sunnyellow text-sm transition-standard"
            >
              Made with ♥ in Massachusetts
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
