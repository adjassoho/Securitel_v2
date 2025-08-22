import { FileText, Shield, AlertTriangle, CheckCircle, XCircle, Scale, Mail, Phone } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-2 mb-4 text-sm font-medium text-primary-700 bg-primary-100 rounded-full">
            <FileText className="w-4 h-4 mr-2" />
            Conditions d'utilisation
          </div>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Conditions Générales d'Utilisation
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Règles et conditions d'utilisation de la plateforme SecuriTel
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Préambule */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-primary-600" />
              Préambule
            </h2>
            <div className="bg-primary-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed">
                Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la 
                plateforme SecuriTel, service de sécurisation et de protection des téléphones mobiles 
                au Bénin. En utilisant nos services, vous acceptez pleinement et sans réserve ces conditions.
              </p>
            </div>
          </section>

          {/* Définitions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Définitions</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900">SecuriTel</h3>
                <p className="text-gray-700">La société SecuriTel SARL et sa plateforme de services</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900">Utilisateur</h3>
                <p className="text-gray-700">Toute personne physique ou morale utilisant les services SecuriTel</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900">Services</h3>
                <p className="text-gray-700">L'ensemble des fonctionnalités proposées par la plateforme SecuriTel</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibent text-gray-900">IMEI</h3>
                <p className="text-gray-700">International Mobile Equipment Identity - identifiant unique du téléphone</p>
              </div>
            </div>
          </section>

          {/* Objet des services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Objet des services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Services proposés
                </h3>
                <ul className="list-disc list-inside text-green-700 space-y-2">
                  <li>Vérification d'IMEI</li>
                  <li>Enregistrement de téléphones</li>
                  <li>Signalement de vol ou perte</li>
                  <li>Transfert de propriété</li>
                  <li>Base de données sécurisée</li>
                  <li>Notifications et alertes</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Objectifs</h3>
                <ul className="list-disc list-inside text-blue-700 space-y-2">
                  <li>Lutter contre le vol de téléphones</li>
                  <li>Sécuriser les transactions</li>
                  <li>Protéger les consommateurs</li>
                  <li>Collaborer avec les autorités</li>
                  <li>Créer un marché de confiance</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Conditions d'accès */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Conditions d'accès et d'inscription</h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Conditions requises
                </h3>
                <ul className="list-disc list-inside text-yellow-700 space-y-1">
                  <li>Être âgé de 18 ans minimum ou avoir l'autorisation parentale</li>
                  <li>Résider au Bénin ou dans un pays couvert par nos services</li>
                  <li>Fournir des informations exactes et à jour</li>
                  <li>Posséder une adresse email valide</li>
                  <li>Accepter les présentes CGU et la Politique de Confidentialité</li>
                </ul>
              </div>
              
              <div className="prose prose-gray max-w-none">
                <p>
                  L'inscription est gratuite mais certains services peuvent être payants. Vous vous engagez 
                  à ne créer qu'un seul compte et à maintenir vos informations à jour.
                </p>
              </div>
            </div>
          </section>

          {/* Obligations de l'utilisateur */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Obligations de l'utilisateur</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Vous devez
                </h3>
                <ul className="list-disc list-inside text-green-700 space-y-2">
                  <li>Utiliser les services de bonne foi</li>
                  <li>Fournir des informations exactes</li>
                  <li>Respecter la confidentialité des autres</li>
                  <li>Signaler tout dysfonctionnement</li>
                  <li>Respecter les lois en vigueur</li>
                  <li>Protéger vos identifiants de connexion</li>
                </ul>
              </div>
              
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  Il est interdit de
                </h3>
                <ul className="list-disc list-inside text-red-700 space-y-2">
                  <li>Fournir de fausses informations</li>
                  <li>Utiliser le service à des fins illégales</li>
                  <li>Tenter de contourner les mesures de sécurité</li>
                  <li>Partager vos identifiants</li>
                  <li>Nuire au fonctionnement du service</li>
                  <li>Violer les droits de propriété intellectuelle</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Responsabilités */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Scale className="w-6 h-6 mr-2 text-primary-600" />
              Responsabilités
            </h2>
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Responsabilités de SecuriTel</h3>
                <ul className="list-disc list-inside text-blue-700 space-y-2">
                  <li>Fournir un service de qualité dans la mesure du possible</li>
                  <li>Protéger vos données personnelles</li>
                  <li>Maintenir la sécurité de la plateforme</li>
                  <li>Collaborer avec les autorités compétentes</li>
                  <li>Informer des modifications importantes</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">Limitations de responsabilité</h3>
                <div className="prose prose-orange max-w-none">
                  <p>
                    SecuriTel ne peut être tenu responsable de :
                  </p>
                  <ul>
                    <li>La récupération effective d'un téléphone volé ou perdu</li>
                    <li>Les dommages indirects ou consécutifs</li>
                    <li>Les interruptions de service dues à des causes externes</li>
                    <li>Les actions des forces de l'ordre</li>
                    <li>L'utilisation malveillante du service par des tiers</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Tarification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tarification et paiement</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Services gratuits</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Vérification d'IMEI (limitée)</li>
                    <li>Consultation de la base publique</li>
                    <li>Création de compte</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Services payants</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Enregistrement de téléphones</li>
                    <li>Services premium</li>
                    <li>Support prioritaire</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white rounded border">
                <p className="text-sm text-gray-600">
                  <strong>Offre de lancement :</strong> 500 FCFA pour les 1000 premiers inscrits. 
                  Les tarifs peuvent évoluer avec un préavis de 30 jours.
                </p>
              </div>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <div className="prose prose-gray max-w-none">
              <p>
                Tous les éléments de la plateforme SecuriTel (textes, images, logos, codes, etc.) sont 
                protégés par les droits de propriété intellectuelle. Toute reproduction, représentation, 
                modification, publication, adaptation de tout ou partie des éléments du site, quel que 
                soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
              </p>
              <p>
                Les données que vous fournissez restent votre propriété, mais vous accordez à SecuriTel 
                une licence d'utilisation dans le cadre de la fourniture des services.
              </p>
            </div>
          </section>

          {/* Suspension et résiliation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Suspension et résiliation</h2>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Motifs de suspension</h3>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  <li>Non-respect des présentes CGU</li>
                  <li>Utilisation frauduleuse du service</li>
                  <li>Non-paiement des services</li>
                  <li>Activités illégales</li>
                </ul>
              </div>
              
              <div className="prose prose-gray max-w-none">
                <p>
                  Vous pouvez résilier votre compte à tout moment en nous contactant. SecuriTel peut 
                  suspendre ou résilier votre accès en cas de violation des CGU, avec ou sans préavis 
                  selon la gravité.
                </p>
              </div>
            </div>
          </section>

          {/* Protection des données */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Protection des données personnelles</h2>
            <div className="bg-primary-50 rounded-lg p-6">
              <p className="text-primary-700">
                Le traitement de vos données personnelles est régi par notre 
                <a href="/privacy" className="font-semibold underline hover:text-primary-800"> Politique de Confidentialité</a>, 
                qui fait partie intégrante des présentes CGU. Nous nous engageons à respecter la 
                réglementation béninoise sur la protection des données.
              </p>
            </div>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Droit applicable et juridiction</h2>
            <div className="prose prose-gray max-w-none">
              <p>
                Les présentes CGU sont régies par le droit béninois. En cas de litige, les parties 
                s'efforceront de trouver une solution amiable. À défaut, les tribunaux de Cotonou 
                seront seuls compétents.
              </p>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications des CGU</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-1" />
                <div>
                  <p className="text-yellow-700">
                    SecuriTel se réserve le droit de modifier les présentes CGU à tout moment. 
                    Les modifications seront notifiées par email et/ou sur la plateforme. 
                    La poursuite de l'utilisation après notification vaut acceptation des nouvelles conditions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-primary-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700 mb-4">
              Pour toute question concernant ces conditions générales d'utilisation :
            </p>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-primary-600" />
                Email : legal@securitel.bj
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-primary-600" />
                Téléphone : +229 XX XX XX XX
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-primary-600" />
                Courrier : SecuriTel SARL - Service Juridique, Cotonou, Bénin
              </p>
            </div>
          </section>
        </div>

        {/* Footer info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Version 1.0 - Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          <p className="mt-2">En utilisant SecuriTel, vous acceptez ces conditions générales d'utilisation</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;