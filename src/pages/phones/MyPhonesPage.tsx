import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { phoneService } from '@/services/api';
import { 
  Smartphone, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  MoreVertical,
  RefreshCw,
  Send,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';

const MyPhonesPage = () => {
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);

  const { data: phones, isLoading } = useQuery({
    queryKey: ['my-phones'],
    queryFn: phoneService.getMyPhones,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'legitimate':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'stolen':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'lost':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'recovered':
        return <Shield className="h-5 w-5 text-blue-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'legitimate':
        return { text: 'Légitime', color: 'text-green-600 bg-green-50' };
      case 'stolen':
        return { text: 'Volé', color: 'text-red-600 bg-red-50' };
      case 'lost':
        return { text: 'Perdu', color: 'text-orange-600 bg-orange-50' };
      case 'recovered':
        return { text: 'Récupéré', color: 'text-blue-600 bg-blue-50' };
      default:
        return { text: 'Inconnu', color: 'text-gray-600 bg-gray-50' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes téléphones</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gérez vos téléphones enregistrés et ajoutez de nouveaux appareils.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/phones/register"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Enregistrer un nouveau téléphone
          </Link>
        </div>
      </div>

      {phones && phones.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {phones.map((phone) => (
            <div key={phone.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Smartphone className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {phone.brand} {phone.model}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>IMEI 1: {phone.imei1}</p>
                      <p>IMEI 2: {phone.imei2}</p>
                      <p>N° Série: {phone.serial_number}</p>
                      <p>RAM: {phone.ram} | Stockage: {phone.storage}</p>
                    </div>
                    <div className="mt-3 flex items-center space-x-2">
                      {getStatusIcon(phone.status)}
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusLabel(phone.status).color}`}>
                        {getStatusLabel(phone.status).text}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Enregistré le {format(new Date(phone.created_at), 'PPP', { locale: fr })}
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setSelectedPhone(selectedPhone === phone.id ? null : phone.id)}
                    className="p-1 rounded-md hover:bg-gray-100"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                  
                  {selectedPhone === phone.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                      {phone.status === 'legitimate' && (
                        <>
                          <Link
                            to={`/phones/${phone.id}/status`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <RefreshCw className="inline h-4 w-4 mr-2" />
                            Gérer le statut
                          </Link>
                          <Link
                            to={`/phones/${phone.id}/transfer`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Send className="inline h-4 w-4 mr-2" />
                            Transférer la propriété
                          </Link>
                          <Link
                            to="/report/theft"
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <AlertTriangle className="inline h-4 w-4 mr-2" />
                            Signaler un vol
                          </Link>
                          <Link
                            to="/report/loss"
                            className="block px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
                          >
                            <AlertTriangle className="inline h-4 w-4 mr-2" />
                            Signaler une perte
                          </Link>
                        </>
                      )}
                      {(phone.status === 'stolen' || phone.status === 'lost') && (
                        <Link
                          to={`/phones/${phone.id}/status`}
                          className="block px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                        >
                          <CheckCircle className="inline h-4 w-4 mr-2" />
                          Marquer comme récupéré
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Smartphone className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun téléphone enregistré</h3>
          <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
            Commencez par enregistrer votre premier téléphone pour le protéger contre le vol et la perte.
          </p>
          <div className="space-y-3">
            <Link
              to="/phones/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Enregistrer mon premier téléphone
            </Link>
            <div>
              <Link to="/dashboard" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Aller au tableau de bord →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPhonesPage;
