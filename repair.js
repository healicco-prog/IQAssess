const fs = require('fs');
let lines = fs.readFileSync('frontend/src/components/BlueprintAssessor.tsx', 'utf-8').split('\n');

const startIdx = lines.findIndex((l, i) => i > 1850 && l.includes('Add Comment'));
const endIdx = lines.findIndex((l, i) => i > 2060 && l.includes('          }`}>'));

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `                        </button>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SELECT FROM REPOSITORY MODAL */}
      {baShowRepositoryModal && (
        <div className="fixed inset-0 bg-black/65 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className={\`w-full max-w-2xl rounded-2xl border p-6 space-y-4 shadow-2xl \${
            isDarkMode ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-150 text-slate-900'
          }\`}>`;

  // We cut from startIdx + 1 to endIdx (inclusive)
  lines.splice(startIdx + 1, endIdx - startIdx, replacement);
  
  fs.writeFileSync('frontend/src/components/BlueprintAssessor.tsx', lines.join('\n'));
  console.log('Successfully repaired corrupted block');
} else {
  console.log('Could not find boundaries', startIdx, endIdx);
}
