const fs = require('fs');

let content = fs.readFileSync('frontend/src/App.tsx', 'utf-8');

// 1. ADD STATE VARIABLES
const stateTarget = `  const [omrShowRollNo, setOmrShowRollNo] = useState<boolean>(true);
  const [omrRollNoDigits, setOmrRollNoDigits] = useState<number>(3);`;
const stateReplace = `  const [omrShowRollNo, setOmrShowRollNo] = useState<boolean>(true);
  const [omrRollNoDigits, setOmrRollNoDigits] = useState<number>(3);
  
  // OMR Config Additions
  const [omrInstitutionId, setOmrInstitutionId] = useState<string>('');
  const [omrCourseId, setOmrCourseId] = useState<string>('');
  const [omrSubjectId, setOmrSubjectId] = useState<string>('');
  const [omrTopicId, setOmrTopicId] = useState<string>('');
  
  const [omrShowInstitution, setOmrShowInstitution] = useState<boolean>(true);
  const [omrShowLogo, setOmrShowLogo] = useState<boolean>(true);
  const [omrShowCourse, setOmrShowCourse] = useState<boolean>(true);
  const [omrShowSubject, setOmrShowSubject] = useState<boolean>(true);
  const [omrShowTopic, setOmrShowTopic] = useState<boolean>(true);
  const [omrShowDate, setOmrShowDate] = useState<boolean>(true);
  const [omrShowCustomFields, setOmrShowCustomFields] = useState<boolean>(true);
  
  const [omrExamDate, setOmrExamDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [omrCustomFields, setOmrCustomFields] = useState<string[]>(['STUDENT NAME', 'BATCH / SECTION', 'CLASS ROLL NO', 'REG NO']);
  const [omrNewField, setOmrNewField] = useState<string>('');
  
  const [omrNumQuestions, setOmrNumQuestions] = useState<number>(50);
  const [omrNumOptions, setOmrNumOptions] = useState<number>(4);
  const [omrSheetsPerA4, setOmrSheetsPerA4] = useState<number>(1);`;

content = content.replace(stateTarget, stateReplace);


// Helper for preview names
const previewHelperTarget = `  // OMR PDF and JPEG export handlers`;
const previewHelperReplace = `  // Get names for OMR preview
  const getOmrPreviewData = () => {
    let institutionObj = curriculumHierarchy.find(i => i.id === omrInstitutionId);
    let courseObj = institutionObj?.courses.find(c => c.id === omrCourseId);
    let subjectObj = courseObj?.subjects.find(s => s.id === omrSubjectId);
    let topicObj = subjectObj?.topics.find(t => t.id === omrTopicId);
    return {
      instName: institutionObj?.name || omrInstitutionName || 'Institution Name',
      logo: institutionObj?.logo || null,
      courseName: courseObj?.name || 'Course Name',
      subjectName: subjectObj?.name || 'Subject Name',
      topicName: topicObj?.name || 'Topic Name'
    };
  };
  const omrPreviewData = getOmrPreviewData();

  // OMR PDF and JPEG export handlers`;
content = content.replace(previewHelperTarget, previewHelperReplace);


// 2. LEFT CONFIG PANEL
const leftConfigTargetStart = `<div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Institution Name</label>`;
const leftConfigTargetEnd = `                            <Image size={13} className="text-amber-500" /> 
                            {isExportingImage ? 'JPEG...' : 'Export JPEG'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              window.print && window.print();
                              triggerAlert('success', 'Launching print spooler. Keep margins "None" & headers unchecked.');
                            }}
                            className="p-2.5 bg-white border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Printer size={13} className="text-emerald-500" /> Print Layout
                          </button>
                        </div>
                      </div>
                    </div>`;

// Ensure we get the full substring
const startIndex = content.indexOf(leftConfigTargetStart);
const endIndex = content.indexOf(leftConfigTargetEnd) + leftConfigTargetEnd.length;

