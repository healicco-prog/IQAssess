const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state variable
if (!content.includes('const [isTestingBlank, setIsTestingBlank]')) {
  content = content.replace(
    `const [studentMcqFile, setStudentMcqFile] = useState<any>(null);`,
    `const [studentMcqFile, setStudentMcqFile] = useState<any>(null);\n  const [isTestingBlank, setIsTestingBlank] = useState(false);`
  );
}

// 2. Add checkbox UI below the file upload area
const uiOld = `<span className="text-[10px] text-slate-400 mt-1 block">
                              Supports camera snapshots, scanned sheets or student OMR files
                            </span>
                          </div>
                        </div>`;
const uiNew = `<span className="text-[10px] text-slate-400 mt-1 block">
                              Supports camera snapshots, scanned sheets or student OMR files
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-center">
                            <label className="flex items-center gap-2 cursor-pointer text-xs bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition">
                              <input type="checkbox" checked={isTestingBlank} onChange={e => setIsTestingBlank(e.target.checked)} className="rounded text-emerald-600" />
                              <span className="text-slate-600 dark:text-slate-400 font-medium">Force scan as Blank Sheet (0 Marks)</span>
                            </label>
                          </div>
                        </div>`;
if (content.includes(uiOld)) {
  content = content.replace(uiOld, uiNew);
}

// 3. Update scan logic to use the checkbox
const scanLogicOld = `// Deep Image Analysis for Blank Sheet Detection
    let isBlankTemplate = false;
    const fileNameStr = studentMcqFile?.name?.toLowerCase() || '';
    const isSameAsTemplate = omrTemplateFile && studentMcqFile?.name === omrTemplateFile.name && studentMcqFile?.size === omrTemplateFile.size;
    const isDemoSimulator = fileNameStr.includes('_l3') || fileNameStr.includes('_l1') || fileNameStr.includes('_l5');
    
    if (fileNameStr.includes('omr_sheet_') || fileNameStr === 'omr sheet.jpg' || fileNameStr.includes('template') || fileNameStr.includes('blank') || isSameAsTemplate) {
      isBlankTemplate = true;
    }`;

const scanLogicNew = `// Deep Image Analysis for Blank Sheet Detection
    let isBlankTemplate = isTestingBlank; // Override with user UI selection
    const fileNameStr = studentMcqFile?.name?.toLowerCase() || '';
    const isSameAsTemplate = omrTemplateFile && studentMcqFile?.name === omrTemplateFile.name && studentMcqFile?.size === omrTemplateFile.size;
    const isDemoSimulator = fileNameStr.includes('_l3') || fileNameStr.includes('_l1') || fileNameStr.includes('_l5');
    
    if (fileNameStr.includes('omr_sheet_') || fileNameStr === 'omr sheet.jpg' || fileNameStr.includes('template') || fileNameStr.includes('blank') || isSameAsTemplate) {
      isBlankTemplate = true;
    }`;

if (content.includes(scanLogicOld)) {
  content = content.replace(scanLogicOld, scanLogicNew);
}

fs.writeFileSync(file, content);
console.log("Testing blank UI toggle implemented.");
