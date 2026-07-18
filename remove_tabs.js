const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/BlueprintAssessor.tsx', 'utf-8');

// 1. Remove the Dashboard Tab Controllers section
code = code.replace(/\{\/\* Dashboard Tab Controllers \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* REPORT TABS CONTENT CONTAINER \*\/\}/, '</div>\n\n              {/* REPORT TABS CONTENT CONTAINER */}');

// 2. Remove conditional tab wrappers
const tabs = ['overview', 'topics', 'blooms', 'difficulty', 'choices', 'quality', 'cbme', 'moderation'];
for (const tab of tabs) {
    const startStr = `{baActiveTab === '${tab}' && (`;
    let parts = code.split(startStr);
    
    // For each part, except the first, we know it started with the startStr.
    // The part contains the inner content and ends with `)}` before the next section.
    // We need to find the matching `)}` by finding the LAST `)}` before the NEXT `{/* TAB` or at the end of the section.
    if (parts.length > 1) {
        for (let i = 1; i < parts.length; i++) {
            // Find the last `)}` in this block
            // This is a bit risky. Let's just do a simpler search.
            // In the file, the block ends like:
            //       </div>
            //     )}
            // So we can find `)}` that sits on its own line after </div>
            let part = parts[i];
            let endIdx = part.lastIndexOf(')}');
            if (endIdx !== -1) {
                // Remove the `)}`
                parts[i] = part.substring(0, endIdx) + part.substring(endIdx + 2);
            }
        }
    }
    code = parts.join('');
}

// 3. Add Print Button to the header
const headerTarget = 'Curricular Compliance Report\n                    </h4>';
const printButton = `<button onClick={() => window.print()} className="px-3 py-1.5 bg-indigo-600 text-white rounded font-bold text-xs">Download / Print PDF</button>`;
const headerReplaceTarget = 'Curricular Compliance Report\n                    </h4>\n                    <p className="text-[10px] text-slate-400 font-mono">';
if (code.indexOf(headerTarget) !== -1) {
    code = code.replace('Curricular Compliance Report\n                    </h4>', 'Curricular Compliance Report\n                    </h4>\n<button onClick={() => window.print()} className="mt-2 mb-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-xs w-fit transition-colors shadow-sm">Download / Print PDF</button>');
}

// 4. Add some CSS print rules to body or global? We can just add a style block near the top of the component.
const styleBlock = `
      <style>
        @media print {
          body * { visibility: hidden; }
          .report-container, .report-container * { visibility: visible; }
          .report-container { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
          .hide-on-print { display: none !important; }
        }
      </style>
`;
// Let's add a class to the report container.
code = code.replace('{/* ACTIVE ACCREDITATION REPORT DASHBOARD */}', styleBlock + '\n          {/* ACTIVE ACCREDITATION REPORT DASHBOARD */}');
code = code.replace('className="space-y-6 animate-fadeIn"', 'className="space-y-6 animate-fadeIn report-container"');

fs.writeFileSync('frontend/src/components/BlueprintAssessor.tsx', code);
console.log('Successfully removed tabs');
