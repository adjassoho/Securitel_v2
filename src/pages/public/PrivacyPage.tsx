import { Eye, Lock, Database, UserCheck, AlertTriangle, Mail, Phone } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-2 mb-4 text-sm font-medium text-primary-700 bg-primary-100 rounded-full">
            <Lock className="w-4 h-4 mr-2" />
            Protection des données
          </div>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Politique de Confidentialité
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Comment nous protégeons et utilisons vos données personnelles
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <img src="/images/logo.png" alt="SecuriTel Logo" className="w-6 h-6 mr-2" />
              Notre engagement
            </h2>
            <div className="bg-primary-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed">
                Chez SecuriTel, la protection de vos données personnelles est notre priorité absolue. 
                Cette politique de confidentialité vous informe sur la manière dont nous collectons, 
                utilisons, stockons et protégeons vos informations personnelles dans le cadre de nos 
                services de sécurisation des téléphones mobiles.
              </p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2 text-primary-600" />
              Données que nous collectons
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations d'identification</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Adresse postale</li>
                  <li>Pièce d'identité (pour vérification)</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations sur les appareils</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Numéro IMEI</li>
                  <li>Marque et modèle du téléphone</li>
                  <li>Numéro de série</li>
                  <li>Photos de l'appareil et de la facture</li>
                  <li>Statut de l'appareil (actif, volé, perdu, etc.)</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Données techniques</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Adresse IP</li>
                  <li>Type de navigateur</li>
                  <li>Données de connexion</li>
                  <li>Cookies et technologies similaires</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Utilisation des données */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-primary-600" />
              Comment nous utilisons vos données
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Services principaux</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Vérification d'IMEI</li>
                  <li>Enregistrement des téléphones</li>
                  <li>Signalement de vol ou perte</li>
                  <li>Transfert de propriété</li>
                  <li>Notifications de sécurité</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Amélioration du service</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Support client</li>
                  <li>Prévention de la fraude</li>
                  <li>Analyse statistique</li>
                  <li>Développement de nouvelles fonctionnalités</li>
                  <li>Communication marketing (avec consentement)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Partage des données */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <UserCheck className="w-6 h-6 mr-2 text-primary-600" />
              Partage de vos données
            </h2>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Partenaires autorisés</h3>
                <p className="text-green-700">
                  Nous partageons certaines données avec les forces de l'ordre et les autorités compétentes 
                  uniquement dans le cadre de la lutte contre le vol de téléphones et conformément à la 
                  réglementation en vigueur.
                </p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Ce que nous ne faisons JAMAIS</h3>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  <li>Vendre vos données à des tiers</li>
                  <li>Partager vos informations à des fins commerciales</li>
                  <li>Utiliser vos données sans votre consentement</li>
                  <li>Transférer vos données hors du Bénin sans protection</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-2 text-primary-600" />
              Sécurité de vos données
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Chiffrement</h3>
                <p className="text-sm text-gray-600">Toutes les données sont chiffrées en transit et au repos</p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img src="/images/logo.png" alt="SecuriTel Logo" className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Accès contrôlé</h3>
                <p className="text-sm text-gray-600">Accès limité aux employés autorisés uniquement</p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Sauvegarde</h3>
                <p className="text-sm text-gray-600">Sauvegardes régulières et sécurisées</p>
              </div>
            </div>
          </section>

          {/* Vos droits */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <UserCheck className="w-6 h-6 mr-2 text-primary-600" />
              Vos droits
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">Vous disposez des droits suivants concernant vos données personnelles :</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Droit d'accès :</strong> Consulter vos données</li>
                  <li><strong>Droit de rectification :</strong> Corriger vos informations</li>
                  <li><strong>Droit à l'effacement :</strong> Supprimer vos données</li>
                </ul>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Droit à la portabilité :</strong> Récupérer vos données</li>
                  <li><strong>Droit d'opposition :</strong> Refuser certains traitements</li>
                  <li><strong>Droit de limitation :</strong> Restreindre l'utilisation</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies et technologies similaires</h2>
            <div className="prose prose-gray max-w-none">
              <p>
                Nous utilisons des cookies pour améliorer votre expérience sur notre site. Ces cookies nous 
                permettent de :
              </p>
              <ul>
                <li>Maintenir votre session de connexion</li>
                <li>Mémoriser vos préférences</li>
                <li>Analyser l'utilisation du site</li>
                <li>Personnaliser le contenu</li>
              </ul>
              <p>
                Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut affecter 
                le fonctionnement de certaines fonctionnalités.
              </p>
            </div>
          </section>

          {/* Conservation des données */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Conservation des données</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Durée de conservation</h3>
                  <p className="text-yellow-700">
                    Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux 
                    finalités pour lesquelles elles ont été collectées, conformément à la réglementation 
                    béninoise sur la protection des données.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-primary-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact - Délégué à la Protection des Données</h2>
            <p className="text-gray-700 mb-4">
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits :
            </p>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-primary-600" />
                Email : dpo@securitel.bj
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-primary-600" />
                Téléphone : +229 XX XX XX XX
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-primary-600" />
                Courrier : SecuriTel SARL - Service DPO, Cotonou, Bénin
              </p>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications de cette politique</h2>
            <div className="prose prose-gray max-w-none">
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour. 
                Nous vous encourageons à consulter régulièrement cette page.
              </p>
              <p>
                En cas de modification substantielle, nous vous en informerons par email ou par notification 
                sur notre plateforme.
              </p>
            </div>
          </section>
        </div>

        {/* Footer info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          <p className="mt-2">Cette politique est conforme à la réglementation béninoise sur la protection des données personnelles</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;