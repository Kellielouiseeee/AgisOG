import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Settings, Shield, Plus, Activity, Calendar } from 'lucide-react';
import clsx from 'clsx';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'config' | 'templates' | 'logs' | 'seasons'>('config');
  const [config, setConfig] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  
  const [newTemplate, setNewTemplate] = useState({
    title: '', description: '', baseXp: 100, baseCurrency: 50, difficulty: 'easy'
  });

  const fetchData = async () => {
    try {
      const [configRes, logsRes, tplRes, seasonsRes] = await Promise.all([
        axios.get('/api/admin/config'),
        axios.get('/api/admin/logs'),
        axios.get('/api/admin/templates'),
        axios.get('/api/admin/seasons')
      ]);
      setConfig(configRes.data);
      setLogs(logsRes.data);
      setTemplates(tplRes.data);
      setSeasons(seasonsRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdateConfig = async () => {
    if (!config) return;
    await axios.put('/api/admin/config', config);
    alert('Configuration Updated');
    fetchData();
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/admin/templates', { ...newTemplate, tags: ['custom'] });
    alert('Template Created');
    setNewTemplate({ title: '', description: '', baseXp: 100, baseCurrency: 50, difficulty: 'easy' });
    fetchData();
  };

  const handleToggleSeason = async (id: string, isActive: boolean) => {
    await axios.post(`/api/admin/seasons/${id}/toggle`, { isActive });
    fetchData();
  };

  if (!config) return <div className="p-8 text-white">Loading Admin Panel...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto text-slate-200">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Shield className="text-red-500" /> AGIS Command
        </h1>
        <p className="text-slate-400">Meta-Layer Control System</p>
      </header>

      <div className="flex gap-4 mb-8 border-b border-slate-700 pb-1 overflow-x-auto">
        <TabButton active={activeTab === 'config'} onClick={() => setActiveTab('config')} icon={<Settings size={18} />} label="System Config" />
        <TabButton active={activeTab === 'seasons'} onClick={() => setActiveTab('seasons')} icon={<Calendar size={18} />} label="Seasons & Events" />
        <TabButton active={activeTab === 'templates'} onClick={() => setActiveTab('templates')} icon={<Plus size={18} />} label="Mission Creator" />
        <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<Activity size={18} />} label="Audit Logs" />
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm min-h-[400px]">
        
        {/* CONFIG TAB */}
        {activeTab === 'config' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-xl">
            <h2 className="text-xl font-semibold text-white">Economy Safety</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Daily XP Cap</label>
                <input type="number" value={config.dailyXpCap} onChange={(e) => setConfig({ ...config, dailyXpCap: parseInt(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Base XP Multiplier</label>
                <input type="number" step="0.1" value={config.baseXpMultiplier} onChange={(e) => setConfig({ ...config, baseXpMultiplier: parseFloat(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
              </div>
              <button onClick={handleUpdateConfig} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-medium">Save Changes</button>
            </div>
          </motion.div>
        )}

        {/* SEASONS TAB */}
        {activeTab === 'seasons' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold text-white mb-4">Seasonal Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seasons.map(season => (
                <div key={season.id} className={clsx("p-4 rounded-lg border transition-all", season.isActive ? "bg-indigo-900/30 border-indigo-500" : "bg-slate-900 border-slate-700")}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white">{season.name}</h3>
                    <span className={clsx("px-2 py-1 rounded text-xs uppercase font-bold", season.isActive ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-400")}>
                      {season.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">{season.description}</p>
                  <div className="flex gap-4 text-xs font-mono text-slate-300 mb-4">
                    <span>XP: x{season.modifiers.xpMultiplier}</span>
                    <span>Currency: x{season.modifiers.currencyMultiplier}</span>
                  </div>
                  <button 
                    onClick={() => handleToggleSeason(season.id, !season.isActive)}
                    className={clsx("w-full py-2 rounded text-sm font-medium", season.isActive ? "bg-red-900/50 text-red-300 hover:bg-red-900" : "bg-indigo-600 text-white hover:bg-indigo-500")}
                  >
                    {season.isActive ? 'Deactivate Season' : 'Activate Season'}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Create Mission</h2>
              <form onSubmit={handleCreateTemplate} className="space-y-4 bg-slate-900 p-4 rounded-lg border border-slate-700">
                <input required placeholder="Title" className="w-full bg-slate-800 border border-slate-600 rounded p-2" 
                  value={newTemplate.title} onChange={e => setNewTemplate({...newTemplate, title: e.target.value})} />
                <textarea required placeholder="Description" className="w-full bg-slate-800 border border-slate-600 rounded p-2" 
                  value={newTemplate.description} onChange={e => setNewTemplate({...newTemplate, description: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="XP" className="w-full bg-slate-800 border border-slate-600 rounded p-2" 
                        value={newTemplate.baseXp} onChange={e => setNewTemplate({...newTemplate, baseXp: parseInt(e.target.value)})} />
                    <select className="w-full bg-slate-800 border border-slate-600 rounded p-2"
                        value={newTemplate.difficulty} onChange={e => setNewTemplate({...newTemplate, difficulty: e.target.value})}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded font-medium">Create</button>
              </form>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {templates.map(t => (
                    <div key={t.id} className="bg-slate-900 p-3 rounded border border-slate-700">
                        <div className="font-medium text-white">{t.title}</div>
                        <div className="text-xs text-slate-400 capitalize">{t.difficulty} • {t.baseXp} XP</div>
                    </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold text-white mb-4">Audit Logs</h2>
            <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800 text-slate-400"><tr><th className="p-3">Time</th><th className="p-3">Action</th><th className="p-3">Details</th></tr></thead>
                    <tbody className="divide-y divide-slate-800">
                        {logs.map(log => (
                            <tr key={log.id}>
                                <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                <td className="p-3 font-mono text-blue-400">{log.action}</td>
                                <td className="p-3 text-slate-500 truncate max-w-xs">{JSON.stringify(log.details)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={clsx("flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap", active ? "bg-slate-800 text-white border-b-2 border-blue-500" : "text-slate-400 hover:text-white hover:bg-slate-800/30")}>
    {icon} <span>{label}</span>
  </button>
);
