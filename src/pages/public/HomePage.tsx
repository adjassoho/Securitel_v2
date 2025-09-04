import { Link } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle, 
  Star,
  ArrowRight,
  Users,
  Clock,
  Lock,
  Smartphone,
  Eye,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Fingerprint,
  Send
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    
    // Mouse tracking for parallax effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Scroll tracking
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Intersection Observer for section animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setVisibleSections(prev => new Set([...prev, sectionId]));
        }
      });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const features = [
    {
      icon: ShieldCheck,
      title: "Vérification IMEI",
      description: "Vérifiez instantanément si un téléphone est volé avant l'achat",
      gradient: "from-emerald-500 to-teal-500",
      delay: 0,
      stats: "99.9%"
    },
    {
      icon: Fingerprint,
      title: "Enregistrement sécurisé",
      description: "Protégez votre appareil avec IMEI et preuves de propriété",
      gradient: "from-blue-500 to-indigo-500",
      delay: 100,
      stats: "15K+"
    },
    {
      icon: Eye,
      title: "Signalement de vol",
      description: "Déclarez un vol et bloquez l'appareil dans notre base",
      gradient: "from-red-500 to-pink-500",
      delay: 200,
      stats: "24h"
    },
    {
      icon: Users,
      title: "Transfert de propriété",
      description: "Vendez ou cédez votre téléphone en toute sécurité",
      gradient: "from-purple-500 to-violet-500",
      delay: 300,
      stats: "100%"
    },
    {
      icon: MapPin,
      title: "Localisation avancée",
      description: "Localisez votre appareil perdu (bientôt disponible)",
      gradient: "from-orange-500 to-amber-500",
      delay: 400,
      stats: "GPS"
    },
    {
      icon: Lock,
      title: "Protection juridique",
      description: "Support légal et partenariat avec les forces de l'ordre",
      gradient: "from-cyan-500 to-blue-500",
      delay: 500,
      stats: "Légal"
    }
  ];

  const stats = [
    { value: '15K+', label: 'Téléphones protégés', icon: Shield, color: 'text-emerald-400' },
    { value: '98%', label: 'Taux de récupération', icon: CheckCircle, color: 'text-blue-400' },
    { value: '24/7', label: 'Support disponible', icon: Clock, color: 'text-purple-400' },
    { value: '100%', label: 'Sécurisé & fiable', icon: Lock, color: 'text-cyan-400' },
  ];

  const testimonials = [
    {
      name: "Koffi Adama",
      role: "Commerçant à Dantokpa",
      avatar: "👨‍💼",
      content: "J'ai retrouvé mon téléphone volé en 48h grâce à SecuriTel. Le service est exceptionnel !",
      rating: 5,
      location: "Cotonou, Bénin"
    },
    {
      name: "Fatou Diallo",
      role: "Étudiante à l'Université",
      avatar: "👩‍🎓",
      content: "Maintenant je peux acheter des téléphones en toute confiance. La vérification IMEI est géniale !",
      rating: 5,
      location: "Porto-Novo, Bénin"
    },
    {
      name: "Moussa Koné",
      role: "Entrepreneur",
      avatar: "👨‍💻",
      content: "SecuriTel m'a sauvé la vie ! Mon iPhone a été récupéré grâce à leur base de données.",
      rating: 5,
      location: "Abomey-Calavi, Bénin"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Créez votre compte",
      description: "Inscription rapide et sécurisée en 2 minutes",
      icon: Users,
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      number: "02", 
      title: "Enregistrez votre téléphone",
      description: "Ajoutez IMEI, marque, modèle et preuves",
      icon: Smartphone,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      number: "03",
      title: "Protection active",
      description: "Vérifiez ou signalez, votre appareil est protégé",
      icon: Shield,
      gradient: "from-purple-500 to-violet-500"
    }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section with Advanced Animations */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/images/image (24).webp" 
            alt="SecuriTel Background" 
            className="w-full h-full object-cover"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-950/70 to-indigo-950/80"></div>
        </div>
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {/* Floating orbs with parallax */}
          <div 
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-float"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
              animationDelay: '0s'
            }}
          />
          <div 
            className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-float"
            style={{
              transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
              animationDelay: '2s'
            }}
          />
          <div 
            className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-float"
            style={{
              transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
              animationDelay: '4s'
            }}
          />
        </div>

        {/* Animated grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />

        {/* Sparkles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left content with enhanced animations */}
            <div className={`${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
              {/* Enhanced trust badge */}
              <div className="inline-flex items-center justify-center px-6 py-3 mb-8 text-sm font-medium text-blue-100 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-blue-400/30 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                <span className="group-hover:scale-105 transition-transform">N°1 au Bénin - 15K+ utilisateurs satisfaits</span>
              </div>
              
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                Protégez votre
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mt-2 animate-pulse">
                  téléphone intelligent
                </span>
              </h1>
              
              <p className="mt-8 text-xl text-blue-100 leading-relaxed max-w-2xl animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                La première plateforme de protection des téléphones au Bénin. 
                Sécurisez vos appareils contre le vol, la perte et les arnaques avec une technologie de pointe.
              </p>
              
              <div className="mt-12 flex flex-col sm:flex-row items-start gap-6">
                <Link 
                  to="/register" 
                  className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    <img src="/images/logo.png" alt="SecuriTel Logo" className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                  Commencer gratuitement
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Link>
                
                <Link 
                  to="/login" 
                  className="group link-login text-lg"
                >
                  Se connecter 
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              {/* Enhanced stats with animations */}
              <div className="mt-20 grid grid-cols-2 gap-x-8 gap-y-8">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className={`${isVisible ? 'animate-fadeIn' : 'opacity-0'} group hover:scale-105 transition-all duration-300`}
                    style={{ animationDelay: `${(index + 1) * 200}ms` }}
                  >
                    <div className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className={`p-3 bg-gradient-to-r ${stat.color.replace('text-', 'from-').replace('-400', '-500')} to-${stat.color.replace('text-', '').replace('-400', '-600')} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">{stat.value}</div>
                        <div className="text-sm text-blue-200">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Enhanced floating elements */}
            <div className={`mt-12 lg:mt-0 ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}>
              <div className="relative">
                <div className="relative mx-auto w-full max-w-sm">
                  <div className="relative group">
                    {/* Enhanced floating badges */}
                    <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-float shadow-lg hover:scale-110 transition-transform duration-300">
                      ✓ 100% Sécurisé
                    </div>
                    <div className="absolute top-20 -left-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold animate-float shadow-lg hover:scale-110 transition-transform duration-300" style={{ animationDelay: '1s' }}>
                      24/7 Support
                    </div>
                    <div className="absolute bottom-20 -right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold animate-float shadow-lg hover:scale-110 transition-transform duration-300" style={{ animationDelay: '2s' }}>
                      15K+ Utilisateurs
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center group hover:scale-110 transition-transform duration-300">
            <div className="w-1 h-3 bg-blue-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-32 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-20 transition-all duration-1000 ${
            visibleSections.has('features') ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center justify-center px-6 py-3 mb-6 text-sm font-medium text-purple-700 bg-purple-100 rounded-full border border-purple-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Fonctionnalités exclusives
            </div>
            <h2 className="text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl mb-6">
              Une protection <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">complète</span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Découvrez les 6 piliers SecuriTel qui font de nous la référence en matière de protection de téléphones au Bénin
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 border border-gray-100 ${
                  visibleSections.has('features') ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  animationDelay: `${feature.delay}ms`,
                  transitionDelay: `${feature.delay}ms`
                }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-700`} />
                
                {/* Icon container with enhanced animations */}
                <div className="relative mb-8">
                  <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${feature.gradient} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>
                
                {/* Stats badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${feature.gradient} text-white`}>
                  {feature.stats}
                </div>
                
                {/* Hover indicator */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <ArrowRight className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Features Ecosystem Illustration */}
          <div className="mt-20 text-center">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                🛡️ Écosystème complet de protection SecuriTel
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Cette illustration montre comment nos 5 fonctionnalités principales travaillent ensemble 
                pour créer un bouclier de protection complet autour de votre téléphone. Chaque service 
                est interconnecté pour vous offrir une sécurité maximale.
              </p>
            </div>
            
            {/* Main ecosystem illustration */}
            <div className="mb-8">
              <img 
                src="/images/features-ecosystem.svg" 
                alt="Écosystème SecuriTel - Comment nos fonctionnalités travaillent ensemble pour protéger votre téléphone" 
                className="mx-auto max-w-full h-auto rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500"
              />
            </div>
            
            {/* Explanation cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Enregistrement sécurisé</h4>
                <p className="text-sm text-gray-600">Votre téléphone est enregistré dans notre base de données protégée</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Protection active</h4>
                <p className="text-sm text-gray-600">Surveillance continue et vérifications automatiques</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Récupération rapide</h4>
                <p className="text-sm text-gray-600">Signalement instantané et collaboration avec les autorités</p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  10,000+ téléphones protégés
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Base de données sécurisée
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Partenaire officiel des forces de l'ordre
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  Support 24/7
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/register" 
              className="inline-flex items-center px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
            >
              Découvrir toutes les fonctionnalités
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced How it works Section */}
      <section id="how-it-works" className="py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-20 transition-all duration-1000 ${
            visibleSections.has('how-it-works') ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl mb-6">
              Comment ça <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">marche</span> ?
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-4xl mx-auto">
              3 étapes simples pour protéger votre téléphone en moins de 5 minutes
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`relative text-center group transition-all duration-1000 ${
                  visibleSections.has('how-it-works') ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  transitionDelay: `${index * 200}ms`
                }}
              >
                {/* Step number with enhanced styling */}
                <div className={`mx-auto h-24 w-24 rounded-full bg-gradient-to-r ${step.gradient} text-white flex items-center justify-center text-3xl font-bold mb-8 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-500`}>
                  {step.number}
                </div>
                
                {/* Icon with enhanced animations */}
                <div className="mb-8">
                  <div className={`inline-flex p-6 bg-white rounded-3xl shadow-xl group-hover:shadow-2xl transform group-hover:-translate-y-2 group-hover:rotate-6 transition-all duration-500`}>
                    <step.icon className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                
                {/* Connector line with animation */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform translate-x-8 group-hover:scale-x-110 transition-transform duration-500" />
                )}
              </div>
            ))}
          </div>
          
          {/* How it works Illustration */}
          <div className="mt-20 text-center">
            <img 
              src="/images/how_it_work.png" 
              alt="Comment ça marche - SecuriTel" 
              className="mx-auto max-w-3xl w-full h-auto rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500"
            />
            </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/register" 
              className="inline-flex items-center px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
            >
              Commencer maintenant
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose SecuriTel Section */}
      <section id="why-choose" className="py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-20 transition-all duration-1000 ${
            visibleSections.has('why-choose') ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl mb-6">
              Pourquoi choisir <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">SecuriTel</span> ?
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-4xl mx-auto">
              Choisissez une solution efficace, reconnue et sécurisée
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <div className={`relative group transition-all duration-1000 ${
              visibleSections.has('why-choose') ? 'animate-slideInLeft opacity-100' : 'opacity-0 -translate-x-10'
            }`}>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src="/images/image (29).webp" 
                  alt="Pourquoi choisir SecuriTel" 
                  className="w-full h-auto transform group-hover:scale-105 transition-all duration-700"
                />
                {/* Overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg animate-float">
                ✓ Solution Officielle
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                🔒 100% Sécurisé
              </div>
            </div>
            
            {/* Right - Content */}
            <div className={`space-y-8 transition-all duration-1000 ${
              visibleSections.has('why-choose') ? 'animate-slideInRight opacity-100' : 'opacity-0 translate-x-10'
            }`}>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  La solution la plus complète pour la protection de vos téléphones
                </h3>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  SecuriTel se distingue des autres solutions par sa technologie avancée et son partenariat officiel avec les forces de l'ordre au Bénin.
                </p>
              </div>
              
              {/* Comparison Points */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">IMEI actif après réinitialisation</h4>
                    <p className="text-gray-600">Contrairement aux apps GPS, notre base de données IMEI reste active même après réinitialisation d'usine.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                    <img src="/images/logo.png" alt="SecuriTel Logo" className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Base publique accessible</h4>
                    <p className="text-gray-600">Notre base de données est accessible publiquement, permettant à tous de vérifier la légitimité d'un téléphone.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Partenaire des forces de l'ordre</h4>
                    <p className="text-gray-600">Collaboration officielle avec la police et les autorités pour une protection juridique complète.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Transfert sécurisé</h4>
                    <p className="text-gray-600">Processus de transfert de propriété sécurisé et légal, contrairement au marché informel.</p>
                  </div>
                </div>
            </div>
              
              {/* CTA Button */}
              <div className="pt-6">
                <Link 
                  to="/register" 
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
                >
                  <img src="/images/logo.png" alt="SecuriTel Logo" className="w-6 h-6 mr-3" />
                  Commencer avec SecuriTel
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="py-32 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-20 transition-all duration-1000 ${
            visibleSections.has('pricing') ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl mb-6">
              Offre de <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">lancement</span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-4xl mx-auto">
              Rejoignez les 1000 premiers utilisateurs et bénéficiez de notre offre spéciale
            </p>
          </div>
          
          <div className={`mx-auto max-w-lg transition-all duration-1000 ${
            visibleSections.has('pricing') ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 overflow-hidden group hover:shadow-3xl transition-all duration-500">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-10 transform translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="relative text-center">
                <div className="inline-flex items-center px-6 py-3 mb-8 text-sm font-medium text-green-700 bg-green-100 rounded-full border border-green-200">
                  🎉 Tarif annuel avantageux
                </div>
                
                <h3 className="text-4xl font-bold text-gray-900 mb-6">
                  Pack Sécurité Premium
                </h3>
                
                <div className="mb-8">
                  <span className="text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    1500 FCFA/an
                  </span>
                  <p className="text-gray-600 mt-2">(soit 125 FCFA/mois)</p>
                </div>
                
                <div className="space-y-4 text-left mb-10">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                    <span>Enregistrement illimité de téléphones</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                    <span>Vérification IMEI gratuite</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                    <span>Support prioritaire 24/7</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                    <span>Protection juridique incluse</span>
                  </div>
                </div>
                
                <Link 
                  to="/register" 
                  className="w-full inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
                >
                  Je m'inscris maintenant
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className="py-32 bg-white relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-5">
          <img 
            src="/images/testimonials-bg.svg" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center mb-20 transition-all duration-1000 ${
            visibleSections.has('testimonials') ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl mb-6">
              Ils nous <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">font confiance</span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-4xl mx-auto">
              Découvrez les histoires réelles de protection réussie de nos utilisateurs
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100 ${
                  index === currentTestimonial ? 'ring-2 ring-blue-500 scale-105' : ''
                } transition-all duration-1000 ${
                  visibleSections.has('testimonials') ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                      {testimonial.avatar}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-lg text-gray-700 italic mb-4 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-gray-500 mt-1">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section id="cta" className="py-32 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/images/image (25).webp" 
            alt="SecuriTel CTA Background" 
            className="w-full h-full object-cover"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-950/80 to-indigo-950/85"></div>
        </div>
        
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10 transition-all duration-1000 ${
          visibleSections.has('cta') ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-5xl font-bold text-white sm:text-6xl lg:text-7xl mb-8">
            Prêt à <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">protéger</span> votre téléphone ?
          </h2>
          <p className="text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Rejoignez des milliers d'utilisateurs qui font confiance à SecuriTel pour la protection de leurs appareils
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/register" 
              className="inline-flex items-center px-12 py-6 text-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 transition-all duration-500"
            >
              <img src="/images/logo.png" alt="SecuriTel Logo" className="w-6 h-6 mr-3" />
              Commencer gratuitement
            </Link>
            
            <Link 
              to="/login" 
              className="group link-login px-12 py-6 text-xl"
            >
              Se connecter
              <ArrowRight className="ml-3 h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          
          {/* Section pour devenir agent */}
          <div className="mt-16 pt-8 border-t border-white/20">
            <p className="text-lg text-blue-200 mb-6">
              Vous souhaitez contribuer à la sécurité des téléphones au Bénin ?
            </p>
            <Link 
              to="/profile/become-agent" 
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-xl hover:shadow-emerald-500/25 transform hover:-translate-y-1 transition-all duration-300"
            >
              <Shield className="w-5 h-5 mr-2" />
              Devenir Agent Enregistreur
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-20 transition-all duration-1000 ${
            visibleSections.has('faq') ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl mb-6">
              Questions <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">fréquentes</span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-4xl mx-auto">
              Tout ce que vous devez savoir sur SecuriTel
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FAQ Column 1 */}
            <div className={`space-y-6 transition-all duration-1000 ${
              visibleSections.has('faq') ? 'animate-slideInLeft opacity-100' : 'opacity-0 -translate-x-10'
            }`}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Comment fonctionne la vérification IMEI ?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Entrez simplement le numéro IMEI du téléphone dans notre base de données. Si le téléphone est enregistré comme volé, vous recevrez immédiatement une alerte.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Que se passe-t-il si je perds mon téléphone ?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Déclarez immédiatement la perte via notre plateforme. Le téléphone sera marqué comme volé dans notre base de données et les forces de l'ordre seront alertées.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Combien coûte le service ?</h3>
                <p className="text-gray-600 leading-relaxed">
                  L'inscription et la vérification IMEI sont gratuites. L'enregistrement de téléphones est à 500 FCFA pour les 1000 premiers inscrits.
                </p>
              </div>
            </div>
            
            {/* FAQ Column 2 */}
            <div className={`space-y-6 transition-all duration-1000 ${
              visibleSections.has('faq') ? 'animate-slideInRight opacity-100' : 'opacity-0 translate-x-10'
            }`}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Comment transférer la propriété d'un téléphone ?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connectez-vous à votre compte, sélectionnez le téléphone et utilisez l'option "Transfert de propriété". Le nouveau propriétaire recevra une notification.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">La base de données est-elle sécurisée ?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Absolument ! Nous utilisons des protocoles de sécurité de niveau bancaire et sommes partenaires officiels des forces de l'ordre au Bénin.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Puis-je vérifier plusieurs téléphones ?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Oui ! Vous pouvez vérifier autant de téléphones que vous le souhaitez. C'est particulièrement utile pour les commerçants et les acheteurs.
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact CTA */}
          <div className={`text-center mt-16 transition-all duration-1000 ${
            visibleSections.has('faq') ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            <p className="text-lg text-gray-600 mb-8">
              Vous avez d'autres questions ? Notre équipe est là pour vous aider !
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/contact" 
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Nous contacter
              </Link>
              
              <Link 
                to="/register" 
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 border-2 border-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-500"
              >
                Commencer maintenant
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-20 transition-all duration-1000 ${
            visibleSections.has('contact') ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl mb-6">
              Contactez <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">SecuriTel</span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-4xl mx-auto">
              Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question ou assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className={`space-y-8 transition-all duration-1000 ${
              visibleSections.has('contact') ? 'animate-slideInLeft opacity-100' : 'opacity-0 -translate-x-10'
            }`}>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-8">
                  Informations de contact
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        Téléphone
                      </h4>
                      <p className="text-gray-600 font-medium">
                        +229 99 99 99 99
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Appelez-nous directement
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        Email
                      </h4>
                      <p className="text-gray-600 font-medium">
                        contact@securitel.bj
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Envoyez-nous un email
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        WhatsApp
                      </h4>
                      <p className="text-gray-600 font-medium">
                        +229 99 99 99 99
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Chat en direct
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        Adresse
                      </h4>
                      <p className="text-gray-600 font-medium">
                        Cotonou, Bénin
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Notre localisation
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact CTA */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h4 className="text-2xl font-bold mb-4">
                  Besoin d'aide rapide ?
                </h4>
                <p className="text-blue-100 mb-6">
                  Consultez notre FAQ pour des réponses instantanées aux questions les plus courantes.
                </p>
                <a
                  href="#faq"
                  className="inline-flex items-center text-blue-100 hover:text-white transition-colors duration-300"
                >
                  Voir la FAQ
                  <MessageCircle className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:p-12 transition-all duration-1000 ${
              visibleSections.has('contact') ? 'animate-slideInRight opacity-100' : 'opacity-0 translate-x-10'
            }`}>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">
                Envoyez-nous un message
              </h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
              <input
                type="email"
                      id="contact-email"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="+229 XX XX XX XX"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="contact-subject"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Sujet de votre message"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Décrivez votre question ou votre problème..."
                  />
                </div>

                <Link 
                  to="/contact" 
                  className="w-full inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
                >
                  <Send className="w-6 h-6 mr-3" />
                  Envoyer le message
                </Link>
            </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
