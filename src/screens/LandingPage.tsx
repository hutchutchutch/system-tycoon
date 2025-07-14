import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/career');
    } else {
      navigate('/auth/signup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-white">System Design Tycoon</div>
          <div className="space-x-4">
            {!isAuthenticated && (
              <>
                <button
                  onClick={() => navigate('/auth/signin')}
                  className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/auth/signup')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
            {isAuthenticated && (
              <button
                onClick={() => navigate('/career')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue Playing
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Build the Digital World
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-delay">
            Where every line of code flows like a theme park ride
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-fade-in-delay-2">
            Master system design through engaging visual gameplay. Design architectures 
            for real companies, watch data flow through your systems, and learn from 
            industry experts.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all animate-fade-in-delay-3"
          >
            Start Your Journey
          </button>
        </div>

        {/* Animated System Visualization */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full opacity-10 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500 rounded-full opacity-10 animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500 rounded-full opacity-10 animate-float"></div>
        </div>
      </div>

      {/* Value Proposition Cards */}
      <div className="bg-gray-900 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Learn System Design the Fun Way
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors"
              >
                <div className="text-4xl mb-4">{prop.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{prop.title}</h3>
                <p className="text-gray-400">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-gray-800 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-400">10K+</div>
              <div className="text-gray-400">Active Players</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400">50K+</div>
              <div className="text-gray-400">Systems Designed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400">4.8/5</div>
              <div className="text-gray-400">Player Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const valueProps = [
  {
    icon: '🎮',
    title: 'Visual Learning',
    description: 'Watch data packets flow through your architecture like theme park visitors',
  },
  {
    icon: '💼',
    title: 'Real Scenarios',
    description: 'Design systems for Netflix, Uber, and other real companies',
  },
  {
    icon: '👥',
    title: 'Expert Mentors',
    description: 'Get guidance from virtual industry experts with different specializations',
  },
  {
    icon: '📈',
    title: 'Career Growth',
    description: 'Progress from consultant to industry expert through referrals',
  },
];

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  
  .animate-fade-in {
    animation: fadeIn 1s ease-out;
  }
  
  .animate-fade-in-delay {
    animation: fadeIn 1s ease-out 0.3s both;
  }
  
  .animate-fade-in-delay-2 {
    animation: fadeIn 1s ease-out 0.6s both;
  }
  
  .animate-fade-in-delay-3 {
    animation: fadeIn 1s ease-out 0.9s both;
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-float-delayed {
    animation: float 6s ease-in-out 3s infinite;
  }
`;
document.head.appendChild(style);