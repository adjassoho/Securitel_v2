import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  User, 
  Mail, 
  MapPin, 
  Building, 
  FileText, 
  Upload, 
  XCircle, 
  Send,
  ArrowLeft,
  Shield,
  Users,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const agentRegistrationSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres'),
  address: z.string().min(10, 'L\'adresse doit contenir au moins 10 caractères'),
  city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
  country: z.string().min(2, 'Le pays doit contenir au moins 2 caractères'),
  company: z.string().optional(),
  experience: z.string().min(20, 'Veuillez décrire votre expérience (minimum 20 caractères)'),
  motivation: z.string().min(30, 'Veuillez expliquer votre motivation (minimum 30 caractères)'),
  availability: z.string().min(1, 'Veuillez indiquer votre disponibilité'),
});

type AgentRegistrationData = z.infer<typeof agentRegistrationSchema>;

const BecomeAgentPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AgentRegistrationData>({
    resolver: zodResolver(agentRegistrationSchema)
  });

  const onSubmit = async (data: AgentRegistrationData) => {
    setIsSubmitting(true);
    try {
      // Simulation d'envoi - à remplacer par l'appel API réel
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Données du formulaire:', data);
      console.log('Fichiers uploadés:', uploadedFiles);
      
      toast.success('Votre candidature a été envoyée avec succès !');
      reset();
      setUploadedFiles([]);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de votre candidature');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            to="/profile" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au profil
          </Link>
        </div>

        {/* En-tête */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="relative bg-white/10 backdrop-blur-lg rounded-full p-6 border border-white/20 mx-auto w-20 h-20 flex items-center justify-center">
                <img 
                  src="/images/logo.png" 
                  alt="SecuriTel Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Devenir <span className="text-blue-600">Agent Enregistreur</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Rejoignez notre réseau d'agents enregistreurs et contribuez à la sécurité des téléphones au Bénin
            </p>
          </div>
        </div>

        {/* Avantages */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pourquoi devenir Agent Enregistreur ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenus Attractifs</h3>
              <p className="text-gray-600">Générez des revenus en enregistrant des téléphones pour nos clients</p>
            </div>
            
            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Réseau Professionnel</h3>
              <p className="text-gray-600">Intégrez un réseau d'agents certifiés et reconnus</p>
            </div>
            
            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Formation Complète</h3>
              <p className="text-gray-600">Bénéficiez d'une formation complète et d'un support continu</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Formulaire de Candidature</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Informations personnelles */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Informations Personnelles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    {...register('firstName')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 text-gray-900"
                    placeholder="Votre prénom"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    {...register('lastName')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 text-gray-900"
                    placeholder="Votre nom"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Informations de Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 text-gray-900"
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 text-gray-900"
                    placeholder="+229 12 34 56 78"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Adresse
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse complète *
                  </label>
                  <input
                    {...register('address')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 text-gray-900"
                    placeholder="Rue, numéro, quartier"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.address.message}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville *
                    </label>
                    <input
                      {...register('city')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 text-gray-900"
                      placeholder="Cotonou"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 flex items-center mt-1">
                        <XCircle className="w-4 h-4 mr-1" />
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pays *
                    </label>
                    <input
                      {...register('country')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 text-gray-900"
                      placeholder="Bénin"
                      defaultValue="Bénin"
                    />
                    {errors.country && (
                      <p className="text-sm text-red-600 flex items-center mt-1">
                        <XCircle className="w-4 h-4 mr-1" />
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Entreprise (optionnel) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Informations Professionnelles
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise (optionnel)
                </label>
                <input
                  {...register('company')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 text-gray-900"
                  placeholder="Nom de votre entreprise"
                />
              </div>
            </div>

            {/* Expérience et motivation */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Expérience et Motivation
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre expérience *
                  </label>
                  <textarea
                    {...register('experience')}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 text-gray-900 resize-none"
                    placeholder="Décrivez votre expérience dans le domaine de la technologie, de la vente, ou tout autre domaine pertinent..."
                  />
                  {errors.experience && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.experience.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre motivation *
                  </label>
                  <textarea
                    {...register('motivation')}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 text-gray-900 resize-none"
                    placeholder="Expliquez pourquoi vous souhaitez devenir agent enregistreur SecuriTel..."
                  />
                  {errors.motivation && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.motivation.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disponibilité *
                  </label>
                  <select
                    {...register('availability')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 text-gray-900"
                  >
                    <option value="">Sélectionnez votre disponibilité</option>
                    <option value="temps-plein">Temps plein</option>
                    <option value="temps-partiel">Temps partiel</option>
                    <option value="weekend">Week-ends uniquement</option>
                    <option value="flexible">Disponibilité flexible</option>
                  </select>
                  {errors.availability && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.availability.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-600" />
                Documents (optionnel)
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV, Certificats, ou autres documents
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 text-gray-900"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Fichiers sélectionnés :</p>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/30">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Soumettre ma candidature</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeAgentPage;
