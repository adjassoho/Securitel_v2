import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';

interface ScrollToTopWithProgressProps {
  className?: string;
  threshold?: number;
  showProgress?: boolean;
}

const ScrollToTopWithProgress = ({ 
  className, 
  threshold = 300, 
  showProgress = true 
}: ScrollToTopWithProgressProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setScrollProgress(scrollPercent);
      setIsVisible(scrollTop > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const circumference = 2 * Math.PI * 20; // rayon de 20
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className={cn(
      'fixed bottom-6 right-6 z-50 transition-all duration-300 transform',
      isVisible 
        ? 'translate-y-0 opacity-100 pointer-events-auto' 
        : 'translate-y-16 opacity-0 pointer-events-none',
      className
    )}>
      <button
        onClick={scrollToTop}
        className={cn(
          'relative p-3 rounded-full shadow-lg transition-all duration-300 transform group',
          'bg-gradient-to-r from-primary-600 to-primary-700 text-white',
          'hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:scale-110',
          'focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-offset-2',
          'active:scale-95'
        )}
        aria-label="Retour en haut de la page"
        title={`Retour en haut (${Math.round(scrollProgress)}% lu)`}
      >
        {/* Icône */}
        <ArrowUp className="h-5 w-5 relative z-10 transition-transform group-hover:scale-110" />
        
        {/* Cercle de progression */}
        {showProgress && (
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90"
            viewBox="0 0 50 50"
          >
            {/* Cercle de fond */}
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="2"
            />
            {/* Cercle de progression */}
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300 ease-out"
            />
          </svg>
        )}
        
        {/* Effet de lueur */}
        <div className="absolute inset-0 rounded-full bg-primary-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"></div>
      </button>
      
      {/* Tooltip avec pourcentage */}
      {showProgress && (
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {Math.round(scrollProgress)}% lu
          <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default ScrollToTopWithProgress;