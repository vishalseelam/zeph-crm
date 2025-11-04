import { Link, useLocation } from 'react-router-dom';
import { Users, Layers, Activity, LayoutDashboard } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Funnel', path: '/funnel', icon: Activity },
    { name: 'Cohort', path: '/cohort', icon: Layers },
  ];
  
  const isActive = (path) => location.pathname.startsWith(path);
  
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <header className="bg-white border-b border-corporate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Zeph" className="h-8 w-auto" />
              <div className="border-l border-corporate-300 pl-3">
                <h1 className="text-base font-bold text-brand-primary">Patient CRM</h1>
              </div>
            </div>
            
            <nav className="flex space-x-0.5">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                      isActive(item.path)
                        ? 'bg-brand-primary text-white'
                        : 'text-brand-primary hover:bg-brand-accent hover:bg-opacity-20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {children}
      </main>
      
      <footer className="bg-white border-t border-corporate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-center text-xs text-corporate-500">
            © 2024 Zeph Breath. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}


