import { Clock, Calendar, Activity, Smartphone, AlertTriangle, Shield, Construction } from 'lucide-react';

const HistoryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header avec glass morphism */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-full p-6 border border-white/20 mx-auto w-fit">
                <Clock className="h-16 w-16 text-blue-600 mx-auto" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Historique des activités
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Consultez l'historique complet de toutes vos actions sur la plateforme SecuriTel
            </p>
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
              Fonctionnalité en développement 🚀
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Notre équipe travaille activement sur cette fonctionnalité pour vous offrir 
              une expérience exceptionnelle de suivi et d'analyse de vos activités.
            </p>
            
            {/* Aperçu des fonctionnalités à venir */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:scale-105 transition-all duration-300 group">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-4 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Filtrage avancé</h3>
                <p className="text-sm text-gray-600">Filtrez par date, type d'action et téléphone</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:scale-105 transition-all duration-300 group">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Analyses détaillées</h3>
                <p className="text-sm text-gray-600">Statistiques et tendances de vos activités</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:scale-105 transition-all duration-300 group">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Export sécurisé</h3>
                <p className="text-sm text-gray-600">Téléchargez vos données en toute sécurité</p>
              </div>
            </div>
            
            {/* Notification de disponibilité */}
            <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-700">Mise à jour prévue</span>
              </div>
              <p className="text-sm text-blue-600">
                Cette fonctionnalité sera disponible dans une prochaine mise à jour. 
                Restez connecté pour ne rien manquer !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
