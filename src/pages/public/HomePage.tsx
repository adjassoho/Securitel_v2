import { Link } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  MapPin,
  Star,
  ArrowRight,
  Zap,
  Award
} from 'lucide-react';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: '/images/imei-verification.svg',
      title: "Vérification d'IMEI",
      description: "Évitez d'acheter un téléphone volé",
      color: 'from-blue-500 to-cyan-500',
      delay: '0'
    },
    {
      icon: '/images/phone-security.svg',
      title: "Enregistrement téléphone",
      description: "Protégez votre appareil en le sécurisant",
      color: 'from-purple-500 to-pink-500',
      delay: '100'
    },
    {
      icon: '/images/theft-report.svg',
      title: "Signalement de vol",
      description: "Déclarez un vol, bloquez l'appareil",
      color: 'from-red-500 to-orange-500',
      delay: '200'
    },
    {
      icon: '/images/transfer-ownership.svg',
      title: "Transfert de propriété",
      description: "Vendez ou cédez en toute sécurité",
      color: 'from-green-500 to-teal-500',
      delay: '300'
    },
    {
      icon: '/images/location-tracking.svg',
      title: "Localisation",
      description: "En développement",
      color: 'from-indigo-500 to-purple-500',
      delay: '400'
    }
  ];

  const comparison = [
    { feature: "IMEI actif après réinitialisation", securitel: true, gps: false, informal: false },
    { feature: "Base publique accessible", securitel: true, gps: false, informal: false },
    { feature: "Partenaire des forces de l'ordre", securitel: true, gps: false, informal: false },
    { feature: "Transfert sécurisé", securitel: true, gps: false, informal: true },
    { feature: "Protection juridique", securitel: true, gps: false, informal: false },
  ];

  const stats = [
    { value: '10K+', label: 'Téléphones protégés' },
    { value: '98%', label: 'Taux de récupération' },
    { value: '24/7', label: 'Support disponible' },
    { value: '100%', label: 'Sécurisé' },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section with animated background */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 hero-pattern">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-secondary-600/10" />
          
          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
        </div>

        {/* Hero content with image */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left content */}
            <div className={`${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
              <div className="inline-flex items-center justify-center px-4 py-2 mb-8 text-sm font-medium text-primary-700 bg-primary-100 rounded-full">
                <Zap className="w-4 h-4 mr-2" />
                Plateforme N°1 au Bénin
              </div>
              
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                Protégez votre
                <span className="block gradient-text mt-2">téléphone intelligent</span>
              </h1>
              
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Sécurisez vos appareils contre le vol, la perte et les arnaques avec la première plateforme de protection des téléphones au Bénin.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link to="/register" className="btn-primary text-lg px-8 py-4 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1">
                  <Shield className="w-5 h-5 mr-2" />
                  Commencer gratuitement
                </Link>
                <Link to="/login" className="group text-lg font-semibold text-primary-600 hover:text-primary-700 flex items-center">
                  Se connecter 
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-4">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className={`${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}
                    style={{ animationDelay: `${(index + 1) * 200}ms` }}
                  >
                    <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right image */}
            <div className={`mt-12 lg:mt-0 ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}>
              <div className="relative">
                {/* Phone mockup with overlay */}
                <div className="relative mx-auto w-full max-w-lg">
                  <div className="relative">
                    {/* Phone frame */}
                    <div className="relative mx-auto bg-gray-900 rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl">
                      {/* Phone screen */}
                      <div className="rounded-[2rem] overflow-hidden h-[580px] w-[280px] mx-auto mt-[10px] bg-white">
                        {/* SecuriTel app mockup */}
                        <div className="bg-gradient-to-br from-primary-50 to-primary-100 h-full p-6">
                          <div className="flex items-center justify-center mb-8">
                            <Shield className="h-16 w-16 text-primary-600" />
                          </div>
                          <h3 className="text-center text-xl font-bold text-gray-900 mb-8">Votre téléphone est protégé</h3>
                          
                          {/* Mock phone info */}
                          <div className="space-y-4">
                            <div className="bg-white rounded-lg p-4 shadow">
                              <p className="text-sm text-gray-500">IMEI</p>
                              <p className="font-mono text-sm">356938103574892</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow">
                              <p className="text-sm text-gray-500">Statut</p>
                              <div className="flex items-center mt-1">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                <span className="text-green-600 font-semibold">Sécurisé</span>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow">
                              <p className="text-sm text-gray-500">Propriétaire</p>
                              <p className="font-semibold">Jean Dupont</p>
                            </div>
                          </div>
                          
                          <button className="w-full mt-8 bg-primary-600 text-white rounded-lg py-3 font-semibold">
                            Vérifier un IMEI
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating badges */}
                    <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-float">
                      ✓ 100% Sécurisé
                    </div>
                    <div className="absolute top-20 -left-8 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold animate-float" style={{ animationDelay: '1s' }}>
                      24/7 Support
                    </div>
                    <div className="absolute bottom-20 -right-8 bg-secondary-600 text-white px-4 py-2 rounded-full text-sm font-semibold animate-float" style={{ animationDelay: '2s' }}>
                      10K+ Utilisateurs
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <div className="inline-flex items-center justify-center px-4 py-2 mb-4 text-sm font-medium text-secondary-700 bg-secondary-100 rounded-full">
              <Award className="w-4 h-4 mr-2" />
              Fonctionnalités exclusives
            </div>
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Une protection <span className="gradient-text">complète</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les 5 piliers SecuriTel qui font de nous la référence en matière de protection de téléphones au Bénin
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                  isVisible ? 'animate-fadeIn' : 'opacity-0'
                }`}
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon container */}
                <div className="relative mb-6">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} transform group-hover:scale-110 transition-transform duration-300`}>
                    <img src={feature.icon} alt={feature.title} className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-5 w-5 text-primary-600" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link 
              to="/register" 
              className="inline-flex items-center btn-primary text-lg px-8 py-4"
            >
              Découvrir toutes les fonctionnalités
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Pourquoi choisir SecuriTel ?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Choisissez une solution efficace, reconnue et sécurisée
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Critères</th>
                  <th className="px-6 py-4 text-center">SecuriTel</th>
                  <th className="px-6 py-4 text-center">Apps GPS</th>
                  <th className="px-6 py-4 text-center">Marché informel</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-6 py-4 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {row.securitel ? (
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.gps ? (
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.informal ? (
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Témoignages
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Des histoires réelles de protection réussie
            </p>
          </div>
          <div className="mx-auto max-w-3xl">
            <div className="card bg-primary-50">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img 
                    src="/images/testimonial-avatar.svg" 
                    alt="Avatar de Koffi" 
                    className="h-12 w-12 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg text-gray-700 italic mb-4">
                    "J'ai retrouvé mon téléphone volé à Dantokpa grâce à SecuriTel."
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    Koffi, commerçant à Cotonou
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Comment ça marche ?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              3 étapes simples pour protéger votre téléphone
            </p>
          </div>
          
          {/* Illustration centrale */}
          <div className="flex justify-center mb-16">
            <img 
              src="/images/how-it-works.svg" 
              alt="Comment ça marche - Illustration des 3 étapes" 
              className="max-w-2xl w-full h-auto"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Créez votre compte</h3>
              <p className="text-gray-600">Inscription rapide et sécurisée</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Enregistrez votre téléphone</h3>
              <p className="text-gray-600">IMEI, marque, modèle et preuves</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Vérifiez ou signalez</h3>
              <p className="text-gray-600">Protection active de votre appareil</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Offre de lancement
            </h2>
          </div>
          <div className="mx-auto max-w-lg">
            <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  🎉 Offre spéciale
                </h3>
                <p className="text-4xl font-bold text-primary-600 mb-2">
                  500 FCFA
                </p>
                <p className="text-gray-600 mb-6">
                  Pour les 1000 premiers inscrits
                </p>
                <div className="space-y-4 text-left mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Enregistrement illimité de téléphones</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Vérification IMEI gratuite</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Support prioritaire</span>
                  </div>
                </div>
                <div className="bg-secondary-50 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-secondary-700">
                    🎁 Bonus parrainage
                  </p>
                  <p className="text-sm text-secondary-600">
                    Gagnez 50 FCFA par inscription de filleul
                  </p>
                </div>
                <Link to="/register" className="btn-primary w-full text-lg">
                  Je m'inscris maintenant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              📱 L'application mobile arrive !
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Soyez les premiers informés du lancement
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: Implement newsletter subscription
                alert('Merci ! Vous serez informé du lancement.');
                setEmail('');
              }}
              className="mx-auto max-w-md flex gap-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="input flex-1"
                required
              />
              <button type="submit" className="btn-primary">
                Recevoir une alerte
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
