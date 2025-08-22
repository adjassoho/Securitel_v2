import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Smartphone, AlertCircle, CheckCircle } from 'lucide-react';

interface IMEIInputProps {
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  register: UseFormRegisterReturn;
  value?: string;
  className?: string;
}

const IMEIInput: React.FC<IMEIInputProps> = ({
  label,
  placeholder = "15 chiffres",
  error,
  required = false,
  register,
  value,
  className = ""
}) => {
  const [inputValue, setInputValue] = React.useState(value || '');
  const [isValid, setIsValid] = React.useState(false);

  // Validation stricte IMEI : uniquement chiffres, exactement 15 caractères
  const validateIMEI = (imei: string) => {
    const cleanIMEI = imei.replace(/\D/g, ''); // Retirer tout ce qui n'est pas un chiffre
    return cleanIMEI.length === 15 && /^[0-9]{15}$/.test(cleanIMEI);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ne garder que les chiffres
    const cleanValue = value.replace(/\D/g, '');
    
    // Limiter à 15 caractères
    if (cleanValue.length <= 15) {
      setInputValue(cleanValue);
      setIsValid(validateIMEI(cleanValue));
      
      // Mettre à jour le register
      e.target.value = cleanValue;
      register.onChange(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Empêcher la saisie de lettres et caractères spéciaux
    if (!/[0-9]/.test(e.key) && 
        !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const cleanData = pasteData.replace(/\D/g, '').slice(0, 15);
    setInputValue(cleanData);
    setIsValid(validateIMEI(cleanData));
    
    // Simuler un événement onChange pour le register
    const input = e.target as HTMLInputElement;
    input.value = cleanData;
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center text-sm font-medium text-gray-700">
        <Smartphone className="w-4 h-4 mr-2 text-blue-600" />
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          {...register}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className={`
            imei-input w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-300 text-lg font-mono tracking-wider
            ${error 
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
              : isValid && inputValue.length === 15
                ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200'
                : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-200'
            }
            focus:ring-4 focus:outline-none placeholder:text-gray-400 placeholder:font-normal
          `}
          placeholder={placeholder}
          maxLength={15}
          autoComplete="off"
          spellCheck={false}
        />
        
        {/* Indicateur de validation */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {inputValue.length > 0 && (
            <>
              {isValid && inputValue.length === 15 ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : error ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
              )}
            </>
          )}
        </div>
        
        {/* Compteur de caractères */}
        <div className="absolute -bottom-6 right-0 text-xs font-medium">
          <span className={`
            ${inputValue.length === 15 
              ? 'text-green-600' 
              : inputValue.length > 0 
                ? 'text-blue-600' 
                : 'text-gray-400'
            }
          `}>
            {inputValue.length}/15
          </span>
        </div>
      </div>
      
      {/* Messages d'aide et d'erreur */}
      <div className="space-y-1">
        {error && (
          <p className="flex items-center text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </p>
        )}
        
        {!error && inputValue.length > 0 && inputValue.length < 15 && (
          <p className="text-sm text-blue-600">
            Entrez exactement 15 chiffres (encore {15 - inputValue.length} caractères)
          </p>
        )}
        
        {!error && inputValue.length === 15 && isValid && (
          <p className="flex items-center text-sm text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            IMEI valide
          </p>
        )}
        
        {inputValue.length === 0 && (
          <p className="text-sm text-gray-500">
            Tapez *#06# sur votre téléphone pour obtenir l'IMEI
          </p>
        )}
      </div>
    </div>
  );
};

export default IMEIInput;