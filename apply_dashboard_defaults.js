const fs = require('fs');
const path = require('path');

const appTsxPath = path.join(__dirname, 'frontend', 'src', 'App.tsx');
let content = fs.readFileSync(appTsxPath, 'utf8');

// Inject helper
if (!content.includes('const getDashboardSetting')) {
  content = content.replace(
    'export default function App() {',
    'export const getDashboardSetting = (key: string, def: string) => {\\n' +
    '  try {\\n' +
    '    const d = JSON.parse(localStorage.getItem(\\'iqassess_dashboard_config\\') || \\'{}\\');\\n' +
    '    return d[key] || def;\\n' +
    '  } catch(e) {\\n' +
    '    return def;\\n' +
    '  }\\n' +
    '};\\n\\n' +
    'export default function App() {'
  );
}

const replacements = [
  { stateName: 'omrInstitutionName', key: 'institution' },
  { stateName: 'mcqInstitution', key: 'institution' },
  { stateName: 'adsInstitution', key: 'institution' },
  { stateName: 'bpdsInstitution', key: 'institution' },
  { stateName: 'qpInstitutionName', key: 'institution' },
  { stateName: 'newRubricInstitution', key: 'institution' },
  { stateName: 'essayBuilderInstitution', key: 'institution' },
  { stateName: 'mcqBuilderInstitution', key: 'institution' },
  
  { stateName: 'baCourse', key: 'course' },
  { stateName: 'itemAnalysisCourse', key: 'course' },
  { stateName: 'currCourseName', key: 'course' },
  { stateName: 'bpdsCourse', key: 'course' },
  { stateName: 'newRubricCourse', key: 'course' },
  { stateName: 'essayBuilderCourse', key: 'course' },
  { stateName: 'mcqBuilderCourse', key: 'course' },

  { stateName: 'baSubject', key: 'subject' },
  { stateName: 'mcqSubjectTitle', key: 'subject' },
  { stateName: 'bpSubject', key: 'subject' },
  { stateName: 'adsSubject', key: 'subject' },
  { stateName: 'bpdsSubject', key: 'subject' },
  { stateName: 'qpSubject', key: 'subject' },
  { stateName: 'newRubricSubject', key: 'subject' },
  { stateName: 'essayBuilderSubject', key: 'subject' },
  { stateName: 'mcqBuilderSubject', key: 'subject' },

  { stateName: 'baTopic', key: 'topic' },
  { stateName: 'mcqTopicText', key: 'topic' },
  { stateName: 'mcqTopic', key: 'topic' },
  { stateName: 'adsTopic', key: 'topic' },
  { stateName: 'bpdsTopic', key: 'topic' },
  { stateName: 'essayBuilderTopic', key: 'topic' },
  { stateName: 'mcqBuilderTopic', key: 'topic' }
];

replacements.forEach(({ stateName, key }) => {
  const setterName = 'set' + stateName.charAt(0).toUpperCase() + stateName.slice(1);
  const regexStr = 'const \\\\[\\\\s*' + stateName + '\\\\s*,\\\\s*' + setterName + '\\\\s*\\\\]\\\\s*=\\\\s*useState(?:<string>)?\\\\((.*?)\\\\)';
  const regex = new RegExp(regexStr, 'g');
  
  content = content.replace(regex, (match, p1) => {
    if (p1.includes('getDashboardSetting') || p1.includes('getInitialHistory')) {
      return match;
    }
    return 'const [' + stateName + ', ' + setterName + '] = useState<string>(getDashboardSetting(\\'' + key + '\\', ' + p1 + '))';
  });
});

fs.writeFileSync(appTsxPath, content);
console.log('App.tsx updated with getDashboardSetting helpers.');
