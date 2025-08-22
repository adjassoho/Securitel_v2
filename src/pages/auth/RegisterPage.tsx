import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield, UserPlus, Mail, Phone, MapPin, Lock, Sparkles, CheckCircle, ArrowRight, Users, Zap, Star } from 'lucide-react';
import type { RegisterRequest } from '@/types';
import { useScrollToTopOnMount } from '@/hooks/useScrollToTopOnMount';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, error, clearError, isLoading } = useAuthStore();
  
  // Scroll vers le haut lors du chargement de la page
  useScrollToTopOnMount();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterRequest & { confirm_password: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterRequest & { confirm_password: string }) => {
    try {
      // Rename confirm_password to password_confirmation for API
      const { confirm_password, ...rest } = data;
      const registerData = {
        ...rest,
        password_confirmation: confirm_password
      };
      await registerUser(registerData);
      // Store email for verification
      sessionStorage.setItem('pending_verification_email', registerData.email);
      // Redirect to verification page
      navigate('/verify-email');
    } catch {
      // Errors handled by store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      
      <div className="relative min-h-screen flex">
        {/* Left side - Hero content */}
        <div className="hidden lg:flex lg:w-2/5 items-center justify-center p-12">
          <div className="max-w-lg text-center text-white">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-full p-6 border border-white/20">
                <UserPlus className="h-16 w-16 text-white mx-auto" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              Rejoignez SecuriTel
            </h1>
            
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              Plus de 10,000 Béninois nous font déjà confiance pour protéger leurs téléphones
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center text-emerald-200">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20">
                  <Shield className="h-6 w-6 text-emerald-300" />
                </div>
                <div className="ml-4 text-left">
                  <div className="font-semibold">Protection garantie</div>
                  <div className="text-sm text-emerald-300">Sécurisation IMEI instantanée</div>
                </div>
              </div>
              
              <div className="flex items-center text-emerald-200">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20">
                  <Users className="h-6 w-6 text-emerald-300" />
                </div>
                <div className="ml-4 text-left">
                  <div className="font-semibold">Communauté active</div>
                  <div className="text-sm text-emerald-300">Réseau national de protection</div>
                </div>
              </div>
              
              <div className="flex items-center text-emerald-200">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20">
                  <Zap className="h-6 w-6 text-emerald-300" />
                </div>
                <div className="ml-4 text-left">
                  <div className="font-semibold">Traitement rapide</div>
                  <div className="text-sm text-emerald-300">Vérification en moins de 2 minutes</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10">
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm text-emerald-200">
                "Interface exceptionnelle et protection efficace. Je recommande vivement !" 
                <span className="block text-emerald-300 mt-1">- Marie K., Cliente depuis 2023</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Right side - Registration form */}
        <div className="w-full lg:w-3/5 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-2xl">
            {/* Glass morphism card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl">
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
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  Créez votre compte ✨
                </h2>
                <p className="text-emerald-100 lg:text-lg">
                  Rejoignez la révolution de la sécurité mobile au Bénin
                </p>
                <div className="mt-4">
                  <span className="text-sm text-emerald-200">Déjà inscrit ? </span>
                  <Link 
                    to="/login" 
                    className="text-emerald-300 hover:text-emerald-200 font-medium transition-colors duration-300 underline decoration-emerald-400 underline-offset-4"
                  >
                    Se connecter
                  </Link>
                </div>
              </div>
        
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Nom et Prénom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/90 flex items-center">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Prénom
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register('first_name', { required: 'Le prénom est obligatoire' })}
                        type="text"
                        onFocus={clearError}
                        className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                        placeholder="Votre prénom"
                      />
                      <div className="absolute inset-y-0 right-4 flex items-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 transition-opacity duration-300" 
                             style={{opacity: watch('first_name') ? 1 : 0}}></div>
                      </div>
                    </div>
                    {errors.first_name && (
                      <p className="text-sm text-red-300 flex items-center">
                        <span className="w-1 h-1 bg-red-300 rounded-full mr-2"></span>
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/90 flex items-center">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Nom de famille
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register('last_name', { required: 'Le nom est obligatoire' })}
                        type="text"
                        onFocus={clearError}
                        className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                        placeholder="Votre nom"
                      />
                      <div className="absolute inset-y-0 right-4 flex items-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 transition-opacity duration-300" 
                             style={{opacity: watch('last_name') ? 1 : 0}}></div>
                      </div>
                    </div>
                    {errors.last_name && (
                      <p className="text-sm text-red-300 flex items-center">
                        <span className="w-1 h-1 bg-red-300 rounded-full mr-2"></span>
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/90 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Adresse email
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register('email', {
                        required: 'L\'email est obligatoire',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email invalide',
                        },
                      })}
                      type="email"
                      onFocus={clearError}
                      className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                      placeholder="votre@email.com"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 transition-opacity duration-300" 
                           style={{opacity: watch('email')?.includes('@') ? 1 : 0}}></div>
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-300 flex items-center">
                      <span className="w-1 h-1 bg-red-300 rounded-full mr-2"></span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Téléphone et WhatsApp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/90 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Téléphone
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register('phone', {
                          required: 'Le numéro de téléphone est obligatoire',
                          pattern: {
                            value: /^[+]?[0-9]{8,}$/,
                            message: 'Numéro de téléphone invalide',
                          },
                        })}
                        type="tel"
                        onFocus={clearError}
                        className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                        placeholder="+229 XX XX XX XX"
                      />
                      <div className="absolute inset-y-0 right-4 flex items-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 transition-opacity duration-300" 
                             style={{opacity: watch('phone')?.length >= 8 ? 1 : 0}}></div>
                      </div>
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-300 flex items-center">
                        <span className="w-1 h-1 bg-red-300 rounded-full mr-2"></span>
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/90 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      WhatsApp
                      <span className="text-emerald-300 ml-1 text-xs">(optionnel)</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register('whatsapp')}
                        type="tel"
                        onFocus={clearError}
                        className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                        placeholder="+229 XX XX XX XX"
                      />
                      <div className="absolute inset-y-0 right-4 flex items-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 transition-opacity duration-300" 
                             style={{opacity: watch('whatsapp') ? 1 : 0}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adresse */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/90 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Adresse complète
                    <span className="text-emerald-300 ml-1 text-xs">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <textarea
                      {...register('address')}
                      onFocus={clearError}
                      rows={3}
                      className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15 resize-none"
                      placeholder="Votre adresse complète (quartier, ville, pays...)"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 transition-opacity duration-300" 
                           style={{opacity: watch('address') ? 1 : 0}}></div>
                    </div>
                  </div>
                </div>

                {/* Mots de passe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/90 flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Mot de passe
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register('password', {
                          required: 'Le mot de passe est obligatoire',
                          minLength: {
                            value: 8,
                            message: 'Le mot de passe doit contenir au moins 8 caractères',
                          },
                        })}
                        type={showPassword ? 'text' : 'password'}
                        onFocus={clearError}
                        className="w-full px-4 py-4 pr-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                        placeholder="••••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-4 flex items-center text-white/60 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-300 flex items-center">
                        <span className="w-1 h-1 bg-red-300 rounded-full mr-2"></span>
                        {errors.password.message}
                      </p>
                    )}
                    {password && password.length > 0 && (
                      <div className="text-xs space-y-1">
                        <div className={`flex items-center ${password.length >= 8 ? 'text-emerald-300' : 'text-white/60'}`}>
                          <CheckCircle className={`h-3 w-3 mr-1 ${password.length >= 8 ? 'text-emerald-400' : 'text-white/40'}`} />
                          Au moins 8 caractères
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/90 flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Confirmer le mot de passe
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register('confirm_password', {
                          required: 'Veuillez confirmer votre mot de passe',
                          validate: value =>
                            value === password || 'Les mots de passe ne correspondent pas',
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                        placeholder="••••••••••"
                      />
                      <div className="absolute inset-y-0 right-4 flex items-center">
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          watch('confirm_password') === password && password ? 'bg-emerald-400 opacity-100' : 'bg-white/20 opacity-0'
                        }`}></div>
                      </div>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-sm text-red-300 flex items-center">
                        <span className="w-1 h-1 bg-red-300 rounded-full mr-2"></span>
                        {errors.confirm_password.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message d'erreur global */}
                {error && (
                  <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-2xl p-4 text-red-200 text-sm flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-red-500/30 rounded-full flex items-center justify-center mt-0.5">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    </div>
                    <div>{error}</div>
                  </div>
                )}

                {/* Bouton d'inscription */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Création en cours...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span>Créer mon compte</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                {/* Conditions générales */}
                <div className="pt-6 border-t border-white/20">
                  <p className="text-center text-sm text-white/70 leading-relaxed">
                    En créant votre compte, vous acceptez nos{' '}
                    <a 
                      href="/cgu" 
                      className="text-emerald-300 hover:text-emerald-200 underline decoration-emerald-400 underline-offset-4 transition-colors"
                    >
                      conditions générales d'utilisation
                    </a>
                    {' '}et notre{' '}
                    <a 
                      href="/privacy" 
                      className="text-emerald-300 hover:text-emerald-200 underline decoration-emerald-400 underline-offset-4 transition-colors"
                    >
                      politique de confidentialité
                    </a>
                  </p>
                </div>
              </form>
            </div>
            
            {/* Bottom text */}
            <div className="text-center mt-6 space-y-3">
              <p className="text-white/60 text-xs">
                Protégé par un cryptage AES-256 de niveau militaire 🔒
              </p>
              <div className="flex items-center justify-center space-x-4 text-white/50 text-xs">
                <span className="flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Sécurisé
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Conforme RGPD
                </span>
                <span className="flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Innovation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
