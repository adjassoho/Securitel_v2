import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import ScrollToTopAdvanced from '@/components/ui/ScrollToTopAdvanced';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Fonctionnalités', href: '/#features' },
    { name: 'Comment ça marche', href: '/#how-it-works' },
    { name: 'Tarifs', href: '/#pricing' },
    { name: 'Témoignages', href: '/#testimonials' },
    { name: 'FAQ', href: '/#faq' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="SecuriTel Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-900">SecuriTel</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary-600',
                    location.pathname === item.href
                      ? 'text-primary-600'
                      : 'text-gray-700'
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                S'inscrire maintenant
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="mt-4 space-y-2">
                <Link
                  to="/login"
                  className="block w-full btn-login text-center text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block w-full btn-primary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Company info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/images/logo.png" alt="SecuriTel Logo" className="h-8 w-8" />
                <span className="text-xl font-bold">SecuriTel</span>
              </div>
              <p className="text-gray-400 mb-4">
                La première plateforme au Bénin pour enregistrer et sécuriser vos téléphones contre le vol, la perte et les arnaques.
              </p>
              <p className="text-sm text-gray-500">
                © 2025 SecuriTel. Tous droits réservés.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Liens utiles
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/legal" className="text-gray-400 hover:text-white transition-colors">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                    CGU
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                    Paramètres des cookies
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Contact
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>contact@securitel.bj</li>
                <li>+229 99 99 99 99</li>
                <li>WhatsApp: +229 99 99 99 99</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <ScrollToTopAdvanced 
        variant="progress" 
        position="bottom-right" 
        size="md" 
        threshold={200}
      />
    </div>
  );
};

export default PublicLayout;
