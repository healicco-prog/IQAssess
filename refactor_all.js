const fs = require('fs');

let content = fs.readFileSync('frontend/src/App.tsx', 'utf-8');

// 1. Paper AS
const paperTarget = `                            <div className="space-y-1.5">
                              <label className="text-slate-600 dark:text-slate-300 block">Course / Programme <span className="text-red-500 font-bold">*</span></label>
                              <input 
                                type="text"
                                value={customPaperForm.className}
                                onChange={(e) => setCustomPaperForm(prev => ({ ...prev, className: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg p-2.5 outline-none focus:border-blue-500"
                                placeholder="which Class/ Course/ etc details"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-slate-600 dark:text-slate-300 block">Subject Name <span className="text-red-500 font-bold">*</span></label>
                              <input 
                                type="text"
                                value={customPaperForm.subject}
                                onChange={(e) => setCustomPaperForm(prev => ({ ...prev, subject: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg p-2.5 outline-none focus:border-blue-500"
                                placeholder="e.g. Fluid Mechanics & Fluid Machines"
                              />
                            </div>

                          </div>

                          <div className="space-y-1.5 text-xs font-semibold">
                            <label className="text-slate-600 dark:text-slate-300 block">Topic / Theme</label>
                            <input 
                              type="text"
                              value={customPaperForm.topic}
                              onChange={(e) => setCustomPaperForm(prev => ({ ...prev, topic: e.target.value }))}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg p-2.5 outline-none focus:border-blue-500"
                              placeholder="Chapter 4: Bernoulli's Equation, Viscosity, Reynolds Limit"
                            />
                          </div>`;
const paperReplace = `                            <div className="col-span-full">
                              <CurriculumSelectors formState={customPaperForm} setFormState={setCustomPaperForm} isDarkMode={isDarkMode} />
                            </div>
                          </div>`;
if (content.includes(paperTarget)) {
    content = content.replace(paperTarget, paperReplace);
    console.log("Paper AS replaced");
} else {
    console.log("Paper AS NOT FOUND");
}


// 2. Essay AS
const essayTarget = `                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Course / Programme <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={essayForm.className}
                        onChange={(e) => setEssayForm({...essayForm, className: e.target.value})}
                        placeholder="e.g. Year 3 / Law School / Sec B"
                        className={\`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500 \${isDarkMode ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-stone-900'}\`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Subject Name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={essayForm.subject}
                        onChange={(e) => setEssayForm({...essayForm, subject: e.target.value})}
                        placeholder="e.g. Antitrust Law"
                        className={\`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500 \${isDarkMode ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-stone-900'}\`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Topic / Theme</label>
                      <input 
                        type="text"
                        required
                        value={essayForm.topic}
                        onChange={(e) => setEssayForm({...essayForm, topic: e.target.value})}
                        placeholder="e.g. Sherman Act Section 2: Unilateral Mergers vs Joint Ventures"
                        className={\`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500 \${isDarkMode ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-stone-900'}\`}
                      />
                    </div>`;
const essayReplace = `                    <div className="col-span-full">
                      <CurriculumSelectors formState={essayForm} setFormState={setEssayForm} isDarkMode={isDarkMode} />
                    </div>`;
if (content.includes(essayTarget)) {
    content = content.replace(essayTarget, essayReplace);
    console.log("Essay AS replaced");
} else {
    console.log("Essay AS NOT FOUND");
}


// 3. MCQ AS
const mcqStateTarget = `  const [mcqGradeLevel, setMcqGradeLevel] = useState<string>('B.Pharm / Medical Programs');`;
const mcqStateReplace = `  const [mcqInstitution, setMcqInstitution] = useState<string>('');
  const [mcqGradeLevel, setMcqGradeLevel] = useState<string>('B.Pharm / Medical Programs');
  const [mcqTopic, setMcqTopic] = useState<string>('');`;
if (content.includes(mcqStateTarget)) {
    content = content.replace(mcqStateTarget, mcqStateReplace);
    console.log("MCQ State replaced");
}

const mcqTarget = `                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                          Course / Programme <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={mcqGradeLevel}
                          onChange={(e) => setMcqGradeLevel(e.target.value)}
                          placeholder="e.g. B.Pharm / Medical Programs"
                          className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-stone-900 dark:text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                          Subject Name <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={mcqSubjectTitle}
                          onChange={(e) => setMcqSubjectTitle(e.target.value)}
                          placeholder="e.g. Pharmacology"
                          className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-stone-900 dark:text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none font-sans"
                        />
                      </div>`;
const mcqReplace = `                      <div className="col-span-full">
                        <CurriculumSelectors 
                          institution={mcqInstitution} setInstitution={setMcqInstitution}
                          course={mcqGradeLevel} setCourse={setMcqGradeLevel}
                          subject={mcqSubjectTitle} setSubject={setMcqSubjectTitle}
                          topic={mcqTopic} setTopic={setMcqTopic}
                          isDarkMode={isDarkMode}
                        />
                      </div>`;
if (content.includes(mcqTarget)) {
    content = content.replace(mcqTarget, mcqReplace);
    console.log("MCQ AS replaced");
} else {
    console.log("MCQ AS NOT FOUND");
}


