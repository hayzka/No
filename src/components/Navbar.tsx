import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/', label: 'Feed' },
    { icon: Search, path: '/search', label: 'Search' },
    { icon: MessageCircle, path: '/chat', label: 'Chat' },
    { icon: User, path: `/profile/${user?.username}`, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-black/5 dark:border-white/5 z-50 px-6 pb-safe">
      <div className="max-w-xl mx-auto h-20 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-16 transition-all duration-300",
                isActive ? "text-accent scale-110" : "text-gray-400 dark:text-gray-500 hover:text-gray-600"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(
                "text-[8px] font-bold uppercase tracking-[0.2em] mt-1.5 transition-opacity",
                isActive ? "opacity-100" : "opacity-0"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
