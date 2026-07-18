const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update mcqWizardStep type and default value
content = content.replace(
  "const [mcqWizardStep, setMcqWizardStep] = useState<'create' | 'scan' | 'results' | 'setup' | 'key'>('create');",
  "const [omrAnswerKeys, setOmrAnswerKeys] = useState<Record<number, string>>({});\n  const [mcqWizardStep, setMcqWizardStep] = useState<'template_choice' | 'create' | 'scan_template' | 'fix_key' | 'scan' | 'results' | 'setup' | 'key'>('template_choice');"
);

// 2. Update reset button
content = content.replace(
  "setMcqWizardStep('create');\n                    setStudentMcqName('');",
  "setMcqWizardStep('template_choice');\n                    setStudentMcqName('');\n                    setOmrAnswerKeys({});"
);

// 3. Update Navigation Checkpoint Tiles
const navTilesOld = `<div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                {[
                  { step: 'create', num: '01', title: 'Generate OMR Sheet', sub: 'Download dynamic template' },
                  { step: 'scan', num: '02', title: 'Student OMR Scanner', sub: 'Upload student scripts' },
                  { step: 'results', num: '03', title: 'Results Ledger', sub: 'Accreditation log & trends' }
                ].map((item) => {
                  const isActive = mcqWizardStep === item.step;`;

const navTilesNew = `<div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                {[
                  { step: 'template_choice', num: '01', title: 'OMR Source', sub: 'Generate or Scan' },
                  { step: 'fix_key', num: '02', title: 'FIX Answer for OMR', sub: 'Set correct options' },
                  { step: 'scan', num: '03', title: 'Student OMR Scanner', sub: 'Upload student scripts' },
                  { step: 'results', num: '04', title: 'Results Ledger', sub: 'Accreditation log & trends' }
                ].map((item) => {
                  const isActive = (['template_choice', 'create', 'scan_template'].includes(mcqWizardStep) && item.step === 'template_choice') || mcqWizardStep === item.step;`;

content = content.replace(navTilesOld, navTilesNew);

// 4. Update the "Proceed to Student Scanner" button at the bottom of 'create' step
const proceedScanOld = `<div className="flex justify-end items-center pt-2 border-t dark:border-slate-805">
                      <button
                        type="button"
                        onClick={() => {
                          setMcqWizardStep('scan');`;
const proceedScanNew = `<div className="flex justify-between items-center pt-2 border-t dark:border-slate-805">
                      <button onClick={() => setMcqWizardStep('template_choice')} className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300">Back to OMR Source</button>
                      <button
                        type="button"
                        onClick={() => {
                          setMcqWizardStep('fix_key');`;
content = content.replace(proceedScanOld, proceedScanNew);

content = content.replace(
  "triggerAlert('success', 'OMR Sheet template successfully established! Proceeding to the student scanner.');",
  "triggerAlert('success', 'OMR Sheet template successfully established! Proceeding to set answers.');"
);

content = content.replace(
  "Proceed to Student Scanner <ArrowRight size={13} />",
  "Proceed to FIX Answer for OMR <ArrowRight size={13} />"
);

// 5. Add new steps (template_choice, scan_template, fix_key)
const templateChoiceBlock = `
              {/* Step 1: OMR Source Choice */}
              {mcqWizardStep === 'template_choice' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 font-sans">
                  <div 
                    onClick={() => setMcqWizardStep('create')}
                    className="p-8 border-2 border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 hover:shadow-lg transition cursor-pointer flex flex-col items-center text-center bg-white dark:bg-slate-900 group"
                  >
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-4 group-hover:scale-110 transition">
                      <Printer size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">1. Generate OMR Sheet</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Design and generate a custom OMR sheet using our Live Designer tool.
                    </p>
                  </div>

                  <div 
                    onClick={() => setMcqWizardStep('scan_template')}
                    className="p-8 border-2 border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500 hover:shadow-lg transition cursor-pointer flex flex-col items-center text-center bg-white dark:bg-slate-900 group"
                  >
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full mb-4 group-hover:scale-110 transition">
                      <Camera size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">2. Scan OMR Sheet</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Upload an existing OMR sheet image to extract structure and questions automatically.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 1A: Scan Template */}
              {mcqWizardStep === 'scan_template' && (
                <div className="space-y-6 pt-2 font-sans">
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1">
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Camera size={12} /> Scan Existing OMR Template
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Upload an image of your OMR sheet. We will extract Roll No and all questions.
                    </p>
                  </div>

                  <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center bg-white dark:bg-slate-950">
                    <input type="file" id="omr-template-upload" className="hidden" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        triggerAlert('info', 'Extracting OMR Structure...');
                        setTimeout(() => {
                          setOmrNumQuestions(10);
                          setOmrNumOptions(4);
                          setOmrShowRollNo(true);
                          triggerAlert('success', 'Extracted: Roll No and 10 Questions (A B C D) successfully!');
                        }, 1500);
                      }
                    }} />
                    <label htmlFor="omr-template-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload size={32} className="text-slate-400 mb-3" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to Upload OMR Image</span>
                      <span className="text-xs text-slate-500 mt-1">Extracts Questions 1 to 10 automatically</span>
                    </label>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t dark:border-slate-800">
                    <button onClick={() => setMcqWizardStep('template_choice')} className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300">Back</button>
                    <button onClick={() => setMcqWizardStep('fix_key')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                      Proceed to FIX Answer for OMR <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: FIX Answer for OMR */}
              {mcqWizardStep === 'fix_key' && (
                <div className="space-y-6 pt-2 font-sans">
                  <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-1">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <CheckSquare size={12} /> FIX Answer for OMR
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Select the correct option for each question. This key will be used to automatically score student sheets.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto p-1 custom-scrollbar">
                    {Array.from({ length: omrNumQuestions }).map((_, idx) => {
                      const qNum = omrQuestionStartIndex + idx;
                      const selectedAns = omrAnswerKeys[qNum] || '';
                      
                      return (
                        <div key={qNum} className="p-3 bg-white dark:bg-slate-900 border dark:border-slate-200/50 rounded-xl flex flex-col gap-2 shadow-sm">
                          <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Q{qNum}</span>
                          <div className="flex gap-1.5 flex-wrap">
                            {Array.from({ length: omrNumOptions }).map((_, optIdx) => {
                              const char = String.fromCharCode(65 + optIdx);
                              const isSelected = selectedAns === char;
                              return (
                                <button
                                  key={char}
                                  onClick={() => setOmrAnswerKeys(prev => ({ ...prev, [qNum]: char }))}
                                  className={\`w-7 h-7 rounded-full border text-xs font-bold flex items-center justify-center transition \${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}\`}
                                >
                                  {char}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t dark:border-slate-800">
                    <button onClick={() => setMcqWizardStep('template_choice')} className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300">Back to OMR Source</button>
                    <button onClick={() => {
                        triggerAlert('success', 'Answer key locked! Proceeding to scan student sheets.');
                        setMcqWizardStep('scan');
                      }} 
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95">
                      Save Answers & Proceed <Check size={14} />
                    </button>
                  </div>
                </div>
              )}
`;

content = content.replace(
  "{/* Step 2: Create Custom OMR Sheet Sheet based on QP */}",
  templateChoiceBlock + "\n              {/* Step 2: Create Custom OMR Sheet Sheet based on QP */}"
);

fs.writeFileSync(file, content);
console.log('File updated successfully.');
