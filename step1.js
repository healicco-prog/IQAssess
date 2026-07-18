const fs = require('fs');
const file = 'frontend/src/components/BlueprintAssessor.tsx';
let content = fs.readFileSync(file, 'utf-8');

const startTag = '<h4 className="text-xs font-black uppercase tracking-wider text-slate-500 font-sans">Basic Information Setup</h4>';
const endTag = '            {/* Step 2: Syllabus Blueprint & Exam Target Setup */}';

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if(startIndex > -1 && endIndex > -1) {
  const replacement = startTag + `
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Institution Name <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={getDashboardSetting('institution') || baInstitution || 'Default Institution'}
                  readOnly
                  className={\`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-not-allowed\`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Course / Programme <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={getDashboardSetting('course') || baCourse || 'Default Course'}
                  readOnly
                  className={\`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-not-allowed\`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Subject Name <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={getDashboardSetting('subject') || baSubject || 'Default Subject'}
                  readOnly
                  className={\`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-not-allowed\`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Class / Year</label>
                <input
                  type="text"
                  value={baClass}
                  onChange={(e) => setBaClass(e.target.value)}
                  placeholder="e.g. Phase III Part I"
                  className={\`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none \${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }\`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Programme Tier</label>
                <input
                  type="text"
                  value={baProgramme}
                  onChange={(e) => setBaProgramme(e.target.value)}
                  placeholder="e.g. Undergraduate (UG), PG"
                  className={\`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 \${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }\`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Paper Title</label>
                <input
                  type="text"
                  value={baPaper}
                  onChange={(e) => setBaPaper(e.target.value)}
                  placeholder="e.g. Paper II"
                  className={\`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none \${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }\`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Academic Year</label>
                <input
                  type="text"
                  value={baAcademicYear}
                  onChange={(e) => setBaAcademicYear(e.target.value)}
                  placeholder="e.g. 2025-2026"
                  className={\`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none \${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }\`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Exam Category</label>
                <input
                  type="text"
                  value={baExamType}
                  onChange={(e) => setBaExamType(e.target.value)}
                  placeholder="e.g. Internal Assessment, University"
                  className={\`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 \${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }\`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">University / Board</label>
                <input
                  type="text"
                  value={baUniversity}
                  onChange={(e) => setBaUniversity(e.target.value)}
                  placeholder="e.g. Health Sciences University"
                  className={\`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none \${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }\`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Credits (Optional)</label>
                <input
                  type="text"
                  value={baCredits}
                  onChange={(e) => setBaCredits(e.target.value)}
                  placeholder="e.g. 4"
                  className={\`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none \${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }\`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Semester / Term</label>
                <input
                  type="text"
                  value={baSemester}
                  onChange={(e) => setBaSemester(e.target.value)}
                  placeholder="e.g. Semester 5"
                  className={\`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none \${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }\`}
                />
              </div>

            </div>
          </div>
\n`;

  const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync(file, newContent);
  console.log('Replaced Step 1');
} else {
  console.log('Not found');
}
