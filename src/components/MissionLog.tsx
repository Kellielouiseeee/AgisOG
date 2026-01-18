import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useStore } from '../store';
import { Target, AlertTriangle, Sparkles } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
  currencyReward: number;
  isSeasonal?: boolean;
}

export default function MissionLog() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const { completeMission, user } = useStore();

  useEffect(() => {
    // The backend now handles rotation logic. We just fetch.
    axios.get('/api/missions').then(res => {
        // API returns { missions: [], activeSeason: {} }
        setMissions(res.data.missions);
    });
  }, [user?.level]); 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Active Missions</h1>
        <div className="text-sm text-slate-400">
          Auto-generated for Level {user?.level || 1}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map(mission => (
          <div key={mission.id} className={`bg-slate-800 border rounded-xl p-6 transition-all hover:scale-[1.01] ${
              mission.isSeasonal ? 'border-indigo-500 shadow-lg shadow-indigo-900/20' : 'border-slate-700'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {mission.isSeasonal ? <Sparkles className="w-4 h-4 text-indigo-400" /> : <Target className="w-4 h-4 text-slate-400" />}
                  <h3 className="font-semibold text-white">{mission.title}</h3>
                </div>
                <p className="text-sm text-slate-400">{mission.description}</p>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    mission.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400' :
                    mission.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                }`}>
                    {mission.difficulty}
                </span>
                {mission.isSeasonal && <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Event</span>}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-4 text-sm">
                <span className="text-indigo-300 font-mono">+{mission.xpReward} XP</span>
                <span className="text-yellow-300 font-mono">+{mission.currencyReward} CR</span>
              </div>
              <button 
                onClick={() => completeMission(mission.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white ${
                    mission.isSeasonal ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-500">
          Safety Notice: Missions are subject to daily XP caps. If you exceed 1000 XP in a single day, further missions will not yield rewards until the daily reset (00:00 UTC).
        </p>
      </div>
    </div>
  );
}
