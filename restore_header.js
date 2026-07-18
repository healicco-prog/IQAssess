const fs = require('fs');
const code = fs.readFileSync('frontend/src/components/BlueprintAssessor.tsx', 'utf-8');

const marker1 = '{/* ACTIVE ACCREDITATION REPORT DASHBOARD */}';
const marker2 = '{/* Rating parameters bar */}';

const idx1 = code.indexOf(marker1);
const idx2 = code.indexOf(marker2);

if (idx1 === -1 || idx2 === -1) {
    console.error('Markers not found');
    process.exit(1);
}

const before = code.substring(0, idx1 + marker1.length);
const after = code.substring(idx2);

const insertion = `
          {blueprintAssessorResult && !blueprintAssessorLoading && (
            <div className="space-y-6 animate-fadeIn report-container">
              
              {/* Header: Overview Compliance Score Gauges */}
              <div className={\`p-5 rounded-2xl border \${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-150'} shadow-sm space-y-4\`}>
                
                {/* Meta Details header */}
                <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[9px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">
                      {baUniversity}
                    </span>
                    <h4 className="text-sm font-black mt-1 uppercase text-slate-800 dark:text-white">
                      Curricular Compliance Report
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Course: {baCourse} ({baProgramme}) | Subject: {baSubject} | {baPaper} | AY: {baAcademicYear}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Status:</span>
                    <span className={\`px-2 py-0.5 text-[10px] font-bold rounded-full border \${
                      baApprovalStatus === 'HoD Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      baApprovalStatus === 'Moderated' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                      'bg-amber-50 text-amber-600 border-amber-200 animate-pulse'
                    }\`}>
                      {baApprovalStatus}
                    </span>
                    <button onClick={() => window.print()} className="ml-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-xs w-fit transition-colors shadow-sm hide-on-print cursor-pointer">
                      Download PDF
                    </button>
                  </div>
                </div>

                {/* Score indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
                  {/* Gauge 1: Compliance Score */}
                  <div className="flex items-center gap-2 p-3 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl border dark:border-slate-800">
                    <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                      <svg className="w-14 h-14 transform -rotate-90">
                        <circle cx="28" cy="28" r="24" stroke="#E2E8F0" strokeWidth="5" fill="transparent" className="dark:stroke-slate-800" />
                        <circle cx="28" cy="28" r="24" stroke="#4F46E5" strokeWidth="5" fill="transparent" 
                          strokeDasharray={150.7}
                          strokeDashoffset={150.7 - (150.7 * blueprintAssessorResult.complianceScore) / 100} 
                        />
                      </svg>
                      <span className="absolute text-sm font-black text-indigo-600 dark:text-indigo-400">
                        {blueprintAssessorResult.complianceScore}%
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Syllabus Match</h5>
                      <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5 truncate">Compliant Standard</p>
                      <p className="text-[9px] text-slate-400 leading-tight">Aligned with curriculum blueprint weightings</p>
                    </div>
                  </div>

                  {/* Gauge 2: Quality Index */}
                  <div className="flex items-center gap-2 p-3 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl border dark:border-slate-800">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-2xl font-black text-emerald-500 shrink-0">
                      {blueprintAssessorResult.qualityIndex || "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Accreditation QA</h5>
                      <p className="text-xs font-bold text-emerald-500 mt-0.5 truncate">Excellent Standard</p>
                      <p className="text-[9px] text-slate-400 leading-tight">Evaluated by AI committee moderators</p>
                    </div>
                  </div>

                  `;

const newCode = before + '\n' + insertion + '\n                  ' + after;
fs.writeFileSync('frontend/src/components/BlueprintAssessor.tsx', newCode);
console.log('Restored component successfully');