// 4. Reflection AS
const reflectionTarget = `                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Course / Programme <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={reflectionForm.className}
                        onChange={(e) => setReflectionForm({...reflectionForm, className: e.target.value})}
                        placeholder="e.g. Year 4 / Medical School / Pharmacology"
                        className={\`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500 bg-transparent \${isDarkMode ? 'border-slate-700 text-white' : 'border-slate-200 text-stone-900'}\`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Subject Name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={reflectionForm.subject}
                        onChange={(e) => setReflectionForm({...reflectionForm, subject: e.target.value})}
                        placeholder="e.g. Clinical Ethics"
                        className={\`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500 bg-transparent \${isDarkMode ? 'border-slate-700 text-white' : 'border-slate-200 text-stone-900'}\`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Topic / Theme</label>
                      <input 
                        type="text"
                        required
                        value={reflectionForm.topic}
                        onChange={(e) => setReflectionForm({...reflectionForm, topic: e.target.value})}
                        placeholder="e.g. Metacognitive Response to Palliative Care"
                        className={\`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500 bg-transparent \${isDarkMode ? 'border-slate-700 text-white' : 'border-slate-200 text-stone-900'}\`}
                      />
                    </div>`;
const reflectionReplace = `                    <div className="col-span-full">
                      <CurriculumSelectors formState={reflectionForm} setFormState={setReflectionForm} isDarkMode={isDarkMode} />
                    </div>`;
if (content.includes(reflectionTarget)) {
    content = content.replace(reflectionTarget, reflectionReplace);
    console.log("Reflection AS replaced");
} else {
    console.log("Reflection AS NOT FOUND");
}


// 5. Essay Builder
const essayBStateTarget = `  const [essayBuilderCourse, setEssayBuilderCourse] = useState<string>(getInitialHistory('course'));`;
const essayBStateReplace = `  const [essayBuilderInstitution, setEssayBuilderInstitution] = useState<string>('');
  const [essayBuilderCourse, setEssayBuilderCourse] = useState<string>(getInitialHistory('course'));`;
if (content.includes(essayBStateTarget)) {
    content = content.replace(essayBStateTarget, essayBStateReplace);
}
const essayBTarget = `                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Course / Programme <span className="text-red-500 font-bold">*</span>
                      </label>
                      <HistoryInput 
                        storageKey="course"
                        type="text" 
                        value={essayBuilderCourse}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEssayBuilderCourse(e.target.value)}
                        placeholder="e.g. BTech, English Literature Major"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-stone-900 dark:text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Subject Name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <HistoryInput 
                        storageKey="subject"
                        type="text" 
                        value={essayBuilderSubject}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEssayBuilderSubject(e.target.value)}
                        placeholder="e.g. English Literature, History"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-stone-900 dark:text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Topic / Theme</label>
                      <HistoryInput 
                        storageKey="essay_topic"
                        type="text" 
                        value={essayBuilderTopic}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEssayBuilderTopic(e.target.value)}
                        placeholder="e.g. Themes of Isolation in Mary Shelley's Frankenstein"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-stone-900 dark:text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>`;
const essayBReplace = `                    <div className="col-span-full">
                      <CurriculumSelectors 
                        institution={essayBuilderInstitution} setInstitution={setEssayBuilderInstitution}
                        course={essayBuilderCourse} setCourse={setEssayBuilderCourse}
                        subject={essayBuilderSubject} setSubject={setEssayBuilderSubject}
                        topic={essayBuilderTopic} setTopic={setEssayBuilderTopic}
                        isDarkMode={isDarkMode}
                      />
                    </div>`;
if (content.includes(essayBTarget)) {
    content = content.replace(essayBTarget, essayBReplace);
    console.log("Essay Builder replaced");
} else {
    console.log("Essay Builder NOT FOUND");
}


// 6. MCQ Builder
const mcqBTarget = `                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Course / Programme <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={mcqBuilderCourse}
                        onChange={(e) => setMcqBuilderCourse(e.target.value)}
                        placeholder="e.g. AP Biology, Medicine Year 1"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-stone-900 dark:text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Subject Name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={mcqBuilderSubject}
                        onChange={(e) => setMcqBuilderSubject(e.target.value)}
                        placeholder="e.g. Biology, Chemistry"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-stone-900 dark:text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Topic / Theme</label>
                      <input 
                        type="text" 
                        value={mcqBuilderTopic}
                        onChange={(e) => setMcqBuilderTopic(e.target.value)}
                        placeholder="e.g. Photosynthesis Light Reactions"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-stone-900 dark:text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>`;
const mcqBReplace = `                    <div className="col-span-full">
                      <CurriculumSelectors 
                        institution={mcqBuilderInstitution} setInstitution={setMcqBuilderInstitution}
                        course={mcqBuilderCourse} setCourse={setMcqBuilderCourse}
                        subject={mcqBuilderSubject} setSubject={setMcqBuilderSubject}
                        topic={mcqBuilderTopic} setTopic={setMcqBuilderTopic}
                        isDarkMode={isDarkMode}
                      />
                    </div>`;
