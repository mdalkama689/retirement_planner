import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm text-gray-400">
            © {currentYear} Indian Retirement Planner. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            This calculator is for informational purposes only. Consult with a financial advisor for personal advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;