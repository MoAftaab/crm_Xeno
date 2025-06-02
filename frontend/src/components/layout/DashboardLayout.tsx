import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Target, 
  Mail, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return pathname?.startsWith(path) 
      ? 'bg-blue-600 text-white' 
      : 'text-gray-300 hover:bg-gray-800 hover:text-white';
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Customers', href: '/dashboard/customers', icon: Users },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Segments', href: '/dashboard/segments', icon: Target },
    { name: 'Campaigns', href: '/dashboard/campaigns', icon: Mail },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 z-10">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-800">
            <Link href="/dashboard" className="text-xl font-bold tracking-tight text-blue-500">
              Xeno CRM
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive(item.href)}`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-2 py-4 border-t border-gray-800">
            <button
              onClick={() => logout()}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
