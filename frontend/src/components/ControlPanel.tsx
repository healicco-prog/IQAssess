import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Lock, FileText, Users, Cpu, ArrowRight, Home, Settings, Link, LogOut, Search, UserPlus, X, Image as ImageIcon
} from 'lucide-react';

export const ControlPanel: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<'blogs' | 'users' | 'tokens'>('blogs');

  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogStatus, setBlogStatus] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [tags, setTags] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('assessments, university, education, schooling');

  const ALL_IMAGES = [
    '1523050854058-8df90110c9f1', '1503676260728-1c00da094a0b', '1427504494785-3a9ca7044f45',
    '1434030216411-0b793f4b4173', '1519389950473-47ba0277781c', '1497633762265-9d179a990aa6',
    '1588072432836-e10032774350', '1546410531-b3645b2323e2', '1473649085228-583485e6e4d7',
    '1509062522246-3755977927d7', '1511629091441-ee46146481b6', '1454165804606-c3d57bc86b40',
    '1501504905252-473c47e087f8', '1522202176988-66273c2fd55f', '1491841550275-ad7854e35ca6',
    '1532012197267-da84d127e765', '1524178232363-1fb2b075b655', '1522071820081-009f0129c71c',
    '1513258496099-481a80418140', '1558021212-514606647f90', '1531482615713-2afd69097998',
    '1486312338219-ce68d2c6f44d', '1432888117247-36a5addd600d', '1521737604893-d14cc237f11d',
    '1504851149312-7a075b496cc7', '1544396821-4dd40b938ad3', '1524995997946-a1c2e315a42f',
    '1552664730-d307ca884978', '1580894732444-8ec09b30752b', '1509869175650-a1d97972541a'
  ];

  const [displayImages, setDisplayImages] = useState(ALL_IMAGES.slice(0, 12));

  const handleSearchImages = () => {
    const shuffled = [...ALL_IMAGES].sort(() => 0.5 - Math.random());
    setDisplayImages(shuffled.slice(0, 12));
  };

  const handleLoadMoreImages = () => {
    const currentLength = displayImages.length;
    if (currentLength >= ALL_IMAGES.length) return;
    const nextImages = ALL_IMAGES.slice(currentLength, currentLength + 8);
    setDisplayImages([...displayImages, ...nextImages]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'drnarayanak@gmail.com' && password === 'Tata@#viDhya#2026') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleGenerateAI = async () => {
    let kw = primaryKeyword.trim();
    if (!kw) {
      kw = "Future of Educational Assessments with AI";
      setPrimaryKeyword(kw);
      setBlogStatus('Auto-filled default primary keyword...');
    }
    
    setIsGenerating(true);
    setBlogStatus('Generating blog via AI (This may take up to 30 seconds)...');
    try {
      const apiUrl = '/api/ai/generate-blog';
          
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primaryKeyword: kw, secondaryKeywords })
      });

      if (!response.ok) {
        let errorMsg = `AI Engine failed: ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData.details) errorMsg = errData.details;
          else if (errData.error) errorMsg = errData.error;
        } catch(e) {}
        throw new Error(errorMsg);
      }
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setBlogTitle(data.title || '');
      setBlogContent(data.content || '');
      setPrimaryKeyword(data.primaryKeyword || kw);
      setSecondaryKeywords(data.secondaryKeywords || '');
      setTags(data.tags || '');
      setBlogStatus('AI Generation Complete!');
    } catch (err: any) {
      console.error(err);
      alert('Generation Error: ' + err.message);
      setBlogStatus('Generation Error: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const publishBlog = async () => {
    if (!blogTitle.trim() || !blogContent.trim()) {
      setBlogStatus('Please fill in title and content.');
      return;
    }
    
    setBlogStatus('Publishing...');
    
    const newBlog = {
      id: blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4),
      title: blogTitle,
      excerpt: blogContent.substring(0, 115) + '...',
      content: blogContent,
      category: 'Assessment Development',
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : ['Education', 'AI'],
      author: { name: 'Dr. Narayana K (Super)', role: 'System Admin', avatar: 'DN' },
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: '3 min read',
      gradient: 'from-blue-600 to-indigo-700',
      likes: 0,
      views: 0,
      image: featuredImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 font-sans">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex items-center justify-center mb-6 text-[#1E3A8A]">
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
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-[#1E3A8A]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-[#1E3A8A]"
                required
              />
            </div>
            {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}
            <button type="submit" className="w-full bg-[#1E3A8A] hover:bg-blue-800 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition">
              Access Control Panel <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans bg-[#F8FAFC]">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="bg-[#1E3A8A] rounded-lg p-1.5 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-6 h-6 shrink-0">
              <circle cx="27" cy="25" r="7" fill="#3cdbce" />
              <rect x="21" y="38" width="12" height="40" rx="2" fill="#FFFFFF" />
              <circle cx="60" cy="53" r="24" fill="none" stroke="#FFFFFF" strokeWidth="11" />
              <path d="M 52 57 L 62 67 L 85 48" fill="none" stroke="#3cdbce" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-black text-[#0F172A]">IQAssess</span>
        </div>

        <div className="px-4 mb-6">
          <div className="border border-slate-200 rounded-xl p-3 flex flex-col items-center bg-slate-50/50">
            <h3 className="font-bold text-[#0F172A] text-sm">Dr. Narayana K (Super)</h3>
            <p className="text-[10px] text-slate-500 mb-2">drnarayanak@gmail.com</p>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase">Super Admin</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[9px] font-black uppercase">Premium</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <button className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 text-slate-600 hover:bg-slate-100 transition mb-4">
            <Home size={16} className="text-slate-400" />
            <span className="font-bold text-xs">Home Page</span>
          </button>
          
          <div className="px-3 pb-2 pt-2 text-[10px] font-black text-rose-500 uppercase tracking-widest">
            Super Admin
          </div>
          
          <button className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 text-slate-600 hover:bg-slate-100 transition">
            <Settings size={16} className="text-slate-400" />
            <span className="font-bold text-xs">LMS Auto-Gen</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('blogs')}
            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition ${activeTab === 'blogs' ? 'bg-slate-100 text-[#0F172A]' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <FileText size={16} className={activeTab === 'blogs' ? 'text-indigo-600' : 'text-slate-400'} />
            <span className={`text-xs ${activeTab === 'blogs' ? 'font-black' : 'font-bold'}`}>Blog Publications</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition ${activeTab === 'users' ? 'bg-slate-100 text-[#0F172A]' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Users size={16} className={activeTab === 'users' ? 'text-indigo-600' : 'text-slate-400'} />
            <span className={`text-xs ${activeTab === 'users' ? 'font-black' : 'font-bold'}`}>User Management</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('tokens')}
            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition ${activeTab === 'tokens' ? 'bg-slate-100 text-[#0F172A]' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Cpu size={16} className={activeTab === 'tokens' ? 'text-indigo-600' : 'text-slate-400'} />
            <span className={`text-xs ${activeTab === 'tokens' ? 'font-black' : 'font-bold'}`}>Token Economy</span>
          </button>

          <button className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 text-slate-600 hover:bg-slate-100 transition">
            <Link size={16} className="text-slate-400" />
            <span className="font-bold text-xs">Referral Network</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="w-full px-3 py-2 flex items-center gap-3 text-slate-600 hover:text-rose-600 transition font-bold text-xs"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
      
      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-xl font-black text-[#0F172A] flex items-center gap-3">
              Super Admin Dashboard
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold rounded-full flex items-center gap-1 uppercase tracking-wider">
                <Lock size={10} /> Control Panel
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Platform running in superadmin mode</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h4 className="font-black text-[#0F172A] text-sm leading-tight">Dr. Narayana K (Super)</h4>
              <p className="text-[10px] text-slate-400">drnarayanak@gmail.com</p>
              <div className="flex justify-end gap-1 mt-0.5">
                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[8px] font-black uppercase">Super Admin</span>
                <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[8px] font-black uppercase">Premium</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <Users size={18} />
            </div>
          </div>
        </header>

        {/* SCROLLABLE VIEW */}
        <div className="flex-1 overflow-auto p-8">

          {/* TAB: BLOGS */}
          {activeTab === 'blogs' && (
            <div className="max-w-6xl mx-auto space-y-6">
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                {/* Header Row */}
                <div className="p-6 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <h3 className="font-bold text-xl text-[#0F172A]">Create Article</h3>
                    <button 
                      onClick={handleGenerateAI}
                      disabled={isGenerating}
                      className="px-3 py-1.5 bg-[#f3f0ff] text-[#7c3aed] hover:bg-purple-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      {isGenerating ? '✨ Generating...' : '✨ Write with AI (SEO)'}
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-bold flex items-center gap-1.5 transition">
                      ⊗ Cancel
                    </button>
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-bold flex items-center gap-1.5 transition">
                      💾 Save Draft
                    </button>
                    <button 
                      onClick={publishBlog}
                      className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-lg text-sm font-bold flex items-center gap-1.5 transition"
                    >
                      🌐 Publish Now
                    </button>
                  </div>
                </div>

                {/* Content Row */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Main Editor */}
                  <div className="col-span-2 space-y-4">
                    <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[500px]">
                      {/* Title Input inside the box (like screenshot) */}
                      <div className="border-b border-slate-200 p-4">
                        <input 
                          type="text" 
                          value={blogTitle}
                          onChange={e => setBlogTitle(e.target.value)}
                          className="w-full text-2xl font-black text-[#0F172A] placeholder-slate-400 focus:outline-none" 
                          placeholder="Article Title..."
                        />
                      </div>
                      
                      {/* Toolbar */}
                      <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between text-sm text-slate-600 font-bold">
                        <div className="flex gap-4">
                          <button className="hover:text-slate-900">H2</button>
                          <button className="hover:text-slate-900">B</button>
                          <button className="hover:text-slate-900 italic font-serif">I</button>
                          <button className="hover:text-slate-900">List (ul)</button>
                          <button className="hover:text-slate-900">&lt;/&gt;</button>
                          <button className="hover:text-slate-900">Image</button>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-slate-300" defaultChecked />
                          <span className="text-indigo-600 text-xs">Mention IQAssess via AI</span>
                        </div>
                      </div>
                      
                      {/* Textarea */}
                      <textarea 
                        value={blogContent}
                        onChange={e => setBlogContent(e.target.value)}
                        className="flex-1 p-5 w-full bg-white resize-none focus:outline-none text-slate-600 text-base" 
                        placeholder="Write your amazing article here... Use HTML tags for formatting if needed."
                      />
                    </div>
                  </div>

                  {/* Right Column - Meta & SEO */}
                  <div className="col-span-1 space-y-5">
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-2 block tracking-wider uppercase">Primary Keyword</label>
                      <input 
                        type="text" 
                        value={primaryKeyword}
                        onChange={e => setPrimaryKeyword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none text-slate-600 placeholder-slate-400" 
                        placeholder="e.g. ethical issues in AI" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-2 block tracking-wider uppercase">Secondary Keywords (CSV)</label>
                      <input 
                        type="text" 
                        value={secondaryKeywords}
                        onChange={e => setSecondaryKeywords(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none text-slate-600 placeholder-slate-400" 
                        placeholder="AI ethics, healthcare AI ethics" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-2 block tracking-wider uppercase">Tags (CSV)</label>
                      <input 
                        type="text" 
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none text-slate-600 placeholder-slate-400" 
                        placeholder="AI, ethics, healthcare, technology" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-2 block tracking-wider uppercase">Featured Image URL</label>
                      <input 
                        type="text" 
                        value={featuredImage}
                        onChange={e => setFeaturedImage(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none text-slate-600 placeholder-slate-400 mb-3" 
                        placeholder="https://images.unsplash.com/..." 
                      />
                      <button 
                        onClick={() => setShowImageModal(true)}
                        className="w-full py-3 bg-[#5b21b6] hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 uppercase tracking-wide transition shadow-sm"
                      >
                        ✨ Search Online (IQAssess AI)
                      </button>
                    </div>
                    {blogStatus && <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">{blogStatus}</div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#0F172A]">User Management</h2>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#0F172A]">All Platform Users</h3>
                      <p className="text-xs text-slate-500">2 total users</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Search name, email, role..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-full text-xs focus:outline-none w-64 bg-slate-50" />
                    </div>
                    <button className="px-4 py-2 bg-[#2563EB] hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
                      <UserPlus size={14} /> Add User
                    </button>
                  </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Name</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Email</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Role</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Plan</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-sm text-[#0F172A]">Standard User</td>
                      <td className="p-4 text-sm text-slate-500">aimsrcpharmac@gmail.com</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-emerald-100 text-emerald-700">Student</span>
                      </td>
                      <td className="p-4">
                        <div className="text-xs font-bold text-slate-600">STANDARD (Default)</div>
                        <div className="text-[10px] text-slate-400">N/A</div>
                      </td>
                      <td className="p-4">
                        <button className="px-3 py-1 border border-indigo-200 text-indigo-600 rounded flex items-center gap-1 text-[10px] font-bold hover:bg-indigo-50">
                          Reset
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-sm text-[#0F172A]">Dr. Narayana K</td>
                      <td className="p-4 text-sm text-slate-500">drnarayanabjp@gmail.com</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-emerald-100 text-emerald-700">Student</span>
                      </td>
                      <td className="p-4">
                        <div className="text-xs font-bold text-slate-600">STANDARD (Default)</div>
                        <div className="text-[10px] text-slate-400">N/A</div>
                      </td>
                      <td className="p-4">
                        <button className="px-3 py-1 border border-indigo-200 text-indigo-600 rounded flex items-center gap-1 text-[10px] font-bold hover:bg-indigo-50">
                          Reset
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: TOKENS */}
          {activeTab === 'tokens' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-[#0F172A]">Token Economy</h2>
                  <p className="text-sm text-slate-500">Monitor and manage AI token balances across all user subscriptions.</p>
                </div>
                <button className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-600">
                  🔄 Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Today's Revenue</h3>
                  <p className="text-4xl font-black text-[#0F172A]">₹0</p>
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl">
                    📈
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Revenue This Week</h3>
                  <p className="text-4xl font-black text-emerald-600">₹198</p>
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl">
                    📅
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Revenue This Month</h3>
                  <p className="text-4xl font-black text-rose-500">₹198</p>
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-xl">
                    💰
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-200">
                  <button className="px-6 py-4 border-b-2 border-emerald-500 text-emerald-600 font-bold text-sm flex items-center gap-2">
                    💳 Payment Orders
                  </button>
                  <button className="px-6 py-4 text-slate-500 hover:text-slate-800 font-bold text-sm flex items-center gap-2 transition">
                    👥 User Wallets
                  </button>
                  <button className="px-6 py-4 text-slate-500 hover:text-slate-800 font-bold text-sm flex items-center gap-2 transition">
                    ⚙️ Plan Allotments
                  </button>
                </div>
                
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Date</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">User</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Amount</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Package</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Razorpay ID</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="text-xs text-slate-500">7/14/2026,</div>
                        <div className="text-xs text-slate-500">10:42:51 PM</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-sm text-[#0F172A]">Dr. Narayana BJP</div>
                        <div className="text-[11px] text-slate-500">drnarayanabjp@gmail.com</div>
                      </td>
                      <td className="p-4 font-black text-sm text-[#0F172A]">₹99</td>
                      <td className="p-4 font-bold text-xs text-[#2563EB]">CREDITS_100</td>
                      <td className="p-4 text-xs text-slate-500 font-mono">order_TDSdLAaDZtf7hz</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded border border-emerald-200 bg-emerald-50 text-emerald-600">PAID</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="text-xs text-slate-500">7/14/2026,</div>
                        <div className="text-xs text-slate-500">10:09:27 PM</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-sm text-[#0F172A]">Dr. Narayana BJP</div>
                        <div className="text-[11px] text-slate-500">drnarayanabjp@gmail.com</div>
                      </td>
                      <td className="p-4 font-black text-sm text-[#0F172A]">₹99</td>
                      <td className="p-4 font-bold text-xs text-[#2563EB]">CREDITS_100</td>
                      <td className="p-4 text-xs text-slate-500 font-mono">order_TDS43ghwK9QSVp</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded border border-emerald-200 bg-emerald-50 text-emerald-600">PAID</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* IMAGE SEARCH MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#5b21b6] text-white rounded-lg flex items-center justify-center">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#0F172A]">IQAssess AI Image Search</h3>
                  <p className="text-xs text-slate-500 font-medium">1,245+ high-quality images found for this topic</p>
                </div>
              </div>
              <button 
                onClick={() => setShowImageModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 border-b border-slate-100">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchImages()}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#5b21b6] focus:bg-white transition"
                />
                <button 
                  onClick={handleSearchImages}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-[#5b21b6] hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition"
                >
                  Search
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {displayImages.map((id, index) => (
                  <button 
                    key={index}
                    onClick={() => {
                      setFeaturedImage(`https://images.unsplash.com/photo-${id}?w=800&q=80`);
                      setShowImageModal(false);
                    }}
                    className="group relative aspect-video bg-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition focus:outline-none focus:ring-4 focus:ring-purple-200"
                  >
                    <img 
                      src={`https://images.unsplash.com/photo-${id}?w=400&q=80`} 
                      alt="Education cover" 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition">
                        USE IMAGE
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {displayImages.length < ALL_IMAGES.length && (
                <div className="mt-8 text-center pb-4">
                  <button 
                    onClick={handleLoadMoreImages}
                    className="px-5 py-2 border border-slate-200 text-slate-600 rounded-full text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Load More Images...
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
