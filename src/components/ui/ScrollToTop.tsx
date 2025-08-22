import { ArrowUp } from 'lucide-react';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { cn } from '@/utils/cn';

interface ScrollToTopProps {
    className?: string;
    threshold?: number;
}

const ScrollToTop = ({ className, threshold = 300 }: ScrollToTopProps) => {
    const { isVisible, scrollToTop } = useScrollToTop(threshold);

    return (
        <button
            onClick={scrollToTop}
            className={cn(
                'fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 transform',
                'bg-gradient-to-r from-primary-600 to-primary-700 text-white',
                'hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:scale-110',
                'focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-offset-2',
                'active:scale-95',
                isVisible
                    ? 'translate-y-0 opacity-100 pointer-events-auto'
                    : 'translate-y-16 opacity-0 pointer-events-none',
                className
            )}
            aria-label="Retour en haut de la page"
            title="Retour en haut"
        >
            <ArrowUp className="h-5 w-5" />

            {/* Effet de pulse */}
            <div className="absolute inset-0 rounded-full bg-primary-600 animate-ping opacity-20"></div>

            {/* Cercle de progression (optionnel) */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
        </button>
    );
};

export default ScrollToTop;