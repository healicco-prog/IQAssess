const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const handleScanOld = `  const handleScanStudentMcq = async () => {
    if (!studentMcqName) {
      triggerAlert('error', 'Please fill in Student Full Name.');
      return;
    }
    if (!studentMcqRegNo) {
      triggerAlert('error', 'Please fill in Register / Index Number.');
      return;
    }
    if (!studentMcqFile) {
      triggerAlert('error', 'Please choose or upload a student answered OMR script photo.');
      return;
    }

    setIsScanningMcq(true);
    setScannedMcqResult(null);

    // High-fidelity active OMR scan simulation with visual scanner line
    setTimeout(async () => {
      const studentAnswers: Record<number, string> = {};
      let correctCount = 0;

      mcqQuestionsList.forEach(q => {
        // High likelihood of correct answers for active student simulation
        const randomThreshold = Math.random();
        let studentAns = q.correctKey;
        if (randomThreshold > 0.82) {
          // select wrong answer
          const incorrectOpts = q.options.filter(o => o.key !== q.correctKey).map(o => o.key);
          studentAns = incorrectOpts[Math.floor(Math.random() * incorrectOpts.length)] || 'B';
        }
        
        studentAnswers[q.id] = studentAns;
        if (studentAns === q.correctKey) {
          correctCount++;
        }
      });

      // Customized feedback note based on results
      let feedback = \`Excellent comprehension showing strong retention! Only missed \${mcqQuestionsList.length - correctCount} question(s). Keep reviewing biochemical kinetics.\`;
      if (correctCount === mcqQuestionsList.length) {
        feedback = \`Perfect score! Outstanding mastery of all topics evaluated. Excellent preparation shown.\`;
      } else if (correctCount <= mcqQuestionsList.length / 2) {
        feedback = \`Baseline understanding identified. Review molecular foundations and stroma chemical dependencies closely.\`;
      }

      setScannedMcqResult({
        name: studentMcqName,
        regNo: studentMcqRegNo,
        answers: studentAnswers,
        score: correctCount,
        total: mcqQuestionsList.length,
        feedback: feedback
      });

      setIsScanningMcq(false);
      triggerAlert('success', \`Completed scanning OMR script. Identified \${correctCount}/\${mcqQuestionsList.length} marks.\`);
    }, 2200);
  };`;

const handleScanNew = `  const handleScanStudentMcq = async () => {
    if (!studentMcqFile) {
      triggerAlert('error', 'Please choose or upload a student answered OMR script photo.');
      return;
    }
    
    // Auto-fill student info if empty (simulating OCR extraction)
    const scanName = studentMcqName || "Simulated Student";
    const scanRegNo = studentMcqRegNo || \`REG/\${new Date().getFullYear()}/\${Math.floor(1000 + Math.random() * 9000)}\`;

    if (!studentMcqName) setStudentMcqName(scanName);
    if (!studentMcqRegNo) setStudentMcqRegNo(scanRegNo);

    setIsScanningMcq(true);
    setScannedMcqResult(null);

    // High-fidelity active OMR scan simulation with visual scanner line
    setTimeout(async () => {
      const studentAnswers: Record<number, string> = {};
      let correctCount = 0;
      const totalQs = Object.keys(omrAnswerKeys).length || omrNumQuestions;

      Array.from({ length: totalQs }).forEach((_, i) => {
        const qId = omrQuestionStartIndex + i;
        const correctKey = omrAnswerKeys[qId] || 'A';
        
        // High likelihood of correct answers for active student simulation
        const randomThreshold = Math.random();
        let studentAns = correctKey;
        if (randomThreshold > 0.82) {
          // select wrong answer
          const incorrectOpts = ['A', 'B', 'C', 'D'].filter(o => o !== correctKey);
          studentAns = incorrectOpts[Math.floor(Math.random() * incorrectOpts.length)] || 'B';
        }
        
        studentAnswers[qId] = studentAns;
        if (studentAns === correctKey) {
          correctCount++;
        }
      });

      // Customized feedback note based on results
      let feedback = \`Excellent comprehension showing strong retention! Only missed \${totalQs - correctCount} question(s). Keep reviewing biochemical kinetics.\`;
      if (correctCount === totalQs) {
        feedback = \`Perfect score! Outstanding mastery of all topics evaluated. Excellent preparation shown.\`;
      } else if (correctCount <= totalQs / 2) {
        feedback = \`Baseline understanding identified. Review molecular foundations and stroma chemical dependencies closely.\`;
      }

      setScannedMcqResult({
        name: scanName,
        regNo: scanRegNo,
        answers: studentAnswers,
        score: correctCount,
        total: totalQs,
        feedback: feedback
      });

      setIsScanningMcq(false);
      triggerAlert('success', \`Completed scanning OMR script. Identified \${correctCount}/\${totalQs} marks.\`);
    }, 2200);
  };`;

