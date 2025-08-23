import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Shield, Bell, Mail, MessageSquare, Eye, EyeOff, Key, CheckCircle, AlertCircle, Settings, Smartphone } from 'lucide-react';
import { userService } from '@/services/api';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const passwordChangeSchema = z.object({
  old_password: z.string().min(1, 'Mot de passe actuel requis'),
  new_password: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
  confirm_password: z.string().min(1, 'Confirmation requise'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"],
});

type PasswordChangeData = z.infer<typeof passwordChangeSchema>;

const SettingsPage = () => {
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showSuccess, setShowSuccess] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordChangeData>({
    resolver: zodResolver(passwordChangeSchema)
  });

  // Changement de mot de passe
  const changePasswordMutation = useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => {
      setShowSuccess('password');
      setTimeout(() => setShowSuccess(''), 3000);
      toast.success('Mot de passe changé avec succès !');
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    },
  });

  // Gestion des notifications
  const updateNotificationsMutation = useMutation({
    mutationFn: userService.updateNotifications,
    onSuccess: () => {
      setShowSuccess('notifications');
      setTimeout(() => setShowSuccess(''), 3000);
      toast.success('Préférences de notification mises à jour !');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour des notifications');
    },
  });

  // Gestion 2FA
  const enable2FAMutation = useMutation({
    mutationFn: userService.enable2FA,
    onSuccess: () => {
      setTwoFactorEnabled(true);
      setShowSuccess('2fa');
      setTimeout(() => setShowSuccess(''), 3000);
      toast.success('Authentification à double facteur activée !');
    },
    onError: () => {
      toast.error('Erreur lors de l\'activation de la 2FA');
    },
  });

  const disable2FAMutation = useMutation({
    mutationFn: userService.disable2FA,
    onSuccess: () => {
      setTwoFactorEnabled(false);
      setShowSuccess('2fa');
      setTimeout(() => setShowSuccess(''), 3000);
      toast.success('Authentification à double facteur désactivée !');
    },
    onError: () => {
      toast.error('Erreur lors de la désactivation de la 2FA');
    },
  });

  const onPasswordSubmit = (data: PasswordChangeData) => {
    changePasswordMutation.mutate(data);
  };

  const handleNotificationChange = (type: 'email' | 'sms', value: boolean) => {
    const newNotifications = { ...notifications, [type]: value };
    setNotifications(newNotifications);
    updateNotificationsMutation.mutate(newNotifications);
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      
      <div className="relative min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-full p-6 border border-white/20 mx-auto w-20 h-20 flex items-center justify-center">
                <Settings className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              Paramètres
            </h1>
            <p className="text-lg lg:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Gérez votre sécurité et vos préférences de compte
            </p>
          </div>

          {/* Section Sécurité */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl mb-8">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-3 mr-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Sécurité</h2>
                <p className="text-emerald-100">Protégez votre compte avec nos options de sécurité</p>
              </div>
            </div>

            {/* Changement de mot de passe */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-emerald-300" />
                Changer le mot de passe
              </h3>
              
              {showSuccess === 'password' && (
                <div className="mb-6 p-4 bg-green-500/20 backdrop-blur-lg border border-green-500/30 rounded-2xl">
                  <div className="flex items-center text-green-100">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    <span className="font-medium">Mot de passe changé avec succès !</span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Ancien mot de passe */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/90 flex items-center">
                      <Key className="w-4 h-4 mr-2 text-emerald-300" />
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.old ? 'text' : 'password'}
                        {...register('old_password')}
                        className={`
                          w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15
                          ${errors.old_password ? 'border-red-400 ring-4 ring-red-400/20' : ''}
                        `}
                        placeholder="Mot de passe actuel"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('old')}
                        className="absolute inset-y-0 right-3 flex items-center text-white/60 hover:text-white transition-colors"
                      >
                        {showPasswords.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.old_password && (
                      <p className="text-sm text-red-300 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.old_password.message}
                      </p>
                    )}
                  </div>
                  
                  {/* Nouveau mot de passe */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/90 flex items-center">
                      <Key className="w-4 h-4 mr-2 text-emerald-300" />
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        {...register('new_password')}
                        className={`
                          w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15
                          ${errors.new_password ? 'border-red-400 ring-4 ring-red-400/20' : ''}
                        `}
                        placeholder="Nouveau mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute inset-y-0 right-3 flex items-center text-white/60 hover:text-white transition-colors"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.new_password && (
                      <p className="text-sm text-red-300 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.new_password.message}
                      </p>
                    )}
                  </div>
                  
                  {/* Confirmation */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/90 flex items-center">
                      <Key className="w-4 h-4 mr-2 text-emerald-300" />
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        {...register('confirm_password')}
                        className={`
                          w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15
                          ${errors.confirm_password ? 'border-red-400 ring-4 ring-red-400/20' : ''}
                        `}
                        placeholder="Confirmer le mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute inset-y-0 right-3 flex items-center text-white/60 hover:text-white transition-colors"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-sm text-red-300 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.confirm_password.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  {changePasswordMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Changement...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Changer le mot de passe</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Authentification à double facteur */}
            <div className="border-t border-white/10 pt-8">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-emerald-300" />
                Authentification à double facteur (2FA)
              </h3>
              
              {showSuccess === '2fa' && (
                <div className="mb-6 p-4 bg-green-500/20 backdrop-blur-lg border border-green-500/30 rounded-2xl">
                  <div className="flex items-center text-green-100">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    <span className="font-medium">Paramètres 2FA mis à jour avec succès !</span>
                  </div>
                </div>
              )}
              
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">Protection renforcée</h4>
                    <p className="text-emerald-100 text-sm">
                      {twoFactorEnabled 
                        ? 'La 2FA est activée. Votre compte est protégé par un code de vérification.'
                        : 'Activez la 2FA pour une sécurité renforcée de votre compte.'
                      }
                    </p>
                  </div>
                  
                  <div className="ml-6">
                    <button
                      onClick={() => twoFactorEnabled ? disable2FAMutation.mutate() : enable2FAMutation.mutate()}
                      disabled={enable2FAMutation.isPending || disable2FAMutation.isPending}
                      className={`
                        px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl
                        ${
                          twoFactorEnabled
                            ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-400/50'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white focus:ring-emerald-400/50'
                        }
                      `}
                    >
                      {enable2FAMutation.isPending || disable2FAMutation.isPending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        twoFactorEnabled ? 'Désactiver 2FA' : 'Activer 2FA'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Notifications */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-3 mr-4">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Notifications</h2>
                <p className="text-emerald-100">Gérez vos préférences de notification</p>
              </div>
            </div>
            
            {showSuccess === 'notifications' && (
              <div className="mb-8 p-4 bg-green-500/20 backdrop-blur-lg border border-green-500/30 rounded-2xl">
                <div className="flex items-center text-green-100">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span className="font-medium">Préférences de notification mises à jour !</span>
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              {/* Notifications par email */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-3">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Notifications par email</h4>
                      <p className="text-emerald-100 text-sm">Recevez des alertes importantes par email</p>
                    </div>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => handleNotificationChange('email', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-400/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-600 peer-checked:to-teal-600"></div>
                  </label>
                </div>
              </div>
              
              {/* Notifications par SMS */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Notifications par SMS</h4>
                      <p className="text-emerald-100 text-sm">Recevez des alertes urgentes par SMS</p>
                    </div>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.sms}
                      onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-400/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-600 peer-checked:to-teal-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
