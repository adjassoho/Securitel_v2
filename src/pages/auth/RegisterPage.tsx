import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import type { RegisterRequest } from '@/types';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, error, clearError, isLoading } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterRequest & { confirm_password: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterRequest & { confirm_password: string }) => {
    try {
      const { confirm_password, ...registerData } = data;
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Déjà inscrit?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Se connecter
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="label">
                  Prénom *
                </label>
                <input
                  {...register('first_name', { required: 'Le prénom est obligatoire' })}
                  type="text"
                  className="input"
                  onFocus={clearError}
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="last_name" className="label">
                  Nom *
                </label>
                <input
                  {...register('last_name', { required: 'Le nom est obligatoire' })}
                  type="text"
                  className="input"
                  onFocus={clearError}
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email *
              </label>
              <input
                {...register('email', {
                  required: 'L\'email est obligatoire',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email invalide',
                  },
                })}
                type="email"
                className="input"
                onFocus={clearError}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Numéro de téléphone *
              </label>
              <input
                {...register('phone', {
                  required: 'Le numéro de téléphone est obligatoire',
                  pattern: {
                    value: /^[+]?[0-9]{8,}$/,
                    message: 'Numéro de téléphone invalide',
                  },
                })}
                type="tel"
                className="input"
                placeholder="+229 XX XX XX XX"
                onFocus={clearError}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="label">
                Adresse complète
              </label>
              <textarea
                {...register('address')}
                className="input"
                rows={2}
                onFocus={clearError}
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="label">
                WhatsApp (optionnel)
              </label>
              <input
                {...register('whatsapp')}
                type="tel"
                className="input"
                placeholder="+229 XX XX XX XX"
                onFocus={clearError}
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Mot de passe *
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
                  className="input pr-10"
                  onFocus={clearError}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirm_password" className="label">
                Confirmer le mot de passe *
              </label>
              <input
                {...register('confirm_password', {
                  required: 'Veuillez confirmer votre mot de passe',
                  validate: value =>
                    value === password || 'Les mots de passe ne correspondent pas',
                })}
                type={showPassword ? 'text' : 'password'}
                className="input"
              />
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            En vous inscrivant, vous acceptez nos{' '}
            <a href="/cgu" className="text-primary-600 hover:text-primary-500">
              conditions générales d'utilisation
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
