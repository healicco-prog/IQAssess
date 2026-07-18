const fs = require('fs');

const appTsxPath = 'frontend/src/App.tsx';
let content = fs.readFileSync(appTsxPath, 'utf8');

// Find the start of the dashboard tab
const dashTabStr = "activeTab === 'dashboard' && (";
const dashTabIndex = content.indexOf(dashTabStr);

if (dashTabIndex !== -1) {
    const spaceY6Index = content.indexOf('<div className="space-y-6 animate-fadeIn pb-12">', dashTabIndex);
    if (spaceY6Index !== -1) {
        // Insert right after the div opens
        const insertPos = spaceY6Index + '<div className="space-y-6 animate-fadeIn pb-12">'.length;
        content = content.slice(0, insertPos) + '\\n                <DashboardSettings isDarkMode={isDarkMode} />' + content.slice(insertPos);
        
        fs.writeFileSync(appTsxPath, content);
        console.log("Successfully injected <DashboardSettings />");
    } else {
        console.log("Could not find space-y-6 div");
    }
} else {
    console.log("Could not find activeTab === 'dashboard'");
}
