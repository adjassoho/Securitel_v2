import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit3, Save, X, CheckCircle, AlertCircle, Calendar, Shield, Camera, Upload, Settings, BarChart3, Users, Smartphone, AlertTriangle, UserCheck, ArrowRight, UserPlus, Search, FileText, DollarSign, HelpCircle, CreditCard } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { userService } from '@/services/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const profileUpdateSchema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres'),
  address: z.string().optional(),
  whatsapp: z.string().optional(),
});

type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      console.error('Erreur mise à jour profil:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Erreur lors de la mise à jour du profil';
      toast.error(errorMessage);
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

  // Gestion de l'upload de photo de profil
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La taille du fichier ne doit pas dépasser 5MB');
      return;
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image');
      return;
    }

    setIsUploadingImage(true);
    try {
      // Créer un URL temporaire pour l'aperçu
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      
      // Ici, tu peux ajouter l'appel API pour uploader l'image
      // await userService.uploadProfileImage(file);
      
      toast.success('Photo de profil mise à jour avec succès !');
    } catch (error) {
      toast.error('Erreur lors de l\'upload de la photo');
      setProfileImage(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
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
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
                <div 
                  className="relative w-24 h-24 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white/20 cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105"
                  onClick={handleImageClick}
                >
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Photo de profil" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>{user?.first_name?.[0]}{user?.last_name?.[0]}</span>
                  )}
                  
                  {/* Overlay pour l'upload */}
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {isUploadingImage ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
                
                {/* Input file caché */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {/* Indicateur d'upload */}
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white">
                  <Upload className="w-3 h-3 text-white" />
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
                <p className="text-xs text-white/70 text-center">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long' 
                  }) : 'Date inconnue'}
                </p>
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

          {/* Section Navigation Rapide selon le rôle */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Accès Rapide</h2>
              <p className="text-emerald-100">Accédez rapidement aux interfaces selon vos droits</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Admin / Super Admin */}
              {(user?.role === 'admin' || user?.role === 'super_admin') && (
                <>
                  <Link
                    to="/admin"
                    className="group bg-gradient-to-br from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 backdrop-blur-lg border border-red-400/30 hover:border-red-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-red-500/20 rounded-xl">
                        <Settings className="w-6 h-6 text-red-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Administration</h3>
                    <p className="text-sm text-red-100/80">Gérer les utilisateurs, téléphones et signalements</p>
                  </Link>

                  <Link
                    to="/police"
                    className="group bg-gradient-to-br from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 backdrop-blur-lg border border-purple-400/30 hover:border-purple-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        <Shield className="w-6 h-6 text-purple-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Interface Police</h3>
                    <p className="text-sm text-purple-100/80">Recherche et gestion des enquêtes</p>
                  </Link>

                  <Link
                    to="/admin/stats"
                    className="group bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 backdrop-blur-lg border border-blue-400/30 hover:border-blue-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-blue-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Statistiques</h3>
                    <p className="text-sm text-blue-100/80">Rapports et analyses détaillées</p>
                  </Link>

                  <Link
                    to="/agent"
                    className="group bg-gradient-to-br from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 backdrop-blur-lg border border-orange-400/30 hover:border-orange-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-orange-500/20 rounded-xl">
                        <UserPlus className="w-6 h-6 text-orange-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Interface Agent</h3>
                    <p className="text-sm text-orange-100/80">Gestion des enregistrements et clients</p>
                  </Link>
                </>
              )}

              {/* Police */}
              {user?.role === 'police' && (
                <>
                  <Link
                    to="/police"
                    className="group bg-gradient-to-br from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 backdrop-blur-lg border border-purple-400/30 hover:border-purple-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        <Shield className="w-6 h-6 text-purple-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Tableau de Bord Police</h3>
                    <p className="text-sm text-purple-100/80">Accès aux outils d'enquête et de recherche</p>
                  </Link>

                  <Link
                    to="/police/search/quick"
                    className="group bg-gradient-to-br from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 backdrop-blur-lg border border-green-400/30 hover:border-green-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-500/20 rounded-xl">
                        <Smartphone className="w-6 h-6 text-green-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-green-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Recherche Rapide</h3>
                    <p className="text-sm text-green-100/80">Vérification instantanée d'IMEI</p>
                  </Link>

                  <Link
                    to="/police/reports"
                    className="group bg-gradient-to-br from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 backdrop-blur-lg border border-orange-400/30 hover:border-orange-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-orange-500/20 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-orange-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Signalements</h3>
                    <p className="text-sm text-orange-100/80">Gestion des cas d'enquête</p>
                  </Link>
                </>
              )}

              {/* Agent */}
              {user?.role === 'agent' && (
                <>
                  <Link
                    to="/agent/dashboard"
                    className="group bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 backdrop-blur-lg border border-blue-400/30 hover:border-blue-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <UserCheck className="w-6 h-6 text-blue-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Tableau de Bord Agent</h3>
                    <p className="text-sm text-blue-100/80">Gestion des clients et enregistrements</p>
                  </Link>

                  <Link
                    to="/agent/clients"
                    className="group bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 backdrop-blur-lg border border-emerald-400/30 hover:border-emerald-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <Users className="w-6 h-6 text-emerald-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Mes Clients</h3>
                    <p className="text-sm text-emerald-100/80">Gérer votre portefeuille clients</p>
                  </Link>

                  <Link
                    to="/agent/register-phone"
                    className="group bg-gradient-to-br from-teal-500/20 to-teal-600/20 hover:from-teal-500/30 hover:to-teal-600/30 backdrop-blur-lg border border-teal-400/30 hover:border-teal-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-teal-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-teal-500/20 rounded-xl">
                        <Smartphone className="w-6 h-6 text-teal-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-teal-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Enregistrer Téléphone</h3>
                    <p className="text-sm text-teal-100/80">Nouvel enregistrement de téléphone</p>
                  </Link>

                  <Link
                    to="/agent/verify-imei"
                    className="group bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 hover:from-cyan-500/30 hover:to-cyan-600/30 backdrop-blur-lg border border-cyan-400/30 hover:border-cyan-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-cyan-500/20 rounded-xl">
                        <Search className="w-6 h-6 text-cyan-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Vérifier IMEI</h3>
                    <p className="text-sm text-cyan-100/80">Vérification avant achat</p>
                  </Link>

                  <Link
                    to="/agent/registrations"
                    className="group bg-gradient-to-br from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 backdrop-blur-lg border border-amber-400/30 hover:border-amber-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-amber-500/20 rounded-xl">
                        <FileText className="w-6 h-6 text-amber-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Mes Enregistrements</h3>
                    <p className="text-sm text-amber-100/80">Historique et gestion</p>
                  </Link>

                  <Link
                    to="/agent/accounting"
                    className="group bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 backdrop-blur-lg border border-emerald-400/30 hover:border-emerald-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <DollarSign className="w-6 h-6 text-emerald-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Comptabilité</h3>
                    <p className="text-sm text-emerald-100/80">Revenus et retraits</p>
                  </Link>

                  <Link
                    to="/agent/help"
                    className="group bg-gradient-to-br from-pink-500/20 to-pink-600/20 hover:from-pink-500/30 hover:to-pink-600/30 backdrop-blur-lg border border-pink-400/30 hover:border-pink-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-pink-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-pink-500/20 rounded-xl">
                        <HelpCircle className="w-6 h-6 text-pink-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-pink-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Aide & Support</h3>
                    <p className="text-sm text-pink-100/80">FAQ et contact support</p>
                  </Link>

                  <Link
                    to="/agent/referrals"
                    className="group bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 hover:from-indigo-500/30 hover:to-indigo-600/30 backdrop-blur-lg border border-indigo-400/30 hover:border-indigo-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-indigo-500/20 rounded-xl">
                        <Users className="w-6 h-6 text-indigo-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Mes Parrainés</h3>
                    <p className="text-sm text-indigo-100/80">Gérer mes parrainés</p>
                  </Link>

                  <Link
                    to="/agent/referral-stats"
                    className="group bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 hover:from-cyan-500/30 hover:to-cyan-600/30 backdrop-blur-lg border border-cyan-400/30 hover:border-cyan-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-cyan-500/20 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-cyan-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Stats Parrainage</h3>
                    <p className="text-sm text-cyan-100/80">Statistiques de parrainage</p>
                  </Link>

                  <Link
                    to="/agent/advanced-register-phone"
                    className="group bg-gradient-to-br from-rose-500/20 to-rose-600/20 hover:from-rose-500/30 hover:to-rose-600/30 backdrop-blur-lg border border-rose-400/30 hover:border-rose-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-rose-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-rose-500/20 rounded-xl">
                        <Smartphone className="w-6 h-6 text-rose-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Enregistrement Avancé</h3>
                    <p className="text-sm text-rose-100/80">Formulaire complet avec captures</p>
                  </Link>

                  <Link
                    to="/agent/advanced-create-client"
                    className="group bg-gradient-to-br from-violet-500/20 to-violet-600/20 hover:from-violet-500/30 hover:to-violet-600/30 backdrop-blur-lg border border-violet-400/30 hover:border-violet-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-violet-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-violet-500/20 rounded-xl">
                        <UserPlus className="w-6 h-6 text-violet-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Créer Client Avancé</h3>
                    <p className="text-sm text-violet-100/80">Avec vérification d'identité</p>
                  </Link>

                  <Link
                    to="/agent/mobile-money-payment"
                    className="group bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 backdrop-blur-lg border border-emerald-400/30 hover:border-emerald-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <CreditCard className="w-6 h-6 text-emerald-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Paiement Mobile Money</h3>
                    <p className="text-sm text-emerald-100/80">MTN, Moov, Orange</p>
                  </Link>

                  <Link
                    to="/agent/imei-alerts"
                    className="group bg-gradient-to-br from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 backdrop-blur-lg border border-red-400/30 hover:border-red-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-red-500/20 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Alertes IMEI</h3>
                    <p className="text-sm text-red-100/80">Surveillance sécurité</p>
                  </Link>

                  <Link
                    to="/agent/profile"
                    className="group bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 hover:from-indigo-500/30 hover:to-indigo-600/30 backdrop-blur-lg border border-indigo-400/30 hover:border-indigo-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-indigo-500/20 rounded-xl">
                        <User className="w-6 h-6 text-indigo-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Mon Profil Agent</h3>
                    <p className="text-sm text-indigo-100/80">Gérer mes informations</p>
                  </Link>

                  <Link
                    to="/agent/create-client"
                    className="group bg-gradient-to-br from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 backdrop-blur-lg border border-purple-400/30 hover:border-purple-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        <UserPlus className="w-6 h-6 text-purple-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Nouveau Client</h3>
                    <p className="text-sm text-purple-100/80">Créer un nouveau client</p>
                  </Link>

                  <Link
                    to="/dashboard"
                    className="group bg-gradient-to-br from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 backdrop-blur-lg border border-orange-400/30 hover:border-orange-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-orange-500/20 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-orange-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Mon Profil Utilisateur</h3>
                    <p className="text-sm text-orange-100/80">Accéder à mon profil personnel</p>
                  </Link>

                  <Link
                    to="/phones"
                    className="group bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 hover:from-indigo-500/30 hover:to-indigo-600/30 backdrop-blur-lg border border-indigo-400/30 hover:border-indigo-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-indigo-500/20 rounded-xl">
                        <Smartphone className="w-6 h-6 text-indigo-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Mes Téléphones</h3>
                    <p className="text-sm text-indigo-100/80">Gérer mes appareils personnels</p>
                  </Link>
                </>
              )}

              {/* Utilisateur standard */}
              {user?.role === 'user' && (
                <>
                  <Link
                    to="/dashboard"
                    className="group bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 backdrop-blur-lg border border-emerald-400/30 hover:border-emerald-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-emerald-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Mon Tableau de Bord</h3>
                    <p className="text-sm text-emerald-100/80">Vue d'ensemble de vos activités</p>
                  </Link>

                  <Link
                    to="/phones"
                    className="group bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 backdrop-blur-lg border border-blue-400/30 hover:border-blue-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Smartphone className="w-6 h-6 text-blue-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Mes Téléphones</h3>
                    <p className="text-sm text-blue-100/80">Gérer vos appareils enregistrés</p>
                  </Link>

                  <Link
                    to="/reports"
                    className="group bg-gradient-to-br from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 backdrop-blur-lg border border-orange-400/30 hover:border-orange-400/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-orange-500/20 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-orange-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Mes Signalements</h3>
                    <p className="text-sm text-orange-100/80">Suivre vos déclarations</p>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Section Devenir Agent */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="relative bg-white/10 backdrop-blur-lg rounded-full p-4 border border-white/20 mx-auto w-16 h-16 flex items-center justify-center">
                  <img 
                    src="/images/logo.png" 
                    alt="SecuriTel Logo" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </div>
              
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Devenez <span className="text-blue-400">Agent Enregistreur</span>
              </h2>
              <p className="text-lg text-emerald-100 mb-6 max-w-2xl mx-auto">
                Rejoignez notre réseau d'agents et contribuez à la sécurité des téléphones au Bénin tout en générant des revenus
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/profile/become-agent" 
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300"
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
