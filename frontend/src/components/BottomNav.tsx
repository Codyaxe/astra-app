import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/id', label: 'Digital ID' },
  { path: '/points', label: 'Points' },
  { path: '/marketplace', label: 'Perks' },
  { path: '/astrascend', label: 'Hub' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/95 backdrop-blur border-t border-slate-800 z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium transition-colors ${
                isActive ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
