import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronRight, ChevronDown, Book, AlignLeft, LayoutGrid, Layers, Edit2, Check, X } from 'lucide-react';

export interface TopicNode {
  id: string;
  name: string;
}

export interface SubjectNode {
  id: string;
  name: string;
  topics: TopicNode[];
}

export interface CourseNode {
  id: string;
  name: string;
  subjects: SubjectNode[];
}

export interface InstitutionNode {
  id: string;
  name: string;
  logo?: string;
  courses: CourseNode[];
}

export const loadCurriculumData = (): InstitutionNode[] => {
  try {
    const data = localStorage.getItem('curriculumHierarchy');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return [];
};

export const saveCurriculumData = (data: InstitutionNode[]) => {
  localStorage.setItem('curriculumHierarchy', JSON.stringify(data));
};

export const CurriculumManager: React.FC = () => {
  const [data, setData] = useState<InstitutionNode[]>([]);
  
  useEffect(() => {
    setData(loadCurriculumData());
  }, []);

  const handleSave = (newData: InstitutionNode[]) => {
    setData(newData);
    saveCurriculumData(newData);
  };

  const [isInstModalOpen, setIsInstModalOpen] = useState(false);
  const [newInstName, setNewInstName] = useState('');
  const [newInstLogo, setNewInstLogo] = useState('');

  const openInstModal = () => {
    setNewInstName('');
    setNewInstLogo('');
    setIsInstModalOpen(true);
  };

  const handleAddInstitution = () => {
    if (newInstName.trim()) {
      handleSave([...data, { 
        id: Date.now().toString(), 
        name: newInstName.trim(), 
        logo: newInstLogo, 
        courses: [] 
      }]);
      setIsInstModalOpen(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewInstLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addCourse = (instId: string) => {
    const name = prompt("Enter new Course / Programme:");
    if (name) {
      const newData = data.map(inst => {
        if (inst.id === instId) {
          return { ...inst, courses: [...inst.courses, { id: Date.now().toString(), name, subjects: [] }] };
        }
        return inst;
      });
      handleSave(newData);
    }
  };

  const addSubject = (instId: string, courseId: string) => {
    const name = prompt("Enter new Subject Name:");
    if (name) {
      const newData = data.map(inst => {
        if (inst.id === instId) {
          return {
            ...inst,
            courses: inst.courses.map(crs => {
              if (crs.id === courseId) {
                return { ...crs, subjects: [...crs.subjects, { id: Date.now().toString(), name, topics: [] }] };
              }
              return crs;
            })
          };
        }
        return inst;
      });
      handleSave(newData);
    }
  };

  const addTopic = (instId: string, courseId: string, subjectId: string) => {
    const name = prompt("Enter new Topic / Theme:");
    if (name) {
      const newData = data.map(inst => {
        if (inst.id === instId) {
          return {
            ...inst,
            courses: inst.courses.map(crs => {
              if (crs.id === courseId) {
                return {
                  ...crs,
                  subjects: crs.subjects.map(sub => {
                    if (sub.id === subjectId) {
                      return { ...sub, topics: [...sub.topics, { id: Date.now().toString(), name }] };
                    }
                    return sub;
                  })
                };
              }
              return crs;
            })
          };
        }
        return inst;
      });
      handleSave(newData);
    }
  };

  const deleteNode = (type: 'inst' | 'course' | 'sub' | 'top', ids: { instId: string; courseId?: string; subjectId?: string; topicId?: string }) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    let newData = [...data];
    if (type === 'inst') {
      newData = newData.filter(i => i.id !== ids.instId);
    } else if (type === 'course' && ids.courseId) {
      newData = newData.map(i => i.id === ids.instId ? { ...i, courses: i.courses.filter(c => c.id !== ids.courseId) } : i);
    } else if (type === 'sub' && ids.courseId && ids.subjectId) {
      newData = newData.map(i => i.id === ids.instId ? {
        ...i, courses: i.courses.map(c => c.id === ids.courseId ? {
          ...c, subjects: c.subjects.filter(s => s.id !== ids.subjectId)
        } : c)
      } : i);
    } else if (type === 'top' && ids.courseId && ids.subjectId && ids.topicId) {
      newData = newData.map(i => i.id === ids.instId ? {
        ...i, courses: i.courses.map(c => c.id === ids.courseId ? {
          ...c, subjects: c.subjects.map(s => s.id === ids.subjectId ? {
            ...s, topics: s.topics.filter(t => t.id !== ids.topicId)
          } : s)
        } : c)
      } : i);
    }
    handleSave(newData);
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm border border-slate-200 dark:border-slate-800 font-sans space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-white flex items-center gap-2">
            <Layers size={18} className="text-blue-500" />
            Curriculum Hierarchy Configuration
          </h3>
          <p className="text-xs text-slate-500 mt-1">Define your global hierarchy: Institutions &rarr; Courses &rarr; Subjects &rarr; Topics.</p>
        </div>
        <button onClick={openInstModal} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition shadow cursor-pointer">
          <Plus size={14} /> Add Institution
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {data.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">No curriculum data configured. Click "Add Institution" to start.</div>
        ) : (
          data.map(inst => (
            <div key={inst.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 flex justify-between items-center group">
                <div className="flex items-center gap-3 font-bold text-slate-800 dark:text-slate-200">
                  {inst.logo ? (
                    <img src={inst.logo} alt="" className="w-5 h-5 rounded object-contain bg-white border border-slate-200" />
                  ) : (
                    <LayoutGrid size={16} className="text-blue-500" />
                  )}
                  {inst.name}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => addCourse(inst.id)} className="text-[10px] px-2 py-1 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 transition">
                    + Add Course
                  </button>
                  <button onClick={() => deleteNode('inst', { instId: inst.id })} className="text-[10px] px-2 py-1 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded text-red-500 font-bold hover:bg-red-50 transition">
                    Delete
                  </button>
                </div>
              </div>

              <div className="p-3 space-y-3">
                {inst.courses.length === 0 && <div className="text-xs text-slate-400 italic pl-6">No courses added.</div>}
                {inst.courses.map(course => (
                  <div key={course.id} className="pl-6 border-l-2 border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex justify-between items-center group">
                      <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                        <Book size={14} className="text-emerald-500" />
                        {course.name}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => addSubject(inst.id, course.id)} className="text-[10px] px-2 py-1 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-50 transition">
                          + Add Subject
                        </button>
                        <button onClick={() => deleteNode('course', { instId: inst.id, courseId: course.id })} className="text-[10px] text-red-400 hover:text-red-500 transition">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="pl-6 space-y-2">
                      {course.subjects.length === 0 && <div className="text-xs text-slate-400 italic">No subjects added.</div>}
                      {course.subjects.map(sub => (
                        <div key={sub.id} className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/80 p-2 space-y-2">
                          <div className="flex justify-between items-center group">
                            <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200 text-xs">
                              <AlignLeft size={13} className="text-purple-500" />
                              {sub.name}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                              <button onClick={() => addTopic(inst.id, course.id, sub.id)} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 border dark:border-slate-600 rounded text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-50 transition">
                                + Add Topic
                              </button>
                              <button onClick={() => deleteNode('sub', { instId: inst.id, courseId: course.id, subjectId: sub.id })} className="text-[10px] text-red-400 hover:text-red-500 transition">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="pl-6 flex flex-wrap gap-1.5">
                            {sub.topics.length === 0 && <div className="text-[10px] text-slate-400 italic">No topics added.</div>}
                            {sub.topics.map(top => (
                              <div key={top.id} className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-medium text-slate-600 dark:text-slate-400 group/topic">
                                {top.name}
                                <button onClick={() => deleteNode('top', { instId: inst.id, courseId: course.id, subjectId: sub.id, topicId: top.id })} className="opacity-0 group-hover/topic:opacity-100 text-red-400 hover:text-red-600 transition">
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {isInstModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Layers size={18} className="text-blue-500" />
              Add New Institution
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Institution Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={newInstName}
                  onChange={(e) => setNewInstName(e.target.value)}
                  placeholder="e.g. Akash Institute"
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Institution Logo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  {newInstLogo && (
                    <img src={newInstLogo} alt="Logo preview" className="w-12 h-12 rounded object-contain bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                  )}
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-800 dark:file:text-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setIsInstModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddInstitution}
                disabled={!newInstName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow cursor-pointer"
              >
                Save Institution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
