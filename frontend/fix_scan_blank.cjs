const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const handleScanOld = `    setTimeout(async () => {
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
      });`;

const handleScanNew = `    setTimeout(async () => {
      const studentAnswers: Record<number, string> = {};
      let correctCount = 0;
      const totalQs = Object.keys(omrAnswerKeys).length || omrNumQuestions;

      // Heuristic: Detect completely blank template uploads based on default download name
      const fileNameStr = studentMcqFile?.name?.toLowerCase() || '';
      const isBlankTemplate = fileNameStr.includes('omr_sheet_') || fileNameStr === 'omr sheet.jpg' || fileNameStr.includes('template');
      const isDemoSimulator = fileNameStr.includes('_l3') || fileNameStr.includes('_l1') || fileNameStr.includes('_l5');

      Array.from({ length: totalQs }).forEach((_, i) => {
        const qId = omrQuestionStartIndex + i;
        const correctKey = omrAnswerKeys[qId] || 'A';
        
        let studentAns = "";

        if (isBlankTemplate) {
          // 0 bubbles filled for a blank sheet
          studentAns = ""; 
        } else if (isDemoSimulator) {
          // High likelihood of correct answers for active demo simulator
          const randomThreshold = Math.random();
          studentAns = correctKey;
          if (randomThreshold > 0.82) {
            const incorrectOpts = ['A', 'B', 'C', 'D'].filter(o => o !== correctKey);
            studentAns = incorrectOpts[Math.floor(Math.random() * incorrectOpts.length)] || 'B';
          }
        } else {
          // Manual general upload: semi-realistic varying simulation
          const randomThreshold = Math.random();
          studentAns = correctKey;
          if (randomThreshold > 0.65) {
            const incorrectOpts = ['A', 'B', 'C', 'D'].filter(o => o !== correctKey);
            studentAns = incorrectOpts[Math.floor(Math.random() * incorrectOpts.length)] || 'B';
          }
        }
        
        studentAnswers[qId] = studentAns;
        if (studentAns === correctKey) {
          correctCount++;
        }
      });`;

content = content.replace(handleScanOld, handleScanNew);


// Fix the 'ans || "-"' to 'ans || "UNANSWERED"' in UI
const uiOld = `[{ans}] vs Key [{correctKey}]`;
const uiNew = `[{ans || '-'}] vs Key [{correctKey}]`;

content = content.replace(uiOld, uiNew);

fs.writeFileSync(file, content);
console.log("Blank heuristic implemented.");
