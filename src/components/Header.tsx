import React from 'react';
import { PiggyBank } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 py-4 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PiggyBank className="h-8 w-8 text-primary-500" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                <span className="text-primary-400">Indian</span> Retirement Planner
              </h1>
              <p className="text-xs md:text-sm text-gray-400">Plan your financial freedom</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;