if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    const leftConfigTarget = content.substring(startIndex, endIndex);

    const leftConfigReplace = `<div className="space-y-4 custom-scrollbar max-h-[800px] overflow-y-auto pr-2">
                      {/* Top Section */}
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl space-y-3 border dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Top Section: Header & Branding</span>
                        
                        <div className="space-y-3">
                          <CurriculumSelectors 
                            institution={omrInstitutionId} setInstitution={setOmrInstitutionId}
                            course={omrCourseId} setCourse={setOmrCourseId}
                            subject={omrSubjectId} setSubject={setOmrSubjectId}
                            topic={omrTopicId} setTopic={setOmrTopicId}
                            isDarkMode={isDarkMode}
                            returnIds={true}
                          />

                          <div className="pt-2 border-t dark:border-slate-800 space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visibility Toggles</span>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300"><input type="checkbox" checked={omrShowInstitution} onChange={(e) => setOmrShowInstitution(e.target.checked)} className="rounded" /> Institution</label>
                              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300"><input type="checkbox" checked={omrShowLogo} onChange={(e) => setOmrShowLogo(e.target.checked)} className="rounded" /> Logo</label>
                              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300"><input type="checkbox" checked={omrShowCourse} onChange={(e) => setOmrShowCourse(e.target.checked)} className="rounded" /> Course</label>
                              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300"><input type="checkbox" checked={omrShowSubject} onChange={(e) => setOmrShowSubject(e.target.checked)} className="rounded" /> Subject</label>
                              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300"><input type="checkbox" checked={omrShowTopic} onChange={(e) => setOmrShowTopic(e.target.checked)} className="rounded" /> Topic</label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Section */}
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl space-y-3 border dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Second Section: Examination Details</span>
                        
                        <div>
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            <input type="checkbox" checked={omrShowDate} onChange={(e) => setOmrShowDate(e.target.checked)} className="rounded" /> Date of Examination
                          </label>
                          {omrShowDate && (
                            <input 
                              type="date" 
                              value={omrExamDate}
                              onChange={(e) => setOmrExamDate(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                          )}
                        </div>

                        <div>
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            <input type="checkbox" checked={omrShowCustomFields} onChange={(e) => setOmrShowCustomFields(e.target.checked)} className="rounded" /> Student Fill-In Fields
                          </label>
                          {omrShowCustomFields && (
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1.5">
                                {omrCustomFields.map((f, i) => (
                                  <div key={i} className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 text-[10px] px-2 py-0.5 rounded-full text-slate-700 dark:text-slate-300">
                                    {f}
                                    <button onClick={() => setOmrCustomFields(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700"><X size={10} /></button>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={omrNewField}
                                  onChange={(e) => setOmrNewField(e.target.value)}
                                  placeholder="e.g. Center Code"
                                  className="flex-1 px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && omrNewField.trim()) {
                                      setOmrCustomFields(prev => [...prev, omrNewField.trim().toUpperCase()]);
                                      setOmrNewField('');
                                    }
                                  }}
                                />
                                <button 
                                  onClick={() => {
                                    if (omrNewField.trim()) {
                                      setOmrCustomFields(prev => [...prev, omrNewField.trim().toUpperCase()]);
                                      setOmrNewField('');
                                    }
                                  }}
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Third Section */}
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl space-y-3 border dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Third Section: Grids & Layout</span>
                        
                        <div className="space-y-3 border-b dark:border-slate-800 pb-3">
                          <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={omrShowRollNo} 
                                onChange={(e) => setOmrShowRollNo(e.target.checked)}
                                className="rounded" 
                              />
                              <span className="font-bold">Roll Number Grid</span>
                            </div>
                            {omrShowRollNo && (
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500">Digits:</span>
                                <input 
                                  type="number" min="1" max="15"
                                  value={omrRollNoDigits}
                                  onChange={(e) => setOmrRollNoDigits(Math.max(1, parseInt(e.target.value) || 1))}
                                  className="w-14 px-1.5 py-0.5 text-xs border rounded-md bg-white dark:bg-slate-900 text-center"
                                />
                              </div>
                            )}
                          </label>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pb-3 border-b dark:border-slate-800">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Total Questions</label>
                            <input 
                              type="number" min="1" max="200"
                              value={omrNumQuestions}
                              onChange={(e) => setOmrNumQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full px-2 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Total Options</label>
                            <input 
                              type="number" min="2" max="10"
                              value={omrNumOptions}
                              onChange={(e) => setOmrNumOptions(Math.max(2, parseInt(e.target.value) || 2))}
                              className="w-full px-2 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Sheets per A4 Page</label>
                          <select 
                            value={omrSheetsPerA4}
                            onChange={(e) => setOmrSheetsPerA4(parseInt(e.target.value))}
                            className="w-full px-2 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 font-bold"
                          >
                            <option value={1}>1 Sheet (Full Page)</option>
                            <option value={2}>2 Sheets (Half Page)</option>
                            <option value={4}>4 Sheets (Quarter Page)</option>
                          </select>
                        </div>
                      </div>

                      {/* Export Suite */}
                      <div className="pt-2 space-y-2.5">
                        <button
                          type="button"
                          disabled={isExportingPdf || isExportingImage}
                          onClick={handleExportOmrAsPDF}
                          className="w-full p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
                        >
                          <Download size={13} className="text-white" />
                          {isExportingPdf ? 'Rendering PDF...' : 'Download OMR Sheet as PDF'}
                        </button>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            disabled={isExportingPdf || isExportingImage}
                            onClick={handleExportOmrAsImage}
                            className="p-2.5 bg-white border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Image size={13} className="text-amber-500" /> 
                            {isExportingImage ? 'JPEG...' : 'Export JPEG'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              window.print && window.print();
                              triggerAlert('success', 'Launching print spooler. Keep margins "None" & headers unchecked.');
                            }}
                            className="p-2.5 bg-white border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Printer size={13} className="text-emerald-500" /> Print Layout
                          </button>
                        </div>
                      </div>
                    </div>`;

    content = content.replace(leftConfigTarget, leftConfigReplace);
} else {
    console.log("Left Config not found!");
}