content = content.replace(handleScanOld, handleScanNew);

// 2. Fix UI render logic: Left Bubble Grid
const leftRenderOld = `{mcqQuestionsList.map((q) => {
                                  const studentAns = scannedMcqResult.answers[q.id];
                                  const isCorrect = studentAns === q.correctKey;
                                  return (
                                    <div key={q.id} className="flex justify-between items-center py-1 text-[11px] border-b border-stone-200/50">
                                      <span className="font-mono text-slate-500 font-bold dark:text-stone-300">{q.label || \`L\${q.id}\`}</span>
                                      <div className="flex gap-2">
                                        {['A', 'B', 'C', 'D'].map(ch => {
                                          const wasSelected = studentAns === ch;
                                          const isKey = q.correctKey === ch;`;

const leftRenderNew = `{Array.from({ length: scannedMcqResult.total }).map((_, i) => {
                                  const qId = omrQuestionStartIndex + i;
                                  const studentAns = scannedMcqResult.answers[qId];
                                  const correctKey = omrAnswerKeys[qId] || 'A';
                                  const isCorrect = studentAns === correctKey;
                                  return (
                                    <div key={qId} className="flex justify-between items-center py-1 text-[11px] border-b border-stone-200/50">
                                      <span className="font-mono text-slate-500 font-bold dark:text-stone-300">Q{qId}</span>
                                      <div className="flex gap-2">
                                        {['A', 'B', 'C', 'D'].map(ch => {
                                          const wasSelected = studentAns === ch;
                                          const isKey = correctKey === ch;`;

content = content.replace(leftRenderOld, leftRenderNew);

// 3. Fix UI render logic: Right Score Breakdown
const rightRenderOld = `{mcqQuestionsList.map((q) => {
                                  const ans = scannedMcqResult.answers[q.id];
                                  const matches = ans === q.correctKey;
                                  return (
                                    <div key={q.id} className="flex justify-between items-center text-xs p-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                                      <div className="truncate max-w-[120px]">
                                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{q.label || \`Q\${q.id}\`}.</span> 
                                        <span className="text-slate-500 ml-1 truncate">{q.text}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-[10px] text-slate-400">
                                          [{ans}] vs Key [{q.correctKey}]
                                        </span>`;

const rightRenderNew = `{Array.from({ length: scannedMcqResult.total }).map((_, i) => {
                                  const qId = omrQuestionStartIndex + i;
                                  const correctKey = omrAnswerKeys[qId] || 'A';
                                  const ans = scannedMcqResult.answers[qId];
                                  const matches = ans === correctKey;
                                  return (
                                    <div key={qId} className="flex justify-between items-center text-xs p-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                                      <div className="truncate max-w-[120px]">
                                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">Q{qId}.</span> 
                                        <span className="text-slate-500 ml-1 truncate">OMR Question {qId}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-[10px] text-slate-400">
                                          [{ans}] vs Key [{correctKey}]
                                        </span>`;

content = content.replace(rightRenderOld, rightRenderNew);

fs.writeFileSync(file, content);
console.log("Successfully fixed handleScanStudentMcq and UI.");
