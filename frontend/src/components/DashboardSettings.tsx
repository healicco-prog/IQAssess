import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle } from 'lucide-react';

export default function DashboardSettings({ isDarkMode }: { isDarkMode: boolean }) {
  const [config, setConfig] = useState({
    institution: '',
    course: '',
    subject: '',
    topic: ''
  });
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('iqassess_dashboard_config') || '{}');
      setConfig({
        institution: stored.institution || '',
        course: stored.course || '',
        subject: stored.subject || '',
        topic: stored.topic || ''
      });
    } catch(e) {}
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem('iqassess_dashboard_config', JSON.stringify(config));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
    // Reload the page to apply defaults to all mounted components that use getDashboardSetting
    window.location.reload();
  };

  return (
    <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0B0F19]/90 border-slate-800' : 'bg-white border-slate-200'} shadow-sm mt-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
          <Settings size={16} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-slate-800 dark:text-white">Global Institutional Configurations</h4>
          <p className="text-[10px] text-slate-500">Set the default values for all features across the IQAssess platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Default Institution Name</label>
          <input 
            type="text" 
            name="institution"
            value={config.institution} 
            onChange={handleChange}
            className={`w-full text-sm px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'} focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g. Akash Institute of Medical Science"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Default Course / Programme</label>
          <input 
            type="text" 
            name="course"
            value={config.course} 
            onChange={handleChange}
            className={`w-full text-sm px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'} focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g. Clinical Ethics"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Default Subject Name</label>
          <input 
            type="text" 
            name="subject"
            value={config.subject} 
            onChange={handleChange}
            className={`w-full text-sm px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'} focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g. Pharmacology"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Default Topic / Theme</label>
          <input 
            type="text" 
            name="topic"
            value={config.topic} 
            onChange={handleChange}
            className={`w-full text-sm px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'} focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g. Autonomic Nervous System"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-indigo-500/20"
        >
          <Save size={14} />
          Save Global Defaults
        </button>
        {savedMsg && (
          <span className="text-xs text-emerald-500 font-bold flex items-center gap-1 animate-fadeIn">
            <CheckCircle size={14} /> Saved & Applied!
          </span>
        )}
      </div>
    </div>
  );
}
