import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface IAValidationIndicatorProps {
  isAnalyzing: boolean;
  validationResult?: {
    isValid: boolean;
    errors: string[];
  };
  onRetry?: () => void;
}

const IAValidationIndicator = ({ 
  isAnalyzing, 
  validationResult,
  onRetry
}: IAValidationIndicatorProps) => {
  if (isAnalyzing) {
    return (
      <div className="flex items-center mt-2 text-amber-300">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        <span className="text-xs">Vérification IA en cours...</span>
      </div>
    );
  }

  if (validationResult) {
    return (
      <div className={`flex items-center mt-2 ${validationResult.isValid ? 'text-emerald-300' : 'text-red-300'}`}>
        {validationResult.isValid ? (
          <Check className="w-4 h-4 mr-2" />
        ) : (
          <AlertCircle className="w-4 h-4 mr-2" />
        )}
        <span className="text-xs">
          {validationResult.isValid ? 'Vérification réussie' : 'Vérification échouée'}
        </span>
        {!validationResult.isValid && onRetry && (
          <button 
            type="button"
            onClick={onRetry}
            className="ml-2 text-xs text-blue-300 hover:text-blue-200 underline"
          >
            Réessayer
          </button>
        )}
      </div>
    );
  }

  return null;
};

export default IAValidationIndicator;