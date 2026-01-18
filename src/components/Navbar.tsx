import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Map, User as UserIcon } from 'lucide-react';
import { useStore } from '../store';

export default function Navbar() {
  const { user } = useStore();

  return (
    &lt;nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50"&gt;
      &lt;div className="container mx-auto px-4 h-16 flex items-center justify-between"&gt;
        &lt;div className="flex items-center gap-8"&gt;
          &lt;Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-400"&gt;
            &lt;Shield className="w-6 h-6" /&gt;
            AGIS
          &lt;/Link&gt;
          &lt;div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400"&gt;
            &lt;Link to="/" className="hover:text-white transition-colors"&gt;Dashboard&lt;/Link&gt;
            &lt;Link to="/missions" className="hover:text-white transition-colors"&gt;Missions&lt;/Link&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        {user && (
          &lt;div className="flex items-center gap-4"&gt;
            &lt;div className="flex flex-col items-end"&gt;
              &lt;span className="text-xs text-slate-500 uppercase tracking-wider font-bold"&gt;Level {user.level}&lt;/span&gt;
              &lt;div className="flex items-center gap-2"&gt;
                &lt;span className="text-yellow-400 font-mono"&gt;{user.currency} CR&lt;/span&gt;
              &lt;/div&gt;
            &lt;/div&gt;
            &lt;div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700"&gt;
              &lt;UserIcon className="w-5 h-5 text-slate-400" /&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        )}
      &lt;/div&gt;
    &lt;/nav&gt;
  );
}
