import { User, Bell, Lock, Smartphone, Construction, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

const ProfilePage = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header avec glass morphism */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white/20">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-lg text-gray-600 mb-1">{user?.email}</p>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Compte actif</span>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 border border-white/30">
              <Sparkles className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 text-center">Membre depuis</p>
              <p className="text-xs text-gray-500 text-center">2024</p>
            </div>
          </div>
        </div>

        {/* Section en développement */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full p-8 border border-orange-200">
                <Construction className="h-20 w-20 text-orange-600 mx-auto" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Gestion de profil avancée 🚀
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Nous travaillons sur une interface complète de gestion de profil 
              pour vous offrir un contrôle total sur vos informations et préférences.
            </p>
            
            {/* Aperçu des fonctionnalités à venir */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:scale-105 transition-all duration-300 group">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-4 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Informations personnelles</h3>
                <p className="text-sm text-gray-600">Modifier nom, email, téléphone et adresse</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:scale-105 transition-all duration-300 group">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Sécurité</h3>
                <p className="text-sm text-gray-600">Changer mot de passe et activer 2FA</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:scale-105 transition-all duration-300 group">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
                <p className="text-sm text-gray-600">Gérer vos préférences de notification</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:scale-105 transition-all duration-300 group">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Mes appareils</h3>
                <p className="text-sm text-gray-600">Vue d'ensemble de vos téléphones</p>
              </div>
            </div>
            
            {/* Informations actuelles accessibles */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                <h3 className="font-semibold text-emerald-800 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informations actuelles
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-emerald-700">Nom :</span> <span className="text-emerald-600">{user?.first_name} {user?.last_name}</span></p>
                  <p><span className="font-medium text-emerald-700">Email :</span> <span className="text-emerald-600">{user?.email}</span></p>
                  <p><span className="font-medium text-emerald-700">Rôle :</span> <span className="text-emerald-600 capitalize">{user?.role || 'Utilisateur'}</span></p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700">Mise à jour prévue</span>
                </div>
                <p className="text-sm text-blue-600 text-center">
                  La gestion complète du profil sera disponible 
                  dans une prochaine mise à jour. Restez connecté !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
