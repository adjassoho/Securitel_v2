import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { useScrollToTopOnMount } from '@/hooks/useScrollToTopOnMount';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthStore();
  
  // Scroll vers le haut lors du chargement de la page
  useScrollToTopOnMount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      // Store email for 2FA verification
      sessionStorage.setItem('pending_auth_email', email);
      // Redirect to 2FA page
      navigate('/verify-2fa');
    } catch {
      // Errors are handled by Zustand store
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      
      <div className="relative min-h-screen flex">
        {/* Left side - Hero content */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-lg text-center text-white">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-full p-6 border border-white/20">
                <img src="/images/logo.png" alt="SecuriTel Logo" className="h-16 w-16 mx-auto" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              SecuriTel
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              La première plateforme de sécurisation des téléphones portables au Bénin
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center text-green-300">
                <CheckCircle className="h-5 w-5 mr-3" />
                <span>Protection contre le vol et la perte</span>
              </div>
              <div className="flex items-center text-green-300">
                <CheckCircle className="h-5 w-5 mr-3" />
                <span>Vérification IMEI instantanée</span>
              </div>
              <div className="flex items-center text-green-300">
                <CheckCircle className="h-5 w-5 mr-3" />
                <span>Transfert de propriété sécurisé</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Glass morphism card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              {/* Logo for mobile */}
              <div className="lg:hidden text-center mb-8">
                <Link to="/" className="inline-flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-3 border border-white/30">
                    <img src="/images/logo.png" alt="SecuriTel Logo" className="h-8 w-8" />
                  </div>
                  <span className="ml-3 text-2xl font-bold text-white">SecuriTel</span>
                </Link>
              </div>
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Bon retour ! 👋
                </h2>
                <p className="text-blue-100">
                  Connectez-vous pour accéder à votre espace sécurisé
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/90 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Adresse email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={clearError}
                      className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                      placeholder="votre@email.com"
                      required
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 transition-opacity duration-300" 
                           style={{opacity: email.includes('@') ? 1 : 0}}></div>
                    </div>
                  </div>
                </div>
                
                {/* Password field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/90 flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={clearError}
                      className="w-full px-4 py-4 pr-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                      placeholder="••••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-4 flex items-center text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                {/* Error message */}
                {error && (
                  <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-2xl p-4 text-red-200 text-sm">
                    {error}
                  </div>
                )}
                
                {/* Forgot password */}
                <div className="text-right">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-blue-300 hover:text-blue-200 transition-colors duration-300"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                
                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Connexion...</span>
                    </>
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
                
                {/* Register link */}
                <div className="text-center pt-4 border-t border-white/20">
                  <p className="text-white/80 text-sm">
                    Pas encore de compte ?
                  </p>
                  <Link 
                    to="/register" 
                    className="inline-flex items-center mt-2 text-blue-300 hover:text-blue-200 font-medium transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Créer un compte gratuitement
                  </Link>
                </div>
              </form>
            </div>
            
            {/* Bottom text */}
            <p className="text-center text-white/60 text-xs mt-6">
              Protégé par un cryptage de niveau militaire 🔒
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

