import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Shield, FileText, MapPin, Calendar, Phone, CheckCircle } from 'lucide-react';
import { phoneService, reportService } from '../../services/api';

interface TheftReportForm {
  phoneId: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  description: string;
  policeReportNumber?: string;
  policeReportDate?: string;
}

export function ReportTheftPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<TheftReportForm>({
    phoneId: '',
    incidentDate: '',
    incidentTime: '',
    location: '',
    description: '',
    policeReportNumber: '',
    policeReportDate: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Récupérer la liste des téléphones de l'utilisateur
  const { data: phones, isLoading: phonesLoading } = useQuery({
    queryKey: ['userPhones'],
    queryFn: phoneService.getMyPhones,
  });

  // Mutation pour soumettre le signalement
  const reportTheftMutation = useMutation({
    mutationFn: (data: any) => reportService.reportTheft({
      phone_id: data.phone_id,
      theft_date: data.incident_date,
      theft_location: data.location,
      description: data.description,
      emergency_contact: '', // Add if needed
      verification_code: '', // Add if needed
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPhones'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/phones');
      }, 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combiner date et heure pour l'incident
    const incidentDateTime = `${formData.incidentDate}T${formData.incidentTime}`;
    
    const reportData = {
      phone_id: formData.phoneId,
      incident_date: incidentDateTime,
      location: formData.location,
      description: formData.description,
      police_report_number: formData.policeReportNumber || undefined,
      police_report_date: formData.policeReportDate || undefined,
    };

    reportTheftMutation.mutate(reportData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            Signalement enregistré avec succès
          </h2>
          <p className="text-green-700 mb-4">
            Votre téléphone a été marqué comme volé dans notre système.
            Les autorités et les revendeurs seront alertés.
          </p>
          <p className="text-sm text-green-600">
            Redirection vers vos téléphones...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Signaler un vol</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Signalez le vol de votre téléphone pour le protéger et alerter les autorités
          </p>
        </div>

        {/* Alerte importante */}
        <div className="p-6 bg-red-50 border-b border-red-100">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-semibold mb-1">Important :</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Déposez une plainte au commissariat dès que possible</li>
                <li>Le signalement rendra votre téléphone inutilisable s'il est retrouvé</li>
                <li>Conservez le numéro de dépôt de plainte pour vos démarches</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Sélection du téléphone */}
          <div>
            <label htmlFor="phoneId" className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Téléphone concerné *
            </label>
            <select
              id="phoneId"
              name="phoneId"
              value={formData.phoneId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={phonesLoading}
            >
              <option value="">Sélectionnez un téléphone</option>
              {phones?.map((phone: any) => (
                <option key={phone.id} value={phone.id}>
                  {phone.brand} {phone.model} - IMEI: {phone.imei_1}
                </option>
              ))}
            </select>
          </div>

          {/* Date et heure de l'incident */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date du vol *
              </label>
              <input
                type="date"
                id="incidentDate"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="incidentTime" className="block text-sm font-medium text-gray-700 mb-2">
                Heure approximative *
              </label>
              <input
                type="time"
                id="incidentTime"
                name="incidentTime"
                value={formData.incidentTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Lieu du vol */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Lieu du vol *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ex: 15 rue de la Paix, 75001 Paris"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Description des circonstances *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Décrivez les circonstances du vol..."
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Informations de plainte */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-900">Dépôt de plainte (recommandé)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="policeReportNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de dépôt de plainte
                </label>
                <input
                  type="text"
                  id="policeReportNumber"
                  name="policeReportNumber"
                  value={formData.policeReportNumber}
                  onChange={handleChange}
                  placeholder="Ex: 2024/12345"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="policeReportDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date du dépôt
                </label>
                <input
                  type="date"
                  id="policeReportDate"
                  name="policeReportDate"
                  value={formData.policeReportDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Erreur */}
          {reportTheftMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                Une erreur est survenue lors du signalement. Veuillez réessayer.
              </p>
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/phones')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={reportTheftMutation.isPending || !formData.phoneId}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reportTheftMutation.isPending ? 'Signalement en cours...' : 'Signaler le vol'}
            </button>
          </div>
        </form>
      </div>

      {/* Informations complémentaires */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Que faire après le signalement ?</h3>
        <ul className="list-disc ml-5 space-y-1 text-sm text-blue-800">
          <li>Contactez votre opérateur pour suspendre votre ligne</li>
          <li>Changez vos mots de passe importants (email, banque, réseaux sociaux)</li>
          <li>Activez la localisation à distance si possible</li>
          <li>Informez votre assurance si vous êtes couvert</li>
        </ul>
      </div>
    </div>
  );
}
