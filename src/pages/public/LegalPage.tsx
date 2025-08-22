import { Building, Mail, Phone, MapPin } from 'lucide-react';

const LegalPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-2 mb-4 text-sm font-medium text-primary-700 bg-primary-100 rounded-full">
            <img src="/images/logo.png" alt="SecuriTel Logo" className="w-4 h-4 mr-2" />
            Informations légales
          </div>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Mentions Légales
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Informations légales et réglementaires de SecuriTel
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Éditeur du site */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Building className="w-6 h-6 mr-2 text-primary-600" />
              Éditeur du site
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-lg font-semibold text-gray-900 mb-2">SecuriTel SARL</p>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  Adresse : Cotonou, République du Bénin
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  Téléphone : +229 XX XX XX XX
                </p>
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  Email : contact@securitel.bj
                </p>
                <p><strong>RCCM :</strong> [Numéro à compléter]</p>
                <p><strong>IFU :</strong> [Numéro à compléter]</p>
                <p><strong>Directeur de publication :</strong> [Nom à compléter]</p>
              </div>
            </div>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hébergement</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                Le site SecuriTel est hébergé par :
              </p>
              <div className="mt-3 space-y-1 text-gray-700">
                <p><strong>[Nom de l'hébergeur]</strong></p>
                <p>[Adresse de l'hébergeur]</p>
                <p>Téléphone : [Numéro de téléphone]</p>
              </div>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <div className="prose prose-gray max-w-none">
              <p>
                L'ensemble de ce site relève de la législation béninoise et internationale sur le droit d'auteur 
                et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour 
                les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p>
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est 
                formellement interdite sauf autorisation expresse du directeur de la publication.
              </p>
              <p>
                Les marques SecuriTel et tous les logos figurant sur le site sont des marques déposées. 
                Toute reproduction totale ou partielle de ces marques sans autorisation préalable et écrite 
                est prohibée.
              </p>
            </div>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsabilité</h2>
            <div className="prose prose-gray max-w-none">
              <p>
                Les informations contenues sur ce site sont aussi précises que possible et le site est 
                périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des omissions 
                ou des lacunes.
              </p>
              <p>
                Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de 
                bien vouloir le signaler par email à l'adresse contact@securitel.bj, en décrivant le 
                problème de la manière la plus précise possible.
              </p>
              <p>
                SecuriTel ne pourra en aucune circonstance être tenu responsable de tout dommage de quelque 
                nature qu'il soit résultant de l'interprétation ou de l'utilisation des informations et/ou 
                documents disponibles sur ce site.
              </p>
            </div>
          </section>

          {/* Liens hypertextes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Liens hypertextes</h2>
            <div className="prose prose-gray max-w-none">
              <p>
                Les liens hypertextes mis en place dans le cadre du présent site web en direction d'autres 
                ressources présentes sur le réseau Internet ne sauraient engager la responsabilité de SecuriTel.
              </p>
              <p>
                De même, SecuriTel ne peut être tenu responsable du contenu des sites qui auraient un lien 
                vers le présent site.
              </p>
            </div>
          </section>

          {/* Collecte d'informations */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Collecte d'informations</h2>
            <div className="prose prose-gray max-w-none">
              <p>
                Aucune information personnelle n'est collectée à votre insu. Aucune information personnelle 
                n'est cédée à des tiers.
              </p>
              <p>
                Les données personnelles collectées dans le cadre de l'utilisation des services SecuriTel 
                sont traitées conformément à notre Politique de Confidentialité.
              </p>
            </div>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Droit applicable</h2>
            <div className="prose prose-gray max-w-none">
              <p>
                Tant le présent site que les modalités et conditions de son utilisation sont régis par le 
                droit béninois. En cas de contestation éventuelle, et après l'échec de toute tentative de 
                recherche d'une solution amiable, les tribunaux béninois seront seuls compétents pour 
                connaître de ce litige.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-primary-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700 mb-4">
              Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
            </p>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-primary-600" />
                Email : contact@securitel.bj
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-primary-600" />
                Téléphone : +229 XX XX XX XX
              </p>
            </div>
          </section>
        </div>

        {/* Footer info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;