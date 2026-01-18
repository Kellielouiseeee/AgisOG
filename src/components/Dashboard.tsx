import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Activity, Trophy, Calendar, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const { user } = useStore();
  const [activeSeason, setActiveSeason] = useState<any>(null);

  useEffect(() => {
    // Check for active season
    axios.get('/api/admin/seasons').then(res => {
        const active = res.data.find((s: any) => s.isActive);
        setActiveSeason(active);
    });
  }, []);

  if (!user) return <div className="p-8 text-center text-slate-500">Loading AGIS Profile...</div>;

  const xpProgress = (user.xp / (user.level * 500)) * 100;
  const dailyCapProgress = (user.dailyStats.xpEarned / 1000) * 100;

  return (
    <div className="space-y-8">
      {/* SEASON BANNER */}
      {activeSeason && (
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-6 border border-indigo-500/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20"><Sparkles size={100} /></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase text-xs tracking-wider mb-1">
                    <Calendar size={14} /> Seasonal Event Active
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{activeSeason.name}</h2>
                <p className="text-indigo-200 max-w-xl">{activeSeason.description}</p>
                <div className="flex gap-4 mt-4">
                    <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-mono border border-indigo-500/30">
                        XP Boost: x{activeSeason.modifiers.xpMultiplier}
                    </span>
                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-mono border border-purple-500/30">
                        Currency Boost: x{activeSeason.modifiers.currencyMultiplier}
                    </span>
                </div>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Stats Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="w-24 h-24" />
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Current Level</h3>
          <div className="text-4xl font-bold text-white mb-4">{user.level}</div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>XP Progress</span>
              <span>{user.xp} / {user.level * 500}</span>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-1000 ease-out"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Economy Safety Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
           <h3 className="text-slate-400 text-sm font-medium mb-1">Daily Safety Cap</h3>
           <div className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
             {user.dailyStats.xpEarned} <span className="text-slate-500 text-lg">/ 1000 XP</span>
           </div>
           <div className="space-y-2">
             <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-1000 ease-out ${dailyCapProgress >= 100 ? 'bg-red-500' : 'bg-emerald-500'}`}
                 style={{ width: `${Math.min(dailyCapProgress, 100)}%` }}
               />
             </div>
             <p className="text-xs text-slate-500">
               {dailyCapProgress >= 100 
                 ? "You've reached the daily safety limit. Rest up!" 
                 : "Earn more XP to reach your daily limit."}
             </p>
           </div>
        </div>

        {/* Streak Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
           <h3 className="text-slate-400 text-sm font-medium mb-1">Active Streak</h3>
           <div className="text-4xl font-bold text-white mb-2">{user.streak} Days</div>
           <p className="text-xs text-slate-500">Come back tomorrow to keep it going.</p>
        </div>
      </div>

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 text-center">
        <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Recent Activity</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Your recent missions and achievements will appear here. Head to the Missions tab to start your journey.
        </p>
      </div>
    </div>
  );
}
