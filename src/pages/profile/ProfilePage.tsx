import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit3, Save, X, CheckCircle, AlertCircle, Calendar, Shield } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { userService } from '@/services/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const profileUpdateSchema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres'),
  address: z.string().min(5, 'L\'adresse doit contenir au moins 5 caractères'),
  whatsapp: z.string().optional(),
});

type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Récupération du profil
  const { data: profileData, isLoading, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userService.getProfile,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      whatsapp: user?.whatsapp || '',
    }
  });

  // Mise à jour du profil
  const updateProfileMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (data) => {
      updateUser(data.user);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      toast.success('Profil mis à jour avec succès !');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });

  useEffect(() => {
    if (profileData) {
      reset({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address || '',
        whatsapp: profileData.whatsapp || '',
      });
    }
  }, [profileData, reset]);

  const onSubmit = (data: ProfileUpdateData) => {
    updateProfileMutation.mutate(data);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-center">Chargement du profil...</p>
        </div>
      </div>
    );
  }

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
          {/* En-tête avec profil */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white/20">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-lg text-emerald-100 mb-2">{user?.email}</p>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-200">Compte actif</span>
                  </div>
                  <span className="text-white/60">•</span>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-emerald-300" />
                    <span className="text-sm font-medium text-emerald-200 capitalize">{user?.role || 'Utilisateur'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
                <Calendar className="h-8 w-8 text-emerald-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-white/90 text-center">Membre depuis</p>
                <p className="text-xs text-white/70 text-center">{new Date(user?.created_at || '').getFullYear() || '2024'}</p>
              </div>
            </div>
            
            {/* Message de succès */}
            {showSuccess && (
              <div className="mt-6 p-4 bg-green-500/20 backdrop-blur-lg border border-green-500/30 rounded-2xl">
                <div className="flex items-center text-green-100">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span className="font-medium">Profil mis à jour avec succès !</span>
                </div>
              </div>
            )}
          </div>

          {/* Formulaire d'édition du profil */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Informations personnelles</h2>
                <p className="text-emerald-100">Modifiez vos informations de profil</p>
              </div>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Edit3 className="w-5 h-5" />
                  <span>Modifier</span>
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Prénom */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/90 flex items-center">
                    <User className="w-4 h-4 mr-2 text-emerald-300" />
                    Prénom
                  </label>
                  <input
                    type="text"
                    {...register('first_name')}
                    disabled={!isEditing}
                    className={`
                      w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300
                      ${!isEditing ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/15'}
                      ${errors.first_name ? 'border-red-400 ring-4 ring-red-400/20' : ''}
                    `}
                    placeholder="Votre prénom"
                  />
                  {errors.first_name && (
                    <p className="text-sm text-red-300 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                
                {/* Nom */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/90 flex items-center">
                    <User className="w-4 h-4 mr-2 text-emerald-300" />
                    Nom
                  </label>
                  <input
                    type="text"
                    {...register('last_name')}
                    disabled={!isEditing}
                    className={`
                      w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300
                      ${!isEditing ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/15'}
                      ${errors.last_name ? 'border-red-400 ring-4 ring-red-400/20' : ''}
                    `}
                    placeholder="Votre nom"
                  />
                  {errors.last_name && (
                    <p className="text-sm text-red-300 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/90 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-emerald-300" />
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    disabled={!isEditing}
                    className={`
                      w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300
                      ${!isEditing ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/15'}
                      ${errors.email ? 'border-red-400 ring-4 ring-red-400/20' : ''}
                    `}
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-300 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
                
                {/* Téléphone */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/90 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-emerald-300" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    disabled={!isEditing}
                    className={`
                      w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300
                      ${!isEditing ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/15'}
                      ${errors.phone ? 'border-red-400 ring-4 ring-red-400/20' : ''}
                    `}
                    placeholder="+229 12 34 56 78"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-300 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Adresse */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/90 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-emerald-300" />
                  Adresse
                </label>
                <textarea
                  {...register('address')}
                  disabled={!isEditing}
                  rows={3}
                  className={`
                    w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 resize-none
                    ${!isEditing ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/15'}
                    ${errors.address ? 'border-red-400 ring-4 ring-red-400/20' : ''}
                  `}
                  placeholder="Votre adresse complète"
                />
                {errors.address && (
                  <p className="text-sm text-red-300 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.address.message}
                  </p>
                )}
              </div>
              
              {/* WhatsApp (optionnel) */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/90 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-emerald-300" />
                  WhatsApp (optionnel)
                </label>
                <input
                  type="tel"
                  {...register('whatsapp')}
                  disabled={!isEditing}
                  className={`
                    w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300
                    ${!isEditing ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/15'}
                  `}
                  placeholder="Numéro WhatsApp (si différent)"
                />
              </div>
              
              {/* Boutons d'action */}
              {isEditing && (
                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sauvegarde...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Sauvegarder</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={updateProfileMutation.isPending}
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 border border-white/30 hover:border-white/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Annuler</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Section Devenir Agent */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-full p-4 border border-white/20 mx-auto w-16 h-16 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Devenez <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Agent Enregistreur</span>
              </h2>
              <p className="text-lg text-emerald-100 mb-6 max-w-2xl mx-auto">
                Rejoignez notre réseau d'agents et contribuez à la sécurité des téléphones au Bénin tout en générant des revenus
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/profile/become-agent" 
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Postuler maintenant
                </Link>
                
                <div className="flex items-center space-x-4 text-sm text-emerald-200">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Revenus attractifs
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    Formation incluse
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
