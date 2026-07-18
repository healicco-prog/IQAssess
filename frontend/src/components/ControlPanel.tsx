import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, FileText, Users, Cpu, ArrowRight } from 'lucide-react';

export const ControlPanel: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<'blogs' | 'users' | 'tokens'>('blogs');

  // Dummy blog form
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogStatus, setBlogStatus] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'drnarayanak@gmail.com' && password === 'Tata@#viDhya#2026') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const publishBlog = async () => {
    if (!blogTitle.trim() || !blogContent.trim()) {
      setBlogStatus('Please fill in title and content.');
      return;
    }
    
    setBlogStatus('Publishing...');
    
    const newBlog = {
      title: blogTitle,
      excerpt: blogContent.substring(0, 100) + '...',
      content: blogContent,
      category: 'General',
      author: { name: 'Super Admin', role: 'System Admin', avatar: 'SA' },
      publish_date: new Date().toISOString(),
      read_time: '2 min read',
      gradient: 'from-blue-600 to-indigo-700',
      likes: 0,
      views: 0
    };

    const { error } = await supabase.from('blogs').insert([newBlog]);
    if (error) {
      setBlogStatus('Error publishing: ' + error.message);
    } else {
      setBlogStatus('Successfully published!');
      setBlogTitle('');
      setBlogContent('');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
            <Lock size={48} />
          </div>
          <h2 className="text-2xl font-black text-center text-slate-800 dark:text-white mb-6">Super Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-950 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-950 text-slate-900 dark:text-white"
                required
              />
            </div>
            {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2">
              Access Control Panel <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6 shrink-0 flex flex-col">
        <h2 className="text-xl font-black mb-8">Control Panel</h2>
        
        <nav className="space-y-2 flex-grow">
          <button 
            onClick={() => setActiveTab('blogs')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'blogs' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}
          >
            <FileText size={18} />
            <span className="font-semibold text-sm">Blog Publication</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'users' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}
          >
            <Users size={18} />
            <span className="font-semibold text-sm">User Management</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('tokens')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'tokens' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}
          >
            <Cpu size={18} />
            <span className="font-semibold text-sm">Token Economy</span>
          </button>
        </nav>
        
        <button 
          onClick={() => setIsLoggedIn(false)}
          className="w-full py-2 bg-slate-800 hover:bg-rose-600 rounded-lg font-bold text-sm transition"
        >
          Logout
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8 text-slate-800 dark:text-slate-200 overflow-auto">
        
        {activeTab === 'blogs' && (
          <div className="max-w-3xl">
            <h1 className="text-2xl font-black mb-6">Blog Publication</h1>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Blog Title</label>
                <input 
                  type="text" 
                  value={blogTitle}
                  onChange={e => setBlogTitle(e.target.value)}
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-950" 
                  placeholder="Enter title here..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Markdown Content</label>
                <textarea 
                  value={blogContent}
                  onChange={e => setBlogContent(e.target.value)}
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-950 min-h-[300px]" 
                  placeholder="Write the blog post in markdown..."
                />
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={publishBlog}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition"
                >
                  Publish Now
                </button>
                {blogStatus && <span className="text-sm font-semibold text-indigo-500">{blogStatus}</span>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h1 className="text-2xl font-black mb-6">User Management</h1>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 text-sm">Showing all users of IQAssess.</p>
              
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3 text-xs uppercase text-slate-400">User Email</th>
                      <th className="p-3 text-xs uppercase text-slate-400">Role</th>
                      <th className="p-3 text-xs uppercase text-slate-400">Institution</th>
                      <th className="p-3 text-xs uppercase text-slate-400">Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-semibold text-sm">aimsrcpharmac@gmail.com</td>
                      <td className="p-3 text-sm text-slate-500">Clinical Assessor</td>
                      <td className="p-3 text-sm text-slate-500">Pacific West Medical College</td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-[10px] font-black uppercase rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">Standard</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-semibold text-sm">drnarayanabjp@gmail.com</td>
                      <td className="p-3 text-sm text-slate-500">Premium User</td>
                      <td className="p-3 text-sm text-slate-500">Metropolitan Academic Board</td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-[10px] font-black uppercase rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">Premium</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div>
            <h1 className="text-2xl font-black mb-6">Token Economy</h1>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 text-sm mb-6">AI Tokens used by the users across the assessment platform.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                  <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Total Network Tokens</h3>
                  <p className="text-3xl font-black text-indigo-700 dark:text-indigo-400">12,450,000</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                  <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">Standard Users (Avg/mo)</h3>
                  <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400">45,000</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                  <h3 className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-1">Premium Users (Avg/mo)</h3>
                  <p className="text-3xl font-black text-purple-700 dark:text-purple-400">320,000</p>
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-4">Highest Token Consumers</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3 text-xs uppercase text-slate-400">User Email</th>
                      <th className="p-3 text-xs uppercase text-slate-400">Model Used</th>
                      <th className="p-3 text-xs uppercase text-slate-400 text-right">Tokens Consumed</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-semibold text-sm">drnarayanabjp@gmail.com</td>
                      <td className="p-3 text-sm text-slate-500">gemini-3.5-flash</td>
                      <td className="p-3 text-sm font-mono text-right text-indigo-600 dark:text-indigo-400">845,210</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-semibold text-sm">aimsrcpharmac@gmail.com</td>
                      <td className="p-3 text-sm text-slate-500">gemini-3.5-flash</td>
                      <td className="p-3 text-sm font-mono text-right text-indigo-600 dark:text-indigo-400">120,400</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
