import React, { useState, useEffect } from 'react';
import { loadCurriculumData, saveCurriculumData, InstitutionNode } from './CurriculumManager';

interface CurriculumSelectorsProps {
  formState?: any;
  setFormState?: (newState: any) => void;

  institution?: string;
  setInstitution?: (v: string) => void;
  course?: string;
  setCourse?: (v: string) => void;
  subject?: string;
  setSubject?: (v: string) => void;
  topic?: string;
  setTopic?: (v: string) => void;

  isDarkMode?: boolean;
}

export const CurriculumSelectors: React.FC<CurriculumSelectorsProps> = ({ 
  formState, setFormState, 
  institution, setInstitution,
  course, setCourse,
  subject, setSubject,
  topic, setTopic,
  isDarkMode 
}) => {
  const [data, setData] = useState<InstitutionNode[]>([]);

  useEffect(() => {
    setData(loadCurriculumData());
  }, []);

  const inputClass = `w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500 leading-normal ${isDarkMode ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-stone-900'}`;
  const labelClass = "block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1";

  // Use either formState or individual props
  const currentInst = formState?.institution ?? institution ?? '';
  const currentCourse = formState?.className ?? course ?? '';
  const currentSubject = formState?.subject ?? subject ?? '';
  const currentTopic = formState?.topic ?? topic ?? '';

  const handleUpdate = (updates: any) => {
    if (formState && setFormState) {
      setFormState({ ...formState, ...updates });
    }
    if (updates.institution !== undefined && setInstitution) setInstitution(updates.institution);
    if (updates.className !== undefined && setCourse) setCourse(updates.className);
    if (updates.subject !== undefined && setSubject) setSubject(updates.subject);
    if (updates.topic !== undefined && setTopic) setTopic(updates.topic);
  };

  // Derived dependent options based on selected names
  const selectedInst = data.find(i => i.name === currentInst) || data[0];
  const courses = selectedInst?.courses || [];
  
  const selectedCourse = courses.find(c => c.name === currentCourse) || courses[0];
  const subjects = selectedCourse?.subjects || [];
  
  const selectedSubject = subjects.find(s => s.name === currentSubject) || subjects[0];
  const topics = selectedSubject?.topics || [];

  const handleSaveTopic = () => {
    if (!currentTopic.trim()) return;
    const topicExists = topics.some(t => t.name.toLowerCase() === currentTopic.trim().toLowerCase());
    if (topicExists) return;

    const savedData = loadCurriculumData();
    const instIndex = savedData.findIndex(i => i.name === currentInst);
    if (instIndex === -1) return;
    const courseIndex = savedData[instIndex].courses.findIndex(c => c.name === currentCourse);
    if (courseIndex === -1) return;
    const subjectIndex = savedData[instIndex].courses[courseIndex].subjects.findIndex(s => s.name === currentSubject);
    if (subjectIndex === -1) return;

    savedData[instIndex].courses[courseIndex].subjects[subjectIndex].topics.push({
      id: Date.now().toString(),
      name: currentTopic.trim()
    });

    saveCurriculumData(savedData);
    setData(savedData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Institution Name <span className="text-red-500 font-bold">*</span></label>
        <select
          value={currentInst}
          onChange={(e) => {
            const inst = e.target.value;
            const newCourses = data.find(i => i.name === inst)?.courses || [];
            const firstCourse = newCourses[0]?.name || '';
            const newSubjects = newCourses[0]?.subjects || [];
            const firstSubject = newSubjects[0]?.name || '';
            const newTopics = newSubjects[0]?.topics || [];
            const firstTopic = newTopics[0]?.name || '';
            
            handleUpdate({ 
              institution: inst,
              className: firstCourse,
              subject: firstSubject,
              topic: firstTopic
            });
          }}
          className={inputClass}
          required
        >
          <option value="" disabled>Select Institution</option>
          {data.map(inst => (
            <option key={inst.id} value={inst.name}>{inst.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Course / Programme <span className="text-red-500 font-bold">*</span></label>
        <select
          value={currentCourse}
          onChange={(e) => {
            const courseValue = e.target.value;
            const newSubjects = courses.find(c => c.name === courseValue)?.subjects || [];
            const firstSubject = newSubjects[0]?.name || '';
            const newTopics = newSubjects[0]?.topics || [];
            const firstTopic = newTopics[0]?.name || '';
            
            handleUpdate({ 
              className: courseValue,
              subject: firstSubject,
              topic: firstTopic
            });
          }}
          className={inputClass}
          required
          disabled={!currentInst}
        >
          <option value="" disabled>Select Course / Programme</option>
          {courses.map(crs => (
            <option key={crs.id} value={crs.name}>{crs.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Subject Name <span className="text-red-500 font-bold">*</span></label>
        <select
          value={currentSubject}
          onChange={(e) => {
            const subjectValue = e.target.value;
            const newTopics = subjects.find(s => s.name === subjectValue)?.topics || [];
            const firstTopic = newTopics[0]?.name || '';

            handleUpdate({ 
              subject: subjectValue,
              topic: firstTopic
            });
          }}
          className={inputClass}
          required
          disabled={!currentCourse}
        >
          <option value="" disabled>Select Subject</option>
          {subjects.map(sub => (
            <option key={sub.id} value={sub.name}>{sub.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Topic / Theme</label>
        <div className="flex gap-2">
          <input
            type="text"
            list="topic-options"
            value={currentTopic}
            onChange={(e) => handleUpdate({ topic: e.target.value })}
            className={inputClass}
            disabled={!currentSubject}
            placeholder="Enter or Select Topic / Theme (Optional)"
          />
          {currentTopic && !topics.some(t => t.name.toLowerCase() === currentTopic.trim().toLowerCase()) && (
            <button
              onClick={handleSaveTopic}
              title="Save this new topic to the database"
              className="px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] rounded-lg border border-indigo-200 dark:border-indigo-700 whitespace-nowrap transition-colors"
            >
              + Save Topic
            </button>
          )}
        </div>
        <datalist id="topic-options">
          {topics.map(top => (
            <option key={top.id} value={top.name} />
          ))}
        </datalist>
      </div>
    </div>
  );
};
