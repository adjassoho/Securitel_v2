import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Activity, 
  Plus, 
  Search, 
  AlertTriangle,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';
import { dashboardService } from '@/services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DashboardPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
  });

  const quickActions = [
    {
      title: 'Enregistrer un téléphone',
      description: 'Protégez votre nouveau téléphone',
      icon: Plus,
      link: '/phones/register',
      color: 'bg-primary-600',
    },
    {
      title: 'Vérifier un IMEI',
      description: 'Vérifiez avant d\'acheter',
      icon: Search,
      link: '/verify',
      color: 'bg-green-600',
    },
    {
      title: 'Signaler un vol',
      description: 'Déclarez rapidement un vol',
      icon: AlertTriangle,
      link: '/report/theft',
      color: 'bg-red-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-2 text-gray-600">
          Bienvenue sur votre espace SecuriTel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Téléphones enregistrés</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats?.total_phones || 0}
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <Smartphone className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-600">Protection active</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actions réalisées</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats?.total_actions || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Shield className="mr-1 h-4 w-4 text-primary-500" />
            <span className="text-primary-600">Sécurité renforcée</span>
          </div>
        </div>

        <div className="card sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Statut compte</p>
              <p className="mt-2 text-xl font-bold text-green-600">Actif</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/become-agent" className="text-sm text-primary-600 hover:text-primary-700">
              Devenir agent enregistreur →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="card hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activités récentes</h2>
        <div className="card">
          {stats?.recent_activities && stats.recent_activities.length > 0 ? (
            <div className="space-y-4">
              {stats.recent_activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    {activity.phone_imei && (
                      <p className="text-xs text-gray-500 mt-1">IMEI: {activity.phone_imei}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(activity.created_at), 'PPp', { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucune activité récente
            </p>
          )}
          
          <div className="mt-6">
            <Link
              to="/history"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Voir tout l'historique →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
