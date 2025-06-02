'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import BrowserExtensionBlocker from '@/components/BrowserExtensionBlocker';
import {
  Sparkles,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Layers,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Search
} from 'lucide-react';
import theme from '@/styles/theme';

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarLink = ({ href, icon, label, isActive, isCollapsed }: SidebarLinkProps) => {
  return (
    <Link href={href} className={`
      flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300
      ${isActive 
        ? 'bg-[#ededed] text-[#141414]' 
        : 'text-[#141414] hover:text-[#141414] hover:bg-[#e0e0e0]'}
    `}>
      <div className={`
        ${isActive 
          ? 'text-[#141414]' 
          : 'text-[#141414]'} 
        p-2 rounded-lg
      `}>
        {icon}
      </div>
      {!isCollapsed && (
        <span className={`${isActive ? 'font-medium' : ''} transition-all duration-300 text-[#141414]`}>
          {label}
        </span>
      )}
      {isActive && !isCollapsed && (
        <div className="ml-auto bg-[#141414] h-2 w-2 rounded-full"></div>
      )}
    </Link>
  );
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // If user is not authenticated, don't render the dashboard
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { href: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/dashboard/customers', icon: <Users size={20} />, label: 'Customers' },
    { href: '/dashboard/orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
    { href: '/dashboard/segment-rules', icon: <Layers size={20} />, label: 'Segments' },
    { href: '/dashboard/campaigns', icon: <MessageSquare size={20} />, label: 'Campaigns' },
    { href: '/dashboard/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { href: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <BrowserExtensionBlocker className="flex h-screen bg-[#f5f5f5] text-[#141414]">
      {/* Sidebar - Desktop */}
      <div className={`
        hidden md:flex flex-col border-r border-[#dbdbdb] bg-[#f5f5f5]
        transition-all duration-300 z-20
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        {/* Logo */}
        <div className={`
          p-4 flex items-center gap-3 border-b border-[#dbdbdb]
          ${isCollapsed ? 'justify-center' : ''}
        `}>
          <div className="relative">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-[#141414]">
              Mini CRM
            </h1>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto p-1 rounded-lg bg-[#ededed] hover:bg-[#e0e0e0] text-[#141414] transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        {/* User Profile & Logout */}
        <div className={`
          p-4 border-t border-[#dbdbdb] flex items-center gap-3
          ${isCollapsed ? 'justify-center' : ''}
        `}>
          {!isCollapsed && (
            <>
              <div className="w-10 h-10 rounded-full bg-[#ededed] flex items-center justify-center">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-[#141414]">{user.name?.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-[#141414]">{user.name}</p>
                <p className="text-xs text-[#737373] truncate">{user.email}</p>
              </div>
            </>
          )}
          <button 
            onClick={handleLogout}
            className={`
              p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors
              ${isCollapsed ? 'mx-auto' : ''}
            `}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-[#ededed] hover:bg-[#e0e0e0] text-[#141414] transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-20" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="w-64 h-full bg-[#f5f5f5] p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-[#141414]">
                Mini CRM
              </h1>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="ml-auto p-1 rounded-lg bg-[#ededed] hover:bg-[#e0e0e0] text-[#141414] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300
                    ${pathname === item.href 
                      ? 'bg-[#ededed] text-[#141414]' 
                      : 'text-[#141414] hover:text-[#141414] hover:bg-[#e0e0e0]'}
                  `}
                >
                  <div className={`
                    ${pathname === item.href 
                      ? 'text-[#141414]' 
                      : 'text-[#141414]'} 
                    p-2 rounded-lg
                  `}>
                    {item.icon}
                  </div>
                  <span className={pathname === item.href ? 'font-medium' : ''}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* User Profile & Logout */}
            <div className="mt-auto pt-6 border-t border-[#dbdbdb] mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#ededed] flex items-center justify-center">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-[#141414]">{user.name?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#141414]">{user.name}</p>
                  <p className="text-xs text-[#737373]">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-[#dbdbdb] bg-[#f5f5f5] flex items-center px-4 md:px-6">
          <div className="flex-1 flex items-center">
            <h2 className="text-xl font-bold text-[#141414]">
              {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
            </h2>
            <div className="ml-auto flex items-center gap-4">
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-[#737373]" />
                  </div>
                  <input 
                    type="search" 
                    className="block w-64 p-2 pl-10 text-sm border rounded-lg bg-white border-[#dbdbdb] placeholder-[#737373] text-[#141414] focus:ring-[#141414] focus:border-[#141414]" 
                    placeholder="Search..." 
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-[#f5f5f5]">
          {children}
        </main>
      </div>
    </BrowserExtensionBlocker>
  );
} 