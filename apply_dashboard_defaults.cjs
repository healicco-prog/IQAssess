const fs = require('fs');
const path = require('path');

const appTsxPath = path.join(__dirname, 'frontend', 'src', 'App.tsx');
let content = fs.readFileSync(appTsxPath, 'utf8');

const helper = `export const getDashboardSetting = (key: string, def: string) => {
  try {
    const d = JSON.parse(localStorage.getItem('iqassess_dashboard_config') || '{}');
    return d[key] || def;
  } catch(e) {
    return def;
  }
};

export default function App() {`;

if (!content.includes('export const getDashboardSetting')) {
    content = content.replace('export default function App() {', helper);
}

const replacements = [
  ['omrInstitutionName', 'institution'],
  ['mcqInstitution', 'institution'],
  ['adsInstitution', 'institution'],
  ['bpdsInstitution', 'institution'],
  ['qpInstitutionName', 'institution'],
  ['newRubricInstitution', 'institution'],
  ['essayBuilderInstitution', 'institution'],
  ['mcqBuilderInstitution', 'institution'],
  
  ['baCourse', 'course'],
  ['itemAnalysisCourse', 'course'],
  ['currCourseName', 'course'],
  ['bpdsCourse', 'course'],
  ['newRubricCourse', 'course'],
  ['essayBuilderCourse', 'course'],
  ['mcqBuilderCourse', 'course'],

  ['baSubject', 'subject'],
  ['mcqSubjectTitle', 'subject'],
  ['bpSubject', 'subject'],
  ['adsSubject', 'subject'],
  ['bpdsSubject', 'subject'],
  ['qpSubject', 'subject'],
  ['newRubricSubject', 'subject'],
  ['essayBuilderSubject', 'subject'],
  ['mcqBuilderSubject', 'subject'],

  ['baTopic', 'topic'],
  ['mcqTopicText', 'topic'],
  ['mcqTopic', 'topic'],
  ['adsTopic', 'topic'],
  ['bpdsTopic', 'topic'],
  ['essayBuilderTopic', 'topic'],
  ['mcqBuilderTopic', 'topic']
];

replacements.forEach(([stateName, key]) => {
    const setterName = 'set' + stateName.charAt(0).toUpperCase() + stateName.slice(1);
    const regex = new RegExp(`const \\\\[${stateName}, ${setterName}\\\\] = useState(?:<string>)?\\\\((.*?)\\\\);`, 'g');
    
    content = content.replace(regex, (match, p1) => {
        if (p1.includes('getDashboardSetting') || p1.includes('getInitialHistory')) {
            return match;
        }
        return `const [${stateName}, ${setterName}] = useState<string>(getDashboardSetting('${key}', ${p1}));`;
    });
});

fs.writeFileSync(appTsxPath, content);
console.log('App.tsx replaced successfully');
