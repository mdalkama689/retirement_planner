import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import RetirementCalculator from './components/RetirementCalculator';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#1f2937',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1f2937',
            },
          },
        }}
      />
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Plan Your <span className="text-primary-400">Financial Freedom</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Calculate how much you need to save for a comfortable retirement in India.
              Adjust your plan based on your age, income, and investment strategy.
            </p>
          </div>
          
          <RetirementCalculator />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;