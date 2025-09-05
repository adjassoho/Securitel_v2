import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { agentService } from '@/services/api';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Phone,
  Mail,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

const HelpSupportPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({
    subject: '',
    message: '',
  });

  // Récupération de la FAQ
  const { data: faqItems, isLoading: faqLoading } = useQuery({
    queryKey: ['agent-faq'],
    queryFn: agentService.getFAQ,
  });

  // Récupération des tickets de support
  const { data: supportTickets, isLoading: ticketsLoading, refetch: refetchTickets } = useQuery({
    queryKey: ['agent-support-tickets'],
    queryFn: agentService.getSupportTickets,
  });

  // Mutation pour créer un ticket de support
  const createTicketMutation = useMutation({
    mutationFn: agentService.contactSupport,
    onSuccess: () => {
      toast.success('Votre message a été envoyé avec succès');
      setShowContactForm(false);
      setContactData({ subject: '', message: '' });
      refetchTickets();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi du message');
    },
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactData.subject.trim() || !contactData.message.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    createTicketMutation.mutate(contactData);
  };

  const filteredFAQ = faqItems?.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'open':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'open':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'Résolu';
      case 'in_progress':
        return 'En cours';
      case 'open':
        return 'Ouvert';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Aide & Support</h1>
          <p className="mt-2 text-gray-600">
            Trouvez des réponses à vos questions et contactez notre équipe
          </p>
        </div>
        <button
          onClick={() => setShowContactForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Contacter le support
        </button>
      </div>

      {/* Centre d'aide - FAQ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Centre d'Aide</h2>
        </div>

        {/* Recherche FAQ */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher dans la FAQ..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Liste FAQ */}
        <div className="space-y-4">
          {faqLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredFAQ.length > 0 ? (
            filteredFAQ.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  {expandedFAQ === item.id ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                {expandedFAQ === item.id && (
                  <div className="px-4 pb-3 border-t border-gray-200">
                    <p className="text-gray-700 mt-3">{item.answer}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {item.category}
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune FAQ trouvée</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Aucune question fréquente disponible'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mes tickets de support */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Mes Tickets de Support</h2>
          </div>
          <button
            onClick={() => refetchTickets()}
            className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Actualiser
          </button>
        </div>

        <div className="space-y-4">
          {ticketsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : supportTickets && supportTickets.length > 0 ? (
            supportTickets.map((ticket) => (
              <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        <span className="ml-1">{getStatusText(ticket.status)}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.subject}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    {ticket.messages && ticket.messages.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">Réponse de l'équipe :</p>
                        <p className="text-sm text-blue-800">{ticket.messages[ticket.messages.length - 1]?.content}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun ticket de support</h3>
              <p className="text-gray-500">Vous n'avez pas encore contacté le support</p>
            </div>
          )}
        </div>
      </div>

      {/* Tutoriels et ressources */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tutoriels et Ressources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-gray-900">Guide d'utilisation</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Apprenez à utiliser toutes les fonctionnalités de la plateforme
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              Consulter le guide
              <ExternalLink className="h-3 w-3 ml-1" />
            </button>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-2">
              <HelpCircle className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-gray-900">Vidéo tutoriels</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Regardez nos vidéos explicatives pour maîtriser l'outil
            </p>
            <button className="text-sm text-green-600 hover:text-green-800 flex items-center">
              Voir les vidéos
              <ExternalLink className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Contact direct */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Direct</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Téléphone</p>
              <p className="text-sm text-gray-600">+225 XX XX XX XX XX</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Mail className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-600">support@securitels.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de contact */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contacter le Support
            </h3>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet
                </label>
                <input
                  type="text"
                  value={contactData.subject}
                  onChange={(e) => setContactData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez brièvement votre problème"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={contactData.message}
                  onChange={(e) => setContactData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez votre problème en détail..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createTicketMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {createTicketMutation.isPending ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSupportPage;
