import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/services/api';
import { Shield, Mail, RefreshCw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyRegistrationPage = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  
  const email = sessionStorage.getItem('pending_verification_email');

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }
    
    // Start countdown timer for resend button
    setTimer(60);
  }, [email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    }
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      await authService.verifyEmail(email, code);
      sessionStorage.removeItem('pending_verification_email');
      toast.success('Email vérifié avec succès!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Code incorrect ou expiré');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || timer > 0) return;
    
    setResending(true);
    try {
      await authService.resendVerificationCode(email);
      toast.success('Nouveau code envoyé!');
      setTimer(60);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du code');
    } finally {
      setResending(false);
    }
  };

  const formatCode = (value: string) => {
    // Remove all non-digits first
    const cleaned = value.replace(/\D/g, '');
    
    // If we have 6 digits, format as XXX-XXX
    if (cleaned.length === 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}`;
    }
    
    // If we have less than 6 digits, format as we type
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})$/);
    if (match) {
      return match[2] ? `${match[1]}-${match[2]}` : match[1];
    }
    
    return cleaned;
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCode(e.target.value);
    if (formatted.replace(/-/g, '').length <= 6) {
      setCode(formatted);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const cleaned = pastedData.replace(/\D/g, '');
    
    if (cleaned.length === 6) {
      const formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}`;
      setCode(formatted);
    } else if (cleaned.length <= 6) {
      setCode(cleaned);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 hero-pattern opacity-30" />
      
      <div className="relative max-w-md w-full space-y-8 animate-fadeIn">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-primary-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">SecuriTel</span>
          </Link>
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-primary-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Vérifiez votre email
          </h2>
          <p className="mt-2 text-gray-600">
            Un code de vérification a été envoyé à
          </p>
          <p className="text-primary-600 font-medium">{email}</p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Code de vérification
              </label>
              <div className="mt-1">
                <input
                  id="code"
                  name="code"
                  type="text"
                  autoComplete="one-time-code"
                  required
                  value={code}
                  onChange={handleCodeChange}
                  onPaste={handlePaste}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-center text-lg font-semibold tracking-widest"
                  placeholder="XXX-XXX"
                  maxLength={7}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Entrez le code à 6 chiffres reçu par email
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || code.replace(/-/g, '').length !== 6}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Vérification...' : 'Vérifier mon email'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/register"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                ← Retour à l'inscription
              </Link>
              
              <button
                type="button"
                onClick={handleResendCode}
                disabled={timer > 0 || resending}
                className="text-sm text-primary-600 hover:text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                {timer > 0 ? `Renvoyer (${timer}s)` : 'Renvoyer le code'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Code envoyé par email
                </span>
              </div>
            </div>
            
            <p className="mt-4 text-center text-xs text-gray-500">
              Après vérification, vous pourrez vous connecter avec votre email et mot de passe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyRegistrationPage;

