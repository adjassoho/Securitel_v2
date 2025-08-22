import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useScrollToTopOnMount } from '@/hooks/useScrollToTopOnMount';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthStore();
  
  // Scroll vers le haut lors du chargement de la page
  useScrollToTopOnMount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Store email for 2FA verification
      sessionStorage.setItem('pending_auth_email', email);
      // Redirect to 2FA page
      navigate('/verify-2fa');
    } catch {
      // Errors are handled by Zustand store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background pattern */}
      <div className="absolute inset-0 hero-pattern opacity-30" />
      
      <div className="relative max-w-md w-full space-y-8 animate-fadeIn">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-primary-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">SecuriTel</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Bon retour !
          </h2>
          <p className="mt-2 text-gray-600">
            Connectez-vous pour accéder à votre espace sécurisé
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Adresse Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input"
                placeholder="Adresse Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={clearError}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={clearError}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                Mot de passe oublié?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Connexion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

