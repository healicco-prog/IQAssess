const fs = require('fs');
const file = 'e:/Lenovo Narayana 2026/Software Products/Antigravity Projects/IQAssess-Faculty/frontend/src/App.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

let startIdx = lines.findIndex(l => l.includes('<div id="omr-printable-sheet"'));
let endIdx = -1;
for (let i = startIdx; i < lines.length; i++) {
  if (lines[i].includes('TEMPLATE IDENTIFIER: OPT-PHY-OMR26-A')) {
    // End is a few lines below (</div> of the template identifier, then </div> of omr-printable-sheet)
    endIdx = i + 6;
    break;
  }
}

console.log('Start:', startIdx, 'End:', endIdx);

if (startIdx > -1 && endIdx > -1) {
  // get exactly the lines inside omr-printable-sheet
  const inside = lines.slice(startIdx + 3, endIdx - 1); 
  
  const newContent = [
    '                    {(() => {',
    '                      const omrSingleSheetContent = (',
    '                        <>',
    ...inside,
    '                        </>',
    '                      );',
    '',
    '                      return (',
    '                        <div id="omr-printable-sheet" ',
    '                             className={`bg-white dark:bg-slate-950 text-stone-900 dark:text-stone-100 relative mb-12 overflow-hidden break-inside-avoid print:break-inside-avoid',
    '                                         ${omrSheetsPerA4 === 4 ? \'grid grid-cols-2 grid-rows-2 gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg\' : ',
    '                                           omrSheetsPerA4 === 2 ? \'grid grid-cols-2 gap-6 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg\' : ',
    '                                           \'p-5 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg space-y-5\'}`}',
    '                        >',
    '                          {Array.from({ length: omrSheetsPerA4 }).map((_, sheetIdx) => (',
    '                            <div key={sheetIdx} ',
    '                                 style={{ zoom: omrSheetsPerA4 === 4 ? 0.48 : omrSheetsPerA4 === 2 ? 0.68 : 1 }}',
    '                                 className={`${omrSheetsPerA4 > 1 ? \'border-2 border-dashed border-stone-200 dark:border-slate-800 p-5 rounded-2xl space-y-5 bg-white dark:bg-slate-950 relative\' : \'h-full flex flex-col space-y-5\'}`}',
    '                            >',
    '                              {omrSingleSheetContent}',
    '                            </div>',
    '                          ))}',
    '                        </div>',
    '                      );',
    '                    })()}'
  ];
  
  lines.splice(startIdx, endIdx - startIdx, ...newContent);
  fs.writeFileSync(file, lines.join('\n'));
  console.log('File patched successfully.');
} else {
  console.log('Failed to find indices.');
}
