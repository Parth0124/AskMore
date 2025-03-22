import { Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-base font-medium text-gray-900">AskMore</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your AI-powered chatbot assistant for instant answers.
            </p>
            <div className="mt-4 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-indigo-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h3 className="text-base font-medium text-gray-900">Resources</h3>
            <ul className="mt-4 space-y-4">
              {['Documentation', 'API Reference', 'Pricing', 'Blog'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Help Links */}
          <div>
            <h3 className="text-base font-medium text-gray-900">Support</h3>
            <ul className="mt-4 space-y-4">
              {['Help Center', 'Contact Us', 'Terms of Service', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} AskMore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};