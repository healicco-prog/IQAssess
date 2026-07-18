const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/App.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

function replaceBlock(startStr, endStr, replacement) {
  const startIdx = content.indexOf(startStr);
  if (startIdx === -1) {
    console.log("Could not find start:", startStr.substring(0, 50));
    return;
  }
  const endIdx = content.indexOf(endStr, startIdx);
  if (endIdx === -1) {
    console.log("Could not find end:", endStr.substring(0, 50));
    return;
  }
  const fullEndIdx = endIdx + endStr.length;
  content = content.substring(0, startIdx) + replacement + content.substring(fullEndIdx);
  console.log("Replaced successfully for:", replacement.substring(0, 40));
}

// 1. customPaperForm
replaceBlock(
  '<div className="space-y-1.5">\n                              <label className="text-slate-600 dark:text-slate-300 block">Course / Programme <span className="text-red-500 font-bold">*</span></label>\n                              <input \n                                type="text"\n                                value={customPaperForm.className}',
  'value={customPaperForm.topic}\n                              onChange={(e) => setCustomPaperForm(prev => ({ ...prev, topic: e.target.value }))}\n                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg p-2.5 outline-none focus:border-blue-500"\n                              placeholder="Chapter 4: Bernoulli\'s Equation, Viscosity, Reynolds Limit"\n                            />\n                          </div>',
  '<div className="col-span-full"><CurriculumSelectors formState={customPaperForm} setFormState={setCustomPaperForm} isDarkMode={isDarkMode} /></div>'
);

// 2. essayForm
replaceBlock(
  '<div>\n                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">\n                        Course / Programme <span className="text-red-500 font-bold">*</span>\n                      </label>\n                      <input \n                        type="text"\n                        required\n                        value={essayForm.className}',
  'value={essayForm.topic}\n                        onChange={(e) => setEssayForm({...essayForm, topic: e.target.value})}\n                        placeholder="e.g. Sherman Act Section 2"\n                        className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500 ${isDarkMode ? \'bg-[#0F172A] border-slate-700 text-white\' : \'bg-slate-50 border-slate-200 text-stone-900\'}`}\n                      />\n                    </div>',
  '<div className="col-span-full"><CurriculumSelectors formState={essayForm} setFormState={setEssayForm} isDarkMode={isDarkMode} /></div>'
);

// 3. mcqForm
replaceBlock(
  '<div>\n                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">\n                        Course / Programme <span className="text-red-500 font-bold">*</span>\n                      </label>\n                      <input \n                        type="text"\n                        required\n                        value={mcqForm.className}',
  'value={mcqForm.topic}\n                        onChange={(e) => setMcqForm({...mcqForm, topic: e.target.value})}\n                        placeholder="e.g. Vectors and Scalars"\n                        className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500 ${isDarkMode ? \'bg-[#0F172A] border-slate-700 text-white\' : \'bg-slate-50 border-slate-200 text-stone-900\'}`}\n                      />\n                    </div>',
  '<div className="col-span-full"><CurriculumSelectors formState={mcqForm} setFormState={setMcqForm} isDarkMode={isDarkMode} /></div>'
);

// 4. reflectionForm
replaceBlock(
  '<div>\n                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">\n                        Course / Programme <span className="text-red-500 font-bold">*</span>\n                      </label>\n                      <input \n                        type="text"\n                        value={reflectionForm.className}',
  'value={reflectionForm.topic}\n                        onChange={(e) => setReflectionForm({...reflectionForm, topic: e.target.value})}\n                        placeholder="e.g. Palliative Care"\n                        className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500 ${isDarkMode ? \'bg-[#0F172A] border-slate-700 text-white\' : \'bg-slate-50 border-slate-200 text-stone-900\'}`}\n                      />\n                    </div>',
  '<div className="col-span-full"><CurriculumSelectors formState={reflectionForm} setFormState={setReflectionForm} isDarkMode={isDarkMode} /></div>'
);

// 5. rubricBuilderForm (HistoryInput version)
replaceBlock(
  '<div className="space-y-1">\n                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Course / Programme <span className="text-red-500 font-bold">*</span></label>\n                        <HistoryInput \n                          storageKey="course"',
  '<HistoryInput \n                          storageKey="essay_topic"\n                          type="text" \n                          value={rubricBuilderForm.topic}\n                          onChange={(e) => setRubricBuilderForm(prev => ({ ...prev, topic: e.target.value }))}\n                          placeholder="E.g., Neoclassical synthesis"\n                          className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500 ${isDarkMode ? \'bg-[#0F172A] border-slate-700 text-white\' : \'bg-slate-50 border-slate-200 text-stone-900\'}`}\n                        />\n                      </div>',
  '<div className="col-span-full md:col-span-2 lg:col-span-4"><CurriculumSelectors formState={rubricBuilderForm} setFormState={setRubricBuilderForm} isDarkMode={isDarkMode} /></div>'
);

// Write to file
fs.writeFileSync(filePath, content, 'utf-8');
console.log('UI updates complete.');