if (content.includes(mcqBTarget)) {
    content = content.replace(mcqBTarget, mcqBReplace);
    console.log("MCQ Builder replaced");
} else {
    console.log("MCQ Builder NOT FOUND");
}


// 7. Assessment DS
const adsTarget = `                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Course / Programme <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={adsInstitution}
                        onChange={(e) => setAdsInstitution(e.target.value)}
                        placeholder="e.g. MBBS 3rd Batch - Department of Pharmacology"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-stone-900 dark:text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Parameter 5 & 6: Subject Name * & Topic / Theme */}
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Subject Name <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={adsSubject}
                          onChange={(e) => setAdsSubject(e.target.value)}
                          placeholder="e.g. Pharmacology Paper I"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-stone-900 dark:text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Topic / Theme</label>
                        <input 
                          type="text" 
                          value={adsTopic}
                          onChange={(e) => setAdsTopic(e.target.value)}
                          placeholder="e.g. Hofmann elimination, Tropicamide, and Parkinson Therapy"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-stone-900 dark:text-white rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>`;
const adsReplace = `                    <div className="col-span-full">
                      <CurriculumSelectors 
                        institution={adsActualInstitution} setInstitution={setAdsActualInstitution}
                        course={adsInstitution} setCourse={setAdsInstitution}
                        subject={adsSubject} setSubject={setAdsSubject}
                        topic={adsTopic} setTopic={setAdsTopic}
                        isDarkMode={isDarkMode}
                      />
                    </div>`;
if (content.includes(adsTarget)) {
    content = content.replace(adsTarget, adsReplace);
    console.log("Assessment DS replaced");
} else {
    console.log("Assessment DS NOT FOUND");
}


// 8. Blueprint DS
const bpdsTarget = `                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wide font-bold text-slate-500 dark:text-slate-400 mb-1">Course / Programme</label>
                          <input 
                            type="text" 
                            value={bpdsCourse}
                            onChange={(e) => setBpdsCourse(e.target.value)}
                            placeholder="Type the Course Name or Code"
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-stone-900 dark:text-white rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wide font-bold text-slate-500 dark:text-slate-400 mb-1">Year</label>
                          <input 
                            type="text" 
                            value={bpdsYear}
                            onChange={(e) => setBpdsYear(e.target.value)}
                            placeholder="Type which year"
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-stone-900 dark:text-white rounded-lg font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wide font-bold text-slate-500 dark:text-slate-400 mb-1">Subject Name</label>
                          <input 
                            type="text" 
                            value={bpdsSubject}
                            onChange={(e) => setBpdsSubject(e.target.value)}
                            placeholder="Type Subject"
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-stone-900 dark:text-white rounded-lg font-sans"
                          />
                        </div>
                      </div>`;
const bpdsReplace = `                      <div className="col-span-full mt-3">
                        <CurriculumSelectors 
                          institution={bpdsInstitution} setInstitution={setBpdsInstitution}
                          course={bpdsCourse} setCourse={setBpdsCourse}
                          subject={bpdsSubject} setSubject={setBpdsSubject}
                          topic={bpdsTopic} setTopic={setBpdsTopic}
                          isDarkMode={isDarkMode}
                        />
                      </div>`;
if (content.includes(bpdsTarget)) {
    content = content.replace(bpdsTarget, bpdsReplace);
    console.log("Blueprint DS replaced");
} else {
    console.log("Blueprint DS NOT FOUND");
}


// 9. Rubrics DS
const rubricTarget = `                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Course / Programme <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={newRubricCourse}
                        onChange={(e) => setNewRubricCourse(e.target.value)}
                        placeholder="e.g. Business Administration"
                        className="w-full px-3 py-2 text-sm border rounded bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#111827] dark:border-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Subject Name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={newRubricSubject}
                        onChange={(e) => setNewRubricSubject(e.target.value)}
                        placeholder="e.g. Business Ethics & Communication"
                        className="w-full px-3 py-2 text-sm border rounded bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#111827] dark:border-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Topic / Theme <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={newRubricTitle}
                        onChange={(e) => setNewRubricTitle(e.target.value)}
                        placeholder="e.g. Critical Thinking Presentation"
                        className="w-full px-3 py-2 text-sm border rounded bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#111827] dark:border-slate-800 dark:text-white"
                      />
                    </div>`;
const rubricReplace = `                    <div className="col-span-full">
                      <CurriculumSelectors 
                        institution={newRubricInstitution} setInstitution={setNewRubricInstitution}
                        course={newRubricCourse} setCourse={setNewRubricCourse}
                        subject={newRubricSubject} setSubject={setNewRubricSubject}
                        topic={newRubricTitle} setTopic={setNewRubricTitle}
                        isDarkMode={isDarkMode}
                      />
                    </div>`;
if (content.includes(rubricTarget)) {
    content = content.replace(rubricTarget, rubricReplace);
    console.log("Rubric DS replaced");
} else {
    console.log("Rubric DS NOT FOUND");
}

fs.writeFileSync('frontend/src/App.tsx', content);
