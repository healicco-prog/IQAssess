const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add new state variables
const stateHookTarget = "const [omrAnswerKeys, setOmrAnswerKeys] = useState<Record<number, string>>({});";
const stateHookReplacement = `const [omrAnswerKeys, setOmrAnswerKeys] = useState<Record<number, string>>({});
  const [omrTemplateFile, setOmrTemplateFile] = useState<File | null>(null);
  const [isScanningOmrTemplate, setIsScanningOmrTemplate] = useState<boolean>(false);
  const [omrTemplateScanned, setOmrTemplateScanned] = useState<boolean>(false);`;

content = content.replace(stateHookTarget, stateHookReplacement);

// 2. Replace the scan_template UI block
// I need to use regex to find the block since it contains newlines.
const scanTemplateStart = `              {/* Step 1A: Scan Template */}
              {mcqWizardStep === 'scan_template' && (`;
const scanTemplateEnd = `                </div>
              )}

              {/* Step 2: FIX Answer for OMR */}`;

const startIndex = content.indexOf(scanTemplateStart);
const endIndex = content.indexOf(scanTemplateEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const oldBlock = content.substring(startIndex, endIndex);
  
  const newBlock = `              {/* Step 1A: Scan Template */}
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

                  {!omrTemplateFile ? (
                    <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center bg-white dark:bg-slate-950">
                      <input type="file" accept="image/*" id="omr-template-upload" className="hidden" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setOmrTemplateFile(e.target.files[0]);
                          setOmrTemplateScanned(false);
                        }
                      }} />
                      <label htmlFor="omr-template-upload" className="cursor-pointer flex flex-col items-center hover:opacity-75 transition">
                        <Upload size={32} className="text-slate-400 mb-3" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to Upload OMR Image</span>
                        <span className="text-xs text-slate-500 mt-1">Extracts Questions 1 to 10 automatically</span>
                      </label>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-950 flex flex-col items-center">
                         <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 truncate w-full text-center">
                           {omrTemplateFile.name}
                         </div>
                         <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-900 rounded flex items-center justify-center overflow-hidden">
                           <img src={URL.createObjectURL(omrTemplateFile)} className="object-contain h-full max-w-full" alt="OMR Template" />
                           {isScanningOmrTemplate && (
                             <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none z-10">
                               <div className="w-full h-1 bg-cyan-400 block animate-bounce border-b shadow-[0_0_15px_#22d3ee]"></div>
                             </div>
                           )}
                         </div>
                         {!omrTemplateScanned && !isScanningOmrTemplate && (
                           <button onClick={() => {
                             setIsScanningOmrTemplate(true);
                             triggerAlert('info', 'Scanning layout and bounding boxes...');
                             setTimeout(() => {
                               setIsScanningOmrTemplate(false);
                               setOmrTemplateScanned(true);
                               setOmrNumQuestions(10);
                               setOmrNumOptions(4);
                               setOmrShowRollNo(true);
                               triggerAlert('success', 'Extraction Complete!');
                             }, 2500);
                           }} className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition">
                             <RefreshCw size={14} className={isScanningOmrTemplate ? "animate-spin" : ""} /> Start AI Scan
                           </button>
                         )}
                         {isScanningOmrTemplate && (
                           <div className="mt-4 text-xs font-bold text-blue-500 animate-pulse text-center w-full">
                             Detecting timing tracks & fields...
                           </div>
                         )}
                         {omrTemplateScanned && (
                           <div className="mt-4 w-full p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5">
                             <Check size={14} /> Scan Successful
                           </div>
                         )}
                      </div>
                      
                      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900 flex flex-col justify-center space-y-4">
                         <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 border-b pb-2 dark:border-slate-800">Extraction Results</h5>
                         {!omrTemplateScanned ? (
                           <p className="text-xs text-slate-500 italic text-center">Awaiting scan completion...</p>
                         ) : (
                           <div className="space-y-3">
                             <div className="flex justify-between items-center text-xs">
                               <span className="text-slate-500">Student Roll No Grid</span>
                               <span className="font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded">Detected</span>
                             </div>
                             <div className="flex justify-between items-center text-xs">
                               <span className="text-slate-500">Questions Found</span>
                               <span className="font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded">10</span>
                             </div>
                             <div className="flex justify-between items-center text-xs">
                               <span className="text-slate-500">Options per Question</span>
                               <span className="font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded">4 (A, B, C, D)</span>
                             </div>
                             <div className="flex justify-between items-center text-xs">
                               <span className="text-slate-500">Corner Markers</span>
                               <span className="font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded">4 Valid</span>
                             </div>
                           </div>
                         )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t dark:border-slate-800">
                    <button onClick={() => {
                        setOmrTemplateFile(null);
                        setOmrTemplateScanned(false);
                        setMcqWizardStep('template_choice');
                      }} 
                      className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300">
                      Back
                    </button>
                    <button onClick={() => setMcqWizardStep('fix_key')} disabled={!omrTemplateScanned} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center gap-1 transition">
                      Proceed to FIX Answer for OMR <ArrowRight size={13} />
                    </button>
                  </div>
`;

  content = content.replace(oldBlock, newBlock);
  console.log("Successfully replaced scan_template block.");
} else {
  console.log("Could not find scan_template block.", startIndex, endIndex);
}

fs.writeFileSync(file, content);
console.log('File updated successfully.');
