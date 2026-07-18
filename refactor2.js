const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/App.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

const replaceUI = (formName, regexStr) => {
  const regex = new RegExp(regexStr);
  if (regex.test(content)) {
    content = content.replace(regex, `<div className="col-span-full"><CurriculumSelectors formState={${formName}} setFormState={set${formName.charAt(0).toUpperCase() + formName.slice(1)}} isDarkMode={isDarkMode} /></div>`);
    console.log(`Replaced UI for ${formName}`);
  } else {
    console.log(`Failed to find UI for ${formName}`);
  }
};

// 5. Essay Builder (HistoryInput format)
// The label is <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Course / Programme</label>
replaceUI('rubricBuilderForm', '<div className="space-y-1">\\s*<label className="text-\\[10px\\] uppercase tracking-widest text-slate-400 font-bold block mb-1">Course \\/ Programme<\\/label>[\\s\\S]*?<HistoryInput\\s*storageKey="essay_topic"[\\s\\S]*?\\/>\\s*<\\/div>');

// 6. MCQ Builder
// It also probably uses HistoryInput or standard inputs. Let's match Course / Programme up to Topic / Theme
replaceUI('bpBuilderForm', '<div className="space-y-1\\.5">\\s*<label className="text-slate-600 dark:text-slate-300 block">Course \\/ Programme[\\s\\S]*?<div>\\s*<label className="text-slate-600 dark:text-slate-300 block">Topic \\/ Theme[\\s\\S]*?<\\/div>');

// Just generically replace any Course / Programme div that is followed by Subject Name and Topic / Theme, if we can identify the form variable.
// I will just use run_command to replace them if I know their exact variables. Let's find out what forms they are bound to.

fs.writeFileSync(filePath, content, 'utf-8');
