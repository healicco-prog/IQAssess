const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update state
content = content.replace(
  "const [mcqWizardStep, setMcqWizardStep] = useState<'qp' | 'create' | 'approve' | 'scan' | 'results' | 'setup' | 'key'>('qp');",
  "const [mcqWizardStep, setMcqWizardStep] = useState<'create' | 'scan' | 'results' | 'setup' | 'key'>('create');"
);

// 2. Update Reset button
content = content.replace(
  "setMcqWizardStep('setup');\n                    setStudentMcqName('');",
  "setMcqWizardStep('create');\n                    setStudentMcqName('');"
);

// 3. Update Navigation Tiles
content = content.replace(
  `              {/* Step Navigation Checkpoint Tiles */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                {[
                  { step: 'qp', num: '01', title: 'Scan QP Document', sub: 'Upload & extract items' },
                  { step: 'approve', num: '02', title: 'Edit & Approve Items', sub: 'Configure MCQ key matrix' },
                  { step: 'create', num: '03', title: 'Generate OMR Sheet', sub: 'Download dynamic template' },
                  { step: 'scan', num: '04', title: 'Student OMR Scanner', sub: 'Upload student scripts' },
                  { step: 'results', num: '05', title: 'Results Ledger', sub: 'Accreditation log & trends' }
                ].map((item) => {`,
  `              {/* Step Navigation Checkpoint Tiles */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                {[
                  { step: 'create', num: '01', title: 'Generate OMR Sheet', sub: 'Download dynamic template' },
                  { step: 'scan', num: '02', title: 'Student OMR Scanner', sub: 'Upload student scripts' },
                  { step: 'results', num: '03', title: 'Results Ledger', sub: 'Accreditation log & trends' }
                ].map((item) => {`
);

// 4. Remove 'qp' block
const qpStartRegex = /\{\/\* Step 1: Upload Question Paper & Extraction \*\/\}\s*\{mcqWizardStep === 'qp' && \(/;
const createStartRegex = /\{\/\* Step 2: Create Custom OMR Sheet Sheet based on QP \*\/\}\s*\{mcqWizardStep === 'create' && \(/;

const matchQp = content.match(qpStartRegex);
const matchCreate = content.match(createStartRegex);

if (matchQp && matchCreate) {
  content = content.slice(0, matchQp.index) + content.slice(matchCreate.index);
  console.log("Successfully removed 'qp' block.");
} else {
  console.log("Failed to find 'qp' or 'create' blocks.");
}

// 5. Remove 'approve' block
const approveStartRegex = /\{\/\* Step 2: Approve Answers \(Supports toggling single or multi responses and direct inline content editing\) \*\/\}\s*\{mcqWizardStep === 'approve' && \(/;
const scanStartRegex = /\{\/\* Step 3: Student Script Upload & Scanner \*\/\}\s*\{mcqWizardStep === 'scan' && \(/;

const matchApprove = content.match(approveStartRegex);
const matchScan = content.match(scanStartRegex);

if (matchApprove && matchScan) {
  content = content.slice(0, matchApprove.index) + content.slice(matchScan.index);
  console.log("Successfully removed 'approve' block.");
} else {
  console.log("Failed to find 'approve' or 'scan' blocks.");
}

// 6. Update the 'create' step footer to remove 'Back to Edit & Approve' and adjust alignment
const createFooterRegex = /<div className="flex justify-between items-center pt-2 border-t dark:border-slate-805">\s*<button\s*type="button"\s*onClick=\{\(\) => setMcqWizardStep\('approve'\)\}[\s\S]*?<\/button>\s*<button\s*type="button"\s*onClick=\{\(\) => \{\s*setMcqWizardStep\('scan'\);/;

const matchCreateFooter = content.match(createFooterRegex);
if (matchCreateFooter) {
  const replacement = `<div className="flex justify-end items-center pt-2 border-t dark:border-slate-805">
                      <button
                        type="button"
                        onClick={() => {
                          setMcqWizardStep('scan');`;
  content = content.replace(createFooterRegex, replacement);
  console.log("Successfully updated 'create' step footer.");
} else {
  console.log("Failed to find 'create' step footer.");
}

fs.writeFileSync(file, content);
console.log('File updated successfully.');