// 3. RIGHT PREVIEW PANEL
const rightPreviewTargetStart = `<div className="border-2 border-stone-900 dark:border-stone-100 p-4 text-center space-y-1 bg-stone-50/50 dark:bg-slate-900/30">
                        <h2 className="text-sm font-extrabold uppercase font-mono tracking-tight text-stone-900 dark:text-white">
                          {omrInstitutionName || "St. Johns College of Pharmacy"}
                        </h2>`;
const rightPreviewTargetEnd = `                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>`;

const startIdxRight = content.indexOf(rightPreviewTargetStart);
const endIdxRight = content.indexOf(rightPreviewTargetEnd) + rightPreviewTargetEnd.length;

if (startIdxRight !== -1 && endIdxRight !== -1 && endIdxRight > startIdxRight) {
    const rightPreviewTarget = content.substring(startIdxRight, endIdxRight);

    const rightPreviewReplace = `<div className="border-2 border-stone-900 dark:border-stone-100 p-4 text-center space-y-1 bg-stone-50/50 dark:bg-slate-900/30 flex flex-col items-center justify-center">
                        {(omrShowInstitution || omrShowLogo) && (
                          <div className="flex items-center justify-center gap-3 w-full">
                            {omrShowLogo && omrPreviewData.logo && (
                              <img src={omrPreviewData.logo} alt="Logo" className="w-10 h-10 object-contain rounded bg-white mix-blend-multiply dark:mix-blend-normal" />
                            )}
                            {omrShowInstitution && (
                              <h2 className="text-sm font-extrabold uppercase font-mono tracking-tight text-stone-900 dark:text-white">
                                {omrPreviewData.instName}
                              </h2>
                            )}
                          </div>
                        )}
                        
                        {(omrShowCourse || omrShowSubject || omrShowTopic) && (
                          <div className="flex flex-wrap justify-center items-center gap-2 text-[10px] font-bold text-stone-700 dark:text-slate-300 font-sans mt-1">
                            {omrShowCourse && <span>{omrPreviewData.courseName}</span>}
                            {omrShowCourse && omrShowSubject && <span className="opacity-50">|</span>}
                            {omrShowSubject && <span>{omrPreviewData.subjectName}</span>}
                            {omrShowSubject && omrShowTopic && <span className="opacity-50">|</span>}
                            {omrShowTopic && <span>{omrPreviewData.topicName}</span>}
                          </div>
                        )}
                        <div className="h-0.5 bg-stone-900 dark:bg-stone-100 my-1 w-full max-w-sm mx-auto mt-2"></div>
                        <p className="text-[8px] font-mono tracking-wider text-stone-500 dark:text-slate-400 uppercase">
                          OPTICAL MARK RECOGNITION (OMR) ANSWER SHEET
                        </p>
                      </div>

                      {/* Student details filling form blank lines */}
                      <div className="grid grid-cols-2 gap-4 border dark:border-slate-800 p-3 bg-stone-50/30 dark:bg-slate-900/10 font-mono text-3xs">
                        <div className="space-y-3">
                          {omrShowCustomFields && omrCustomFields.map((f, i) => {
                            if (i % 2 !== 0) return null;
                            return <div key={i} className="flex gap-2 whitespace-nowrap"><span className="w-24 shrink-0">{f}:</span> <span className="flex-1 border-b border-dashed border-stone-400"></span></div>;
                          })}
                        </div>
                        <div className="space-y-3">
                          {omrShowDate && (
                            <div className="flex gap-2 whitespace-nowrap"><span className="w-24 shrink-0">DATE OF EXAM:</span> <span className="font-bold border-b border-dashed border-stone-400 flex-1">{omrExamDate.split('-').reverse().join(' / ')}</span></div>
                          )}
                          {omrShowCustomFields && omrCustomFields.map((f, i) => {
                            if (i % 2 === 0) return null;
                            return <div key={i} className="flex gap-2 whitespace-nowrap"><span className="w-24 shrink-0">{f}:</span> <span className="flex-1 border-b border-dashed border-stone-400"></span></div>;
                          })}
                        </div>
                      </div>

                      {/* Calibration markers & Dynamic Bubbles grids */}
                      <div className="relative pt-6 pb-8 px-4 flex gap-5 text-3xs border-t-2 border-dashed border-slate-200 dark:border-slate-850">
                        {/* Anchor Fiducial corners */}
                        <div className="absolute top-2 left-0 w-3 h-3 bg-stone-950 dark:bg-white rounded-xs"></div>
                        <div className="absolute top-2 right-0 w-3 h-3 bg-stone-950 dark:bg-white rounded-xs"></div>
                        <div className="absolute bottom-2 left-0 w-3 h-3 bg-stone-950 dark:bg-white rounded-xs"></div>
                        <div className="absolute bottom-2 right-0 w-3 h-3 bg-stone-950 dark:bg-white rounded-xs"></div>

                        {/* Roll Number Grid Columns */}
                        {omrShowRollNo ? (
                          <div className="shrink-0 border-r border-stone-300 dark:border-stone-800 pr-4 space-y-2 font-mono">
                            <span className="font-extrabold text-[9px] block text-stone-700 dark:text-slate-300 uppercase tracking-wide">
                              Bubble Roll No
                            </span>
                            <div className="flex gap-1 flex-wrap">
                              {Array.from({ length: omrRollNoDigits }).map((_, i) => (
                                <div key={i} className="w-5 h-5 border border-stone-900 dark:border-stone-400"></div>
                              ))}
                            </div>
                            <div 
                              className="grid gap-1 pt-1" 
                              style={{ gridTemplateColumns: \`repeat(\${omrRollNoDigits}, minmax(0, 1fr))\` }}
                            >
                              {Array.from({ length: 10 }).map((_, rIdx) => (
                                <React.Fragment key={rIdx}>
                                  {Array.from({ length: omrRollNoDigits }).map((_, cIdx) => (
                                    <span key={cIdx} className="w-3.5 h-3.5 rounded-full border border-stone-900 dark:border-stone-400 text-stone-900 dark:text-stone-300 text-[7px] flex items-center justify-center font-bold">
                                      {rIdx}
                                    </span>
                                  ))}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="shrink-0 border-r border-stone-300 dark:border-stone-800 pr-4 font-mono select-none w-32">
                            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl text-center text-slate-400 h-full flex flex-col justify-center items-center">
                              <EyeOff size={16} />
                              <span className="text-[10px] uppercase font-bold tracking-tight mt-1">Roll Grid Disabled</span>
                            </div>
                          </div>
                        )}

                        {/* MCQ Bubbles Matrix (Columns of 10) */}
                        <div className="flex-1 space-y-2 font-mono overflow-hidden">
                          <span className="font-extrabold text-[9px] block text-stone-700 dark:text-slate-300 uppercase tracking-widest border-b dark:border-slate-800 pb-1">
                            Responses Matrix ({omrNumQuestions} Items)
                          </span>
                          
                          <div className="flex gap-6 overflow-x-auto pb-2 custom-scrollbar">
                            {Array.from({ length: Math.ceil(omrNumQuestions / 10) }).map((_, colIdx) => (
                              <div key={colIdx} className="space-y-1 min-w-[120px]">
                                {Array.from({ length: 10 }).map((_, rowIdx) => {
                                  const qNum = colIdx * 10 + rowIdx + 1;
                                  if (qNum > omrNumQuestions) return null;
                                  
                                  return (
                                    <div key={qNum} className="flex justify-between items-center py-1 border-b border-stone-100 dark:border-stone-900">
                                      <span className="font-bold text-stone-600 dark:text-stone-200 min-w-[28px]">
                                        Q{qNum}
                                      </span>
                                      <div className="flex gap-1.5">
                                        {Array.from({ length: omrNumOptions }).map((_, optIdx) => {
                                          const ch = String.fromCharCode(65 + optIdx);
                                          return (
                                            <span key={ch} className="w-4 h-4 rounded-full border border-stone-900 dark:border-stone-400 text-stone-950 dark:text-stone-300 text-[7px] flex items-center justify-center font-bold font-sans">
                                              {ch}
                                            </span>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>`;

    content = content.replace(rightPreviewTarget, rightPreviewReplace);
} else {
    console.log("Right preview target not found!");
}

// 4. Update Scale for "Sheets per A4"
// Since printing 1/2/4 sheets per page is usually done by CSS scale or PDF scale, we can scale the #omr-printable-sheet directly based on omrSheetsPerA4 using standard tailwind transform.
const wrapperTarget = `<div id="omr-printable-sheet" className="p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg space-y-5 text-stone-900 dark:text-stone-100 relative">`;
const wrapperReplace = `<div id="omr-printable-sheet" 
                         style={{ transform: omrSheetsPerA4 === 2 ? 'scale(0.85)' : omrSheetsPerA4 === 4 ? 'scale(0.65)' : 'scale(1)', transformOrigin: 'top left' }}
                         className="p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg space-y-5 text-stone-900 dark:text-stone-100 relative mb-12">`;
content = content.replace(wrapperTarget, wrapperReplace);

fs.writeFileSync('frontend/src/App.tsx', content);
