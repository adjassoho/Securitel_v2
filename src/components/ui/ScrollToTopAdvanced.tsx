import { ArrowUp, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';

interface ScrollToTopAdvancedProps {
  className?: string;
  threshold?: number;
  variant?: 'default' | 'minimal' | 'floating' | 'progress';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  size?: 'sm' | 'md' | 'lg';
}

const ScrollToTopAdvanced = ({ 
  className,
  threshold = 300,
  variant = 'default',
  position = 'bottom-right',
  size = 'md'
}: ScrollToTopAdvancedProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

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

  // Positions
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2',
  };

  // Tailles
  const sizeClasses = {
    sm: 'p-2 w-10 h-10',
    md: 'p-3 w-12 h-12',
    lg: 'p-4 w-14 h-14',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  // Variantes
  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'bg-white/90 text-gray-700 border border-gray-200 hover:bg-white hover:shadow-lg';
      case 'floating':
        return 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-2xl hover:shadow-3xl hover:from-primary-600 hover:to-secondary-600';
      case 'progress':
        return 'bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50';
      default:
        return 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl';
    }
  };

  const circumference = 2 * Math.PI * 16; // rayon de 16 pour le cercle de progression
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'fixed z-50 rounded-full transition-all duration-300 transform group',
        'focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-offset-2',
        'active:scale-95',
        positionClasses[position],
        sizeClasses[size],
        getVariantClasses(),
        isVisible 
          ? 'translate-y-0 opacity-100 pointer-events-auto scale-100' 
          : 'translate-y-16 opacity-0 pointer-events-none scale-75',
        className
      )}
      aria-label="Retour en haut de la page"
      title={`Retour en haut${variant === 'progress' ? ` (${Math.round(scrollProgress)}% lu)` : ''}`}
    >
      {/* Icône principale */}
      <div className="relative z-10 flex items-center justify-center">
        {variant === 'minimal' ? (
          <ChevronUp className={cn(iconSizes[size], 'transition-transform group-hover:scale-110')} />
        ) : (
          <ArrowUp className={cn(iconSizes[size], 'transition-transform group-hover:scale-110')} />
        )}
      </div>

      {/* Cercle de progression pour la variante progress */}
      {variant === 'progress' && (
        <svg
          className="absolute inset-0 w-full h-full transform -rotate-90"
          viewBox="0 0 40 40"
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.2"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-out"
          />
        </svg>
      )}

      {/* Effet de pulse pour la variante floating */}
      {variant === 'floating' && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-ping"></div>
      )}

      {/* Effet de lueur */}
      {variant === 'default' && (
        <div className="absolute inset-0 rounded-full bg-primary-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
      )}

      {/* Tooltip avec informations */}
      {isHovered && variant === 'progress' && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 animate-fadeIn">
          {Math.round(scrollProgress)}% de la page lue
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Animation de rebond subtile */}
      {variant === 'floating' && (
        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse"></div>
      )}
    </button>
  );
};

export default ScrollToTopAdvanced;