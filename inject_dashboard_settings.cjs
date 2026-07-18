const fs = require('fs');
const path = require('path');

const appTsxPath = path.join(__dirname, 'frontend', 'src', 'App.tsx');
let content = fs.readFileSync(appTsxPath, 'utf8');

// Add import if not exists
if (!content.includes("import DashboardSettings")) {
    // find last import
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
        const nextNewline = content.indexOf('\\n', lastImportIndex);
        content = content.slice(0, nextNewline + 1) + "import DashboardSettings from './components/DashboardSettings';\\n" + content.slice(nextNewline + 1);
    }
}

// Inject component after the user tier div
if (!content.includes("<DashboardSettings")) {
    const searchStr = "</span>\\n                        </div>\\n                      )}\\n                    </div>\\n                  </div>\\n                </div>";
    
    if (content.includes(searchStr)) {
        content = content.replace(searchStr, searchStr + "\\n                \\n                <DashboardSettings isDarkMode={isDarkMode} />");
    }
}

fs.writeFileSync(appTsxPath, content);
console.log('App.tsx updated with DashboardSettings component.');
