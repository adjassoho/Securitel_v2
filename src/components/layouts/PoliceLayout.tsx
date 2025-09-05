import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Menu,
  X,
  Home,
  Search,
  AlertTriangle,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  RefreshCw,
  Shield,
  Clock,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/utils/cn';
import ScrollToTop from '@/components/ui/ScrollToTop';

const PoliceLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReportsMenuOpen, setIsReportsMenuOpen] = useState(false);
  const [isCasesMenuOpen, setIsCasesMenuOpen] = useState(false);
  const [isStatsMenuOpen, setIsStatsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Tableau de bord', href: '/police', icon: Home },
    {
      name: 'Recherche',
      icon: Search,
      submenu: [
        { name: 'Vérification rapide', href: '/police/search/quick' },
        { name: 'Recherche avancée', href: '/police/search/advanced' },
        { name: 'Historique des recherches', href: '/police/search/history' },
      ],
    },
    {
      name: 'Signalements',
      icon: AlertTriangle,
      submenu: [
        { name: 'Tous les signalements', href: '/police/reports' },
        { name: 'En attente', href: '/police/reports?status=pending' },
        { name: 'En enquête', href: '/police/reports?status=in_investigation' },
        { name: 'Résolus', href: '/police/reports?status=resolved' },
        { name: 'Vols', href: '/police/reports?type=theft' },
        { name: 'Appareils retrouvés', href: '/police/reports?type=found' },
      ],
    },
    {
      name: 'Dossiers',
      icon: FileText,
      submenu: [
        { name: 'Mes dossiers', href: '/police/cases' },
        { name: 'Nouveau dossier', href: '/police/cases/create' },
        { name: 'Dossiers ouverts', href: '/police/cases?status=open' },
        { name: 'Dossiers fermés', href: '/police/cases?status=closed' },
      ],
    },
    {
      name: 'Statistiques',
      icon: BarChart3,
      submenu: [
        { name: 'Vue d\'ensemble', href: '/police/stats' },
        { name: 'Par localisation', href: '/police/stats/location' },
        { name: 'Rapports', href: '/police/stats/reports' },
        { name: 'Exports', href: '/police/stats/exports' },
      ],
    },
    { name: 'Paramètres', href: '/police/settings', icon: Settings },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-red-600">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-white mr-3" />
            <div>
              <span className="text-xl font-bold text-white">Police</span>
              <p className="text-xs text-blue-100">SecuriTel</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => {
                        if (item.name === 'Signalements') setIsReportsMenuOpen(!isReportsMenuOpen);
                        if (item.name === 'Dossiers') setIsCasesMenuOpen(!isCasesMenuOpen);
                        if (item.name === 'Statistiques') setIsStatsMenuOpen(!isStatsMenuOpen);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                        "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </div>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        (item.name === 'Signalements' && isReportsMenuOpen) ||
                        (item.name === 'Dossiers' && isCasesMenuOpen) ||
                        (item.name === 'Statistiques' && isStatsMenuOpen)
                          ? "rotate-180" : ""
                      )} />
                    </button>
                    <div className={cn(
                      "ml-4 mt-2 space-y-1 transition-all duration-200",
                      (item.name === 'Signalements' && isReportsMenuOpen) ||
                      (item.name === 'Dossiers' && isCasesMenuOpen) ||
                      (item.name === 'Statistiques' && isStatsMenuOpen)
                        ? "block" : "hidden"
                    )}>
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={cn(
                            "block px-3 py-2 text-sm rounded-lg transition-colors duration-200",
                            isActive(subItem.href)
                              ? "bg-blue-100 text-blue-700 font-medium"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          )}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-gray-500">Officier de Police</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher IMEI, numéro de série..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                  />
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Quick actions */}
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <RefreshCw className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Clock className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default PoliceLayout;
