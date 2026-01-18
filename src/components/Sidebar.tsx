import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, User, Shield, Package } from 'lucide-react';
import clsx from 'clsx';

export const Sidebar = () => {
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/missions', icon: Target, label: 'Missions' },
    { to: '/inventory', icon: Package, label: 'Collection' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/admin', icon: Shield, label: 'Admin', className: 'mt-8 text-red-400 hover:text-red-300' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-4">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          AGIS
        </h1>
        <p className="text-xs text-slate-500 tracking-wider mt-1">SYSTEM ONLINE</p>
      </div>
      
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
                link.className
              )
            }
          >
            <link.icon size={20} />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-auto px-4 py-4 border-t border-slate-800">
        <div className="text-xs text-slate-600">
          v0.1.0-alpha
          <br />
          Secure Connection
        </div>
      </div>
    </aside>
  );
};
