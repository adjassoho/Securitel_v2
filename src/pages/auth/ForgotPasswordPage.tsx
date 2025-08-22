import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '@/services/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { useScrollToTopOnMount } from '@/hooks/useScrollToTopOnMount';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Scroll vers le haut lors du chargement de la page
  useScrollToTopOnMount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Email envoyé avec succès!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Email envoyé!
            </h2>
            <p className="mt-2 text-gray-600">
              Nous avons envoyé un code de réinitialisation à {email}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
            </p>
            <Link to="/login" className="mt-6 inline-flex items-center text-primary-600 hover:text-primary-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Mot de passe oublié
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entrez votre adresse email et nous vous enverrons un code pour réinitialiser votre mot de passe.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="label">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer le code'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
