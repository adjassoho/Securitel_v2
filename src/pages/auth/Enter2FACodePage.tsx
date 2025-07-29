import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/services/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { Shield, Mail, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Enter2FACodePage = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const { validate2FA } = useAuthStore();
  
  const email = sessionStorage.getItem('pending_auth_email');

  useEffect(() => {
    if (!email) {
      navigate('/login');
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
      await validate2FA(email, code.replace(/-/g, ''));
      sessionStorage.removeItem('pending_auth_email');
      toast.success('Connexion réussie!');
      navigate('/dashboard');
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
    // Format as XXX-XXX
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})$/);
    if (match) {
      return match[2] ? `${match[1]}-${match[2]}` : match[1];
    }
    return value;
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCode(e.target.value);
    if (formatted.replace(/-/g, '').length <= 6) {
      setCode(formatted);
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
          <h2 className="text-3xl font-extrabold text-gray-900">
            Vérification de sécurité
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
                {isLoading ? 'Vérification...' : 'Vérifier et se connecter'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/login"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                ← Retour à la connexion
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enter2FACodePage;

