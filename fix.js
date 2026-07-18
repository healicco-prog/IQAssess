const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/BlueprintAssessor.tsx', 'utf-8');

const target = `                      <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 text-indigo-600">
                        <Sliders size={14} /> Curricular QA Committee Moderation comments
                      </h5>`;

const replacement = `                  <div className="col-span-1 md:col-span-2 p-4 rounded-xl border dark:border-slate-800 space-y-3">
                      <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 text-indigo-600">
                        <Sliders size={14} /> Curricular QA Committee Moderation comments
                      </h5>`;

code = code.replace(target, replacement);
fs.writeFileSync('frontend/src/components/BlueprintAssessor.tsx', code);
console.log('Fixed wrapper div');
