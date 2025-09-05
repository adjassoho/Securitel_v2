import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Save,
  ArrowLeft,
  Plus,
  X,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { policeService } from '@/services/api';
import toast from 'react-hot-toast';

const CreateCasePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    report_ids: [] as string[],
  });
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<Array<{ content: string; is_confidential: boolean }>>([]);

  const createCaseMutation = useMutation({
    mutationFn: (data: any) => policeService.createCase(data),
    onSuccess: (result) => {
      toast.success('Dossier créé avec succès');
      navigate(`/police/cases/${result.id}`);
    },
    onError: (error) => {
      toast.error('Erreur lors de la création du dossier');
      console.error('Create case error:', error);
    },
  });

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes(prev => [...prev, { content: newNote, is_confidential: false }]);
      setNewNote('');
    }
  };

  const handleRemoveNote = (index: number) => {
    setNotes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('La description est obligatoire');
      return;
    }

    const caseData = {
      ...formData,
      notes: notes.map(note => note.content),
    };

    createCaseMutation.mutate(caseData);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/police/cases"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nouveau dossier</h1>
            <p className="mt-2 text-gray-600">
              Créer un nouveau dossier d'enquête
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du dossier *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Vol de téléphone - Marché de Cotonou"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez les circonstances, les éléments de preuve, les témoins..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Associated Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Signalements associés</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IDs des signalements (optionnel)
              </label>
              <input
                type="text"
                value={formData.report_ids.join(', ')}
                onChange={(e) => handleInputChange('report_ids', e.target.value.split(',').map(id => id.trim()).filter(id => id))}
                placeholder="Ex: 123, 456, 789"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Séparez les IDs par des virgules
              </p>
            </div>

            {formData.report_ids.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Signalements sélectionnés</h3>
                <div className="space-y-2">
                  {formData.report_ids.map((id, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded-lg p-2">
                      <span className="text-sm text-gray-700">ID: {id}</span>
                      <button
                        type="button"
                        onClick={() => handleInputChange('report_ids', formData.report_ids.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes initiales</h2>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Ajouter une note..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {notes.length > 0 && (
              <div className="space-y-2">
                {notes.map((note, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <span className="text-sm text-gray-700">{note.content}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNote(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Priority Indicator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Résumé du dossier</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Priorité</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(formData.priority)}`}>
                  {formData.priority}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Signalements</p>
                <p className="text-sm text-gray-900">{formData.report_ids.length}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Notes</p>
                <p className="text-sm text-gray-900">{notes.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            to="/police/cases"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={createCaseMutation.isPending}
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {createCaseMutation.isPending ? (
              <Clock className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Créer le dossier
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCasePage;
