import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Menu,
  X,
  Home,
  Smartphone,
  AlertTriangle,
  History,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/utils/cn';
import ScrollToTop from '@/components/ui/ScrollToTop';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPhoneMenuOpen, setIsPhoneMenuOpen] = useState(false);
  const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: Home },
    {
      name: 'Mes téléphones',
      icon: Smartphone,
      submenu: [
        { name: 'Voir mes téléphones', href: '/phones' },
      ],
    },
    {
      name: 'Signalements',
      icon: AlertTriangle,
      submenu: [
        { name: 'Signaler un vol', href: '/report/theft' },
        { name: 'Signaler une perte', href: '/report/loss' },
        { name: 'Appareil retrouvé', href: '/report/found' },
      ],
    },
    { name: 'Historique', href: '/history', icon: History },
    { name: 'Devenir agent enregistreur', href: '/become-agent', icon: User },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="SecuriTel Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-900">SecuriTel</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden rounded-md p-1 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => {
                        if (item.name === 'Mes téléphones') {
                          setIsPhoneMenuOpen(!isPhoneMenuOpen);
                        } else if (item.name === 'Signalements') {
                          setIsReportMenuOpen(!isReportMenuOpen);
                        }
                      }}
                      className={cn(
                        'w-full flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        'hover:bg-gray-100 hover:text-primary-600',
                        'text-gray-700'
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </div>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform',
                          (item.name === 'Mes téléphones' && isPhoneMenuOpen) ||
                          (item.name === 'Signalements' && isReportMenuOpen)
                            ? 'rotate-180'
                            : ''
                        )}
                      />
                    </button>
                    {((item.name === 'Mes téléphones' && isPhoneMenuOpen) ||
                      (item.name === 'Signalements' && isReportMenuOpen)) && (
                      <div className="mt-1 space-y-1 pl-11">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            to={subitem.href}
                            className={cn(
                              'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                              isActive(subitem.href)
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
                            )}
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                    )}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <Link
                to="/profile"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                onClick={() => setIsSidebarOpen(false)}
              >
                <User className="mr-3 h-4 w-4" />
                Mon profil
              </Link>
              <Link
                to="/settings"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Settings className="mr-3 h-4 w-4" />
                Paramètres
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Quick actions */}
            <div className="flex items-center space-x-4">
              {/* Actions rapides désormais uniquement dans le tableau de bord */}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>

      {/* Scroll to top button */}
      <ScrollToTop threshold={150} />
    </div>
  );
};

export default DashboardLayout;
