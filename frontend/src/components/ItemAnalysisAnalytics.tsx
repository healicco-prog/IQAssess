import React, { useState, useRef } from 'react';
import { 
  GraduationCap, 
  TrendingUp, 
  FileCheck, 
  UploadCloud, 
  Database, 
  Brain, 
  BarChart3, 
  PieChart, 
  Layers, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Fingerprint, 
  Download, 
  Folder, 
  Plus, 
  UserCheck, 
  Lock, 
  BookOpen, 
  Settings, 
  History,
  FileText,
  HelpCircle,
  Eye,
  Check,
  ChevronRight,
  Shield,
  Activity,
  User,
  Users,
  Copy,
  AlertCircle,
  RefreshCw,
  Printer
} from 'lucide-react';

interface ItemAnalysisAnalyticsProps {
  isDarkMode: boolean;
  triggerAlert: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

// Interfaces for structured data
interface QuestionItem {
  id: string;
  number: string;
  text: string;
  type: string; // MCQ, Short Answer, Long Answer, Clinical Case, etc.
  topic: string;
  subtopic: string;
  competency: string;
  bloomLevel: 'Knowledge' | 'Understanding' | 'Application' | 'Analysis' | 'Evaluation' | 'Creation';
  difficulty: 'Easy' | 'Moderate' | 'Difficult';
  clinicalRelevance: 'High' | 'Medium' | 'Low';
  learningOutcome: string;
  marks: number;
  // Psychometric metrics
  difficultyIndex: number; // p-value
  discriminationIndex: number; // d-value
  facilityValue: number;
  pointBiserial: number;
  distractorEfficiency: number;
  reliabilityContribution: number;
  variance: number;
  mean: number;
  stdDev: number;
  passPct: number;
  failPct: number;
  distRates: Record<string, number>; // Distractor chosen percentages e.g. { A: 70, B: 10, C: 15, D: 5 }
  recommendedAction: 'Retain' | 'Modify' | 'Discard';
  aiRecommendation: string;
}

interface AssessmentReport {
  overallQualityScore: number; // e.g. 91
  qualityRating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  kr20: number;
  cronbachAlpha: number;
  splitHalf: number;
  sem: number; // Standard Error of Measurement
  
  // Section 1 Overview
  totalQuestions: number;
  totalMarks: number;
  duration: string;
  avgMarksPerQuestion: number;
  avgTimePerQuestion: string;
  
  // Topic Distribution
  topics: { name: string; expected: number; actual: number }[];
  
  // Competencies Mapped
  competencies: { name: string; status: 'Mapped' | 'Achieved' | 'Partially Achieved' | 'Missed'; code: string }[];
  
  // Learning Outcomes
  learningOutcomes: { name: string; status: 'Mapped' | 'Achieved' | 'Partially Achieved' | 'Missed'; count: number }[];
  
  // Student stats
  avgScore: number;
  highestScore: number;
  lowestScore: number;
  studentPassPct: number;
  studentFailPct: number;
  studentStdDev: number;
  quartiles: { q1: number; q2: number; q3: number };
  scoreDistribution: { range: string; count: number }[];
  
  // AI Auditor Findings
  auditorFindings: { type: string; questionId: string; description: string; severity: 'High' | 'Medium' | 'Low' }[];
  
  // Quality Indicators
  indicators: {
    aqi: number; // Assessment Quality Index
    qqi: number; // Question Quality Index
    difficultyBalance: number;
    blueprintCompliance: number;
    cbmeCompliance: number;
    facultyQuality: number;
    readinessScore: number;
  };
}

// Preset configurations with rich data (so they don't have to write from scratch)
const PRESETS = [
  {
    id: "pharm-preset",
    course: "MBBS (Medicine)",
    programme: "Undergraduate (UG)",
    classYear: "III Phase I",
    semester: "Semester 5",
    department: "Pharmacology",
    subject: "General Pharmacology",
    paper: "Paper I",
    topic: "Pharmacokinetics & Dynamics",
    subtopic: "Drug Metabolism & Receptor Binding",
    faculty: "Prof. Dr. Sarah Jenkins",
    university: "National Medical College",
    academicYear: "2025-2026",
    examType: "Summative",
    assessmentType: "University Exam",
    numStudents: "85",
    maxMarks: "100",
    passMarks: "50",
    duration: "3 Hours",
    credits: "4 Credits",
    competencyMapping: "PH1.1 to PH1.10 CBME Standards",
    bloomLevelDistribution: "K: 30%, U: 40%, Ap: 20%, An: 10%",
    blueprintSelection: "CBME Curriculum Blueprint 2024",
    overallQualityScore: 92,
    qualityRating: "Excellent" as const,
    questions: [
      {
        id: "Q-01",
        number: "Q1",
        text: "Which of the following microsomal enzymes is primary responsible for the oxidative metabolism of over 50% of clinically prescribed therapeutic drugs?",
        type: "MCQ",
        topic: "Pharmacokinetics",
        subtopic: "Drug Metabolism",
        competency: "PH1.3 Metabolism Pathways",
        bloomLevel: "Knowledge" as const,
        difficulty: "Easy" as const,
        clinicalRelevance: "High" as const,
        learningOutcome: "Identify first-pass hepatic metabolism pathways",
        marks: 2,
        difficultyIndex: 0.88,
        discriminationIndex: 0.35,
        facilityValue: 88,
        pointBiserial: 0.42,
        distractorEfficiency: 95,
        reliabilityContribution: 0.04,
        variance: 0.11,
        mean: 1.76,
        stdDev: 0.32,
        passPct: 88,
        failPct: 12,
        distRates: { A: 88, B: 4, C: 6, D: 2 }, // A is correct
        recommendedAction: "Retain" as const,
        aiRecommendation: "Excellent performance parameters. Optimal distractor spread. Retain item in the active master bank."
      },
      {
        id: "Q-02",
        number: "Q2",
        text: "A 45-year-old male with chronic renal impairment requires anticoagulant therapy. Why is low molecular weight heparin preferred over unfractionated heparin, and how is its therapeutic clearance adjusted?",
        type: "Clinical Case",
        topic: "Pharmacokinetics",
        subtopic: "Drug Excretion",
        competency: "PH1.5 Renal Clearance",
        bloomLevel: "Application" as const,
        difficulty: "Difficult" as const,
        clinicalRelevance: "High" as const,
        learningOutcome: "Determine dosing modifications in organ failure",
        marks: 10,
        difficultyIndex: 0.41,
        discriminationIndex: 0.48,
        facilityValue: 41,
        pointBiserial: 0.51,
        distractorEfficiency: 80,
        reliabilityContribution: 0.08,
        variance: 2.1,
        mean: 4.1,
        stdDev: 1.8,
        passPct: 48,
        failPct: 52,
        distRates: { A: 15, B: 20, C: 41, D: 24 }, // C is correct
        recommendedAction: "Retain" as const,
        aiRecommendation: "High clinical utility. Strong discrimination power (d = 0.48) effectively separates upper and lower quartiles."
      },
      {
        id: "Q-03",
        number: "Q3",
        text: "Under steady-state kinetics, if a drug's rate of elimination is directly proportional to its plasma concentration, it is classified under first-order kinetics. Which parameter remains strictly constant?",
        type: "MCQ",
        topic: "Pharmacokinetics",
        subtopic: "Steady State",
        competency: "PH1.4 Clearance Rates",
        bloomLevel: "Understanding" as const,
        difficulty: "Moderate" as const,
        clinicalRelevance: "Medium" as const,
        learningOutcome: "Explain mathematical modeling of drug clearance",
        marks: 2,
        difficultyIndex: 0.65,
        discriminationIndex: 0.38,
        facilityValue: 65,
        pointBiserial: 0.39,
        distractorEfficiency: 90,
        reliabilityContribution: 0.03,
        variance: 0.23,
        mean: 1.3,
        stdDev: 0.48,
        passPct: 65,
        failPct: 35,
        distRates: { A: 12, B: 65, C: 18, D: 5 }, // B is correct
        recommendedAction: "Retain" as const,
        aiRecommendation: "Satisfactory difficulty and discrimination metrics. Option D has low selection rate. Consider strengthening Option D."
      },
      {
        id: "Q-04",
        number: "Q4",
        text: "A patient suffering from organophosphate poisoning is rushed to the emergency department. Explain the molecular mechanism of pralidoxime as an acetylcholinesterase reactivator.",
        type: "Short Answer",
        topic: "Pharmacodynamics",
        subtopic: "Receptor Antagonism",
        competency: "PH2.1 Autonomic Drugs",
        bloomLevel: "Analysis" as const,
        difficulty: "Moderate" as const,
        clinicalRelevance: "High" as const,
        learningOutcome: "Describe antidote kinetics in toxicity management",
        marks: 5,
        difficultyIndex: 0.58,
        discriminationIndex: 0.11,
        facilityValue: 58,
        pointBiserial: 0.12,
        distractorEfficiency: 50,
        reliabilityContribution: -0.02,
        variance: 1.2,
        mean: 2.9,
        stdDev: 1.1,
        passPct: 58,
        failPct: 42,
        distRates: { A: 10, B: 58, C: 22, D: 10 }, // B is correct
        recommendedAction: "Modify" as const,
        aiRecommendation: "Low Discrimination index (d = 0.11). High-performing students and low-performing students score similarly. Review marking criteria."
      },
      {
        id: "Q-05",
        number: "Q5",
        text: "In zero-order elimination kinetics, the drug is cleared at a constant rate regardless of its plasma concentration. Which of the following drugs represents zero-order kinetics at therapeutic ranges?",
        type: "MCQ",
        topic: "Pharmacokinetics",
        subtopic: "Elimination Kinetics",
        competency: "PH1.4 Drug Elimination",
        bloomLevel: "Knowledge" as const,
        difficulty: "Easy" as const,
        clinicalRelevance: "Medium" as const,
        learningOutcome: "Distinguish between zero and first-order kinetics",
        marks: 2,
        difficultyIndex: 0.94,
        discriminationIndex: 0.05,
        facilityValue: 94,
        pointBiserial: 0.06,
        distractorEfficiency: 15,
        reliabilityContribution: -0.05,
        variance: 0.06,
        mean: 1.88,
        stdDev: 0.24,
        passPct: 94,
        failPct: 6,
        distRates: { A: 2, B: 2, C: 2, D: 94 }, // D is correct
        recommendedAction: "Discard" as const,
        aiRecommendation: "Too Easy (p = 0.94). It does not differentiate student performance. Discard or convert to testing therapeutic toxicity indices."
      }
    ],
    report: {
      overallQualityScore: 92,
      qualityRating: "Excellent" as const,
      kr20: 0.81,
      cronbachAlpha: 0.83,
      splitHalf: 0.79,
      sem: 2.4,
      totalQuestions: 5,
      totalMarks: 21,
      duration: "3 Hours",
      avgMarksPerQuestion: 4.2,
      avgTimePerQuestion: "36 Mins",
      topics: [
        { name: "Pharmacokinetics", expected: 60, actual: 55 },
        { name: "Pharmacodynamics", expected: 40, actual: 45 }
      ],
      competencies: [
        { name: "PH1.3 Metabolism Pathways", status: "Achieved", code: "PH1.3" },
        { name: "PH1.5 Renal Clearance", status: "Achieved", code: "PH1.5" },
        { name: "PH1.4 Clearance Rates", status: "Partially Achieved", code: "PH1.4" },
        { name: "PH2.1 Autonomic Drugs", status: "Partially Achieved", code: "PH2.1" }
      ],
      learningOutcomes: [
        { name: "hepatic metabolism", status: "Achieved", count: 85 },
        { name: "organ failure modifications", status: "Achieved", count: 41 },
        { name: "clearance mathematical modeling", status: "Partially Achieved", count: 65 },
        { name: "toxicity antidote kinetics", status: "Missed", count: 32 }
      ],
      avgScore: 71.4,
      highestScore: 96,
      lowestScore: 32,
      studentPassPct: 88,
      studentFailPct: 12,
      studentStdDev: 8.5,
      quartiles: { q1: 58, q2: 74, q3: 86 },
      scoreDistribution: [
        { range: "30-39", count: 2 },
        { range: "40-49", count: 8 },
        { range: "50-59", count: 12 },
        { range: "60-69", count: 22 },
        { range: "70-79", count: 25 },
        { range: "80-89", count: 11 },
        { range: "90-100", count: 5 }
      ],
      auditorFindings: [
        { type: "Weak Discriminator", questionId: "Q-04", description: "Pralidoxime mechanism short answer is not separating students. Re-evaluate rubric guidelines.", severity: "Medium" as const },
        { type: "Trivial Question", questionId: "Q-05", description: "Zero-order elimination MCQ is answered by 94% of students. Extremely low discrimination power.", severity: "High" as const },
        { type: "Poor Distractor Spread", questionId: "Q-03", description: "Option D (steady-state kinetics MCQ) was only selected by 5% of students.", severity: "Low" as const }
      ],
      indicators: {
        aqi: 91,
        qqi: 88,
        difficultyBalance: 85,
        blueprintCompliance: 94,
        cbmeCompliance: 96,
        facultyQuality: 92,
        readinessScore: 95
      }
    }
  },
  {
    id: "cs-preset",
    course: "B.Tech Computer Science",
    programme: "Undergraduate (UG)",
    classYear: "Year 3",
    semester: "Semester 6",
    department: "Computer Science & Engineering",
    subject: "Artificial Intelligence & Ethics",
    paper: "AI-302",
    topic: "Neural Networks & Bias Mitigation",
    subtopic: "Machine Learning Fairness Metrics",
    faculty: "Dr. Rachel Zhang",
    university: "Tech Institute of Technology",
    academicYear: "2025-2026",
    examType: "Internal Assessment",
    assessmentType: "Summative",
    numStudents: "120",
    maxMarks: "100",
    passMarks: "40",
    duration: "2 Hours",
    credits: "3 Credits",
    competencyMapping: "CS-AI-8.1 Fair Modeling Standards",
    bloomLevelDistribution: "K: 20%, U: 30%, Ap: 30%, An: 20%",
    blueprintSelection: "ACM Computer Science Curriculum 2023",
    overallQualityScore: 88,
    qualityRating: "Excellent" as const,
    questions: [
      {
        id: "Q-01",
        number: "Q1",
        text: "What is the primary mathematical definition of Demographic Parity in algorithmic fairness?",
        type: "MCQ",
        topic: "AI Ethics",
        subtopic: "Fairness Metrics",
        competency: "CS-AI-8.1",
        bloomLevel: "Understanding" as const,
        difficulty: "Moderate" as const,
        clinicalRelevance: "Low" as const,
        learningOutcome: "Define algorithmic bias mathematical formulas",
        marks: 5,
        difficultyIndex: 0.72,
        discriminationIndex: 0.39,
        facilityValue: 72,
        pointBiserial: 0.45,
        distractorEfficiency: 88,
        reliabilityContribution: 0.05,
        variance: 0.2,
        mean: 3.6,
        stdDev: 0.9,
        passPct: 72,
        failPct: 28,
        distRates: { A: 72, B: 10, C: 12, D: 6 }, // A is correct
        recommendedAction: "Retain" as const,
        aiRecommendation: "Optimal distribution. Validated difficulty index (p = 0.72) is within the highly desirable parameters."
      },
      {
        id: "Q-02",
        number: "Q2",
        text: "Explain the tradeoff between Equalized Odds and Predictive Parity in complex risk predictor neural networks.",
        type: "Short Answer",
        topic: "AI Ethics",
        subtopic: "Incompatibility Theorems",
        competency: "CS-AI-8.2 incompatibility Theorem",
        bloomLevel: "Analysis" as const,
        difficulty: "Difficult" as const,
        clinicalRelevance: "High" as const,
        learningOutcome: "Analyze constraints of multi-objective fairness optimization",
        marks: 10,
        difficultyIndex: 0.35,
        discriminationIndex: 0.45,
        facilityValue: 35,
        pointBiserial: 0.49,
        distractorEfficiency: 78,
        reliabilityContribution: 0.07,
        variance: 2.8,
        mean: 3.5,
        stdDev: 1.6,
        passPct: 35,
        failPct: 65,
        distRates: { A: 15, B: 35, C: 30, D: 20 }, // B is correct
        recommendedAction: "Retain" as const,
        aiRecommendation: "Great discriminator. Successfully identifies high-performing analytical students on complex compatibility theorems."
      }
    ],
    report: {
      overallQualityScore: 88,
      qualityRating: "Excellent" as const,
      kr20: 0.78,
      cronbachAlpha: 0.81,
      splitHalf: 0.76,
      sem: 3.1,
      totalQuestions: 2,
      totalMarks: 15,
      duration: "2 Hours",
      avgMarksPerQuestion: 7.5,
      avgTimePerQuestion: "60 Mins",
      topics: [
        { name: "AI Ethics", expected: 50, actual: 60 },
        { name: "Neural Networks", expected: 50, actual: 40 }
      ],
      competencies: [
        { name: "CS-AI-8.1 Fair Modeling", status: "Achieved", code: "CS-AI-8.1" },
        { name: "CS-AI-8.2 incompatibility Theorem", status: "Partially Achieved", code: "CS-AI-8.2" }
      ],
      learningOutcomes: [
        { name: "bias mathematical formulas", status: "Achieved", count: 72 },
        { name: "multi-objective fairness", status: "Partially Achieved", count: 35 }
      ],
      avgScore: 68.2,
      highestScore: 92,
      lowestScore: 41,
      studentPassPct: 91,
      studentFailPct: 9,
      studentStdDev: 7.2,
      quartiles: { q1: 60, q2: 70, q3: 82 },
      scoreDistribution: [
        { range: "30-39", count: 1 },
        { range: "40-49", count: 10 },
        { range: "50-59", count: 25 },
        { range: "60-69", count: 40 },
        { range: "70-79", count: 30 },
        { range: "80-89", count: 12 },
        { range: "90-100", count: 2 }
      ],
      auditorFindings: [
        { type: "Heavily Unbalanced", questionId: "Q-02", description: "Theoretical questions dominate 66% of overall paper weights.", severity: "Medium" as const }
      ],
      indicators: {
        aqi: 88,
        qqi: 86,
        difficultyBalance: 80,
        blueprintCompliance: 90,
        cbmeCompliance: 85,
        facultyQuality: 89,
        readinessScore: 91
      }
    }
  }
];

export default function ItemAnalysisAnalytics({ isDarkMode, triggerAlert }: ItemAnalysisAnalyticsProps) {
  // Input fields states
  const [course, setCourse] = useState('');
  const [programme, setProgramme] = useState('');
  const [classYear, setClassYear] = useState('');
  const [semester, setSemester] = useState('');
  const [department, setDepartment] = useState('');
  const [subject, setSubject] = useState('');
  const [paper, setPaper] = useState('');
  const [topic, setTopic] = useState('');
  const [subtopic, setSubtopic] = useState('');
  const [faculty, setFaculty] = useState('');
  const [university, setUniversity] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [examType, setExamType] = useState('');
  const [assessmentType, setAssessmentType] = useState('');
  const [numStudents, setNumStudents] = useState('50');
  const [maxMarks, setMaxMarks] = useState('100');
  const [passMarks, setPassMarks] = useState('50');
  const [duration, setDuration] = useState('3 Hours');
  const [credits, setCredits] = useState('');
  const [competencyMapping, setCompetencyMapping] = useState('');
  const [bloomLevelDistribution, setBloomLevelDistribution] = useState('');
  const [blueprintSelection, setBlueprintSelection] = useState('');

  // Paper content states
  const [paperText, setPaperText] = useState('');
  const [studentDataPasted, setStudentDataPasted] = useState('');
  const [isUploadingPaper, setIsUploadingPaper] = useState(false);
  const [isUploadingStudentData, setIsUploadingStudentData] = useState(false);
  
  // Validation indicator
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Active analysis results
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [progressLog, setProgressLog] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [analysisResults, setAnalysisResults] = useState<AssessmentReport | null>(null);
  const [questionsList, setQuestionsList] = useState<QuestionItem[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);

  // Layout navigation: Left dashboard sub-tab selector
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'bloom-topics' | 'reliability' | 'outcomes' | 'items' | 'auditor' | 'roles' | 'history'>('overview');
  
  // Preset select helper
  const loadPreset = (preset: typeof PRESETS[0]) => {
    setCourse(preset.course);
    setProgramme(preset.programme);
    setClassYear(preset.classYear);
    setSemester(preset.semester);
    setDepartment(preset.department);
    setSubject(preset.subject);
    setPaper(preset.paper);
    setTopic(preset.topic);
    setSubtopic(preset.subtopic);
    setFaculty(preset.faculty);
    setUniversity(preset.university);
    setAcademicYear(preset.academicYear);
    setExamType(preset.examType);
    setAssessmentType(preset.assessmentType);
    setNumStudents(preset.numStudents);
    setMaxMarks(preset.maxMarks);
    setPassMarks(preset.passMarks);
    setDuration(preset.duration);
    setCredits(preset.credits);
    setCompetencyMapping(preset.competencyMapping);
    setBloomLevelDistribution(preset.bloomLevelDistribution);
    setBlueprintSelection(preset.blueprintSelection);
    
    // Auto-generate some script text
    setPaperText(`SECTION A: CHOOSE THE CORRECT OPTION\n1. ${preset.questions[0]?.text || "Define concepts"}\n\nSECTION B: LONG RESPONSE\n2. ${preset.questions[1]?.text || "Explain applications"}`);
    
    // Auto populate results
    setQuestionsList(preset.questions);
    setAnalysisResults(preset.report);
    setSelectedQuestionIndex(0);
    
    triggerAlert('success', `High-fidelity preset "${preset.subject}" loaded!`);
  };

  const clearInputs = () => {
    setCourse('');
    setProgramme('');
    setClassYear('');
    setSemester('');
    setDepartment('');
    setSubject('');
    setPaper('');
    setTopic('');
    setSubtopic('');
    setFaculty('');
    setUniversity('');
    setAcademicYear('');
    setExamType('');
    setAssessmentType('');
    setNumStudents('50');
    setMaxMarks('100');
    setPassMarks('50');
    setDuration('3 Hours');
    setCredits('');
    setCompetencyMapping('');
    setBloomLevelDistribution('');
    setBlueprintSelection('');
    setPaperText('');
    setStudentDataPasted('');
    setAnalysisResults(null);
    setQuestionsList([]);
    setSelectedQuestionIndex(null);
    setShowValidationErrors(false);
    triggerAlert('info', 'Workspace cleared. You can now type custom parameters.');
  };

  const handleAnalyse = () => {
    // Validation
    if (!course.trim() || !programme.trim() || !subject.trim()) {
      setShowValidationErrors(true);
      triggerAlert('error', 'Please fill in all compulsory fields: Course / Program, Programme, and Subject Name.');
      return;
    }

    setShowValidationErrors(false);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setProgressLog([]);
    setCurrentStepIndex(0);

    const steps = [
      "Step 1: Running neural-network perspective correction and cropping margins...",
      "Step 2: Activating Tesseract OCR + Google Document AI layout analyzer...",
      "Step 3: Extracting Question IDs, sections, subquestions, and target marks...",
      "Step 4: Running CBME competence classification & cognitive mapping indexer...",
      "Step 5: Querying Gemini-3.5-Flash to synthesize compliance metrics..."
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setProgressLog(prev => [...prev, steps[stepIdx]]);
        setCurrentStepIndex(stepIdx);
        setAnalysisProgress(Math.round(((stepIdx + 1) / steps.length) * 100));
        stepIdx++;
      } else {
        clearInterval(interval);
        
        // Finalize analysis
        // If there were preset questions we carry them over, otherwise we generate robust synthetic ones matching input!
        if (questionsList.length === 0) {
          const generatedQuestions: QuestionItem[] = [
            {
              id: "Q-CUSTOM-01",
              number: "Q1",
              text: `Explain the foundational concept of ${topic || "Core Syllabus Topic"} in the context of ${subject}.`,
              type: "MCQ",
              topic: topic || "General Concepts",
              subtopic: subtopic || "Introduction",
              competency: competencyMapping || "CO-1 Mapped Standard",
              bloomLevel: "Knowledge",
              difficulty: "Easy",
              clinicalRelevance: "Medium",
              learningOutcome: "Explain basics",
              marks: 2,
              difficultyIndex: 0.78,
              discriminationIndex: 0.32,
              facilityValue: 78,
              pointBiserial: 0.40,
              distractorEfficiency: 85,
              reliabilityContribution: 0.03,
              variance: 0.17,
              mean: 1.56,
              stdDev: 0.44,
              passPct: 78,
              failPct: 22,
              distRates: { A: 78, B: 10, C: 8, D: 4 },
              recommendedAction: "Retain",
              aiRecommendation: "Good parameters. This item functions cleanly and measures fundamental baseline understanding."
            },
            {
              id: "Q-CUSTOM-02",
              number: "Q2",
              text: `A complex scenario testing ${topic || "Core Syllabus"} practical applications. How would a practitioner diagnose or design this?`,
              type: "Clinical Case",
              topic: topic || "Applications",
              subtopic: subtopic || "Case Studies",
              competency: competencyMapping || "CO-2 Mapped Standard",
              bloomLevel: "Application",
              difficulty: "Difficult",
              clinicalRelevance: "High",
              learningOutcome: "Formulate analytical decisions",
              marks: 10,
              difficultyIndex: 0.45,
              discriminationIndex: 0.41,
              facilityValue: 45,
              pointBiserial: 0.44,
              distractorEfficiency: 80,
              reliabilityContribution: 0.06,
              variance: 2.2,
              mean: 4.5,
              stdDev: 1.5,
              passPct: 45,
              failPct: 55,
              distRates: { A: 20, B: 45, C: 25, D: 10 },
              recommendedAction: "Retain",
              aiRecommendation: "Strong discriminative capability. Effectively challenges students and rates higher order synthesis."
            }
          ];
          setQuestionsList(generatedQuestions);
          setSelectedQuestionIndex(0);
          
          setAnalysisResults({
            overallQualityScore: 84,
            qualityRating: "Good",
            kr20: 0.74,
            cronbachAlpha: 0.76,
            splitHalf: 0.72,
            sem: 3.5,
            totalQuestions: 2,
            totalMarks: 12,
            duration: duration || "3 Hours",
            avgMarksPerQuestion: 6,
            avgTimePerQuestion: "45 Mins",
            topics: [
              { name: topic || "Core Concepts", expected: 50, actual: 60 }
            ],
            competencies: [
              { name: competencyMapping || "PH1.1 Standard Alignment", status: "Achieved", code: "PH1.1" }
            ],
            learningOutcomes: [
              { name: "foundational principles", status: "Achieved", count: 78 }
            ],
            avgScore: 64.5,
            highestScore: 88,
            lowestScore: 35,
            studentPassPct: 82,
            studentFailPct: 18,
            studentStdDev: 9.1,
            quartiles: { q1: 52, q2: 66, q3: 78 },
            scoreDistribution: [
              { range: "30-39", count: 3 },
              { range: "40-49", count: 7 },
              { range: "50-59", count: 15 },
              { range: "60-69", count: 18 },
              { range: "70-79", count: 12 },
              { range: "80-89", count: 5 }
            ],
            auditorFindings: [
              { type: "Balanced Weight", questionId: "Q-CUSTOM-01", description: "Standard difficulty distribution is maintained across modules.", severity: "Low" }
            ],
            indicators: {
              aqi: 84,
              qqi: 82,
              difficultyBalance: 78,
              blueprintCompliance: 88,
              cbmeCompliance: 80,
              facultyQuality: 85,
              readinessScore: 86
            }
          });
        }
        
        setIsAnalyzing(false);
        triggerAlert('success', 'AI assessment analysis complete! Interactive charts are now active.');
      }
    }, 800);
  };

  const simulatePaperUpload = () => {
    setIsUploadingPaper(true);
    setTimeout(() => {
      setIsUploadingPaper(false);
      setPaperText(`EXAMINATION QUESTION PAPER DRAFT\nCourse: ${course || 'Typed Course'}\nSubject: ${subject || 'Typed Subject'}\n\n1. Explain the molecular mechanisms in detail.\n2. In high-level systems, how do we mitigate biased modeling processes?\n3. Distinguish between zero and first order kinetics.`);
      triggerAlert('success', 'Question paper text extracted via Simulated OCR!');
    }, 1500);
  };

  const simulateStudentDataUpload = () => {
    setIsUploadingStudentData(true);
    setTimeout(() => {
      setIsUploadingStudentData(false);
      setStudentDataPasted(`StudentId,Q1_Marks,Q2_Marks,TotalMarks,PassStatus\nSTD-101,2,8,10,Passed\nSTD-102,1,4,5,Passed\nSTD-103,2,10,12,Passed\nSTD-104,0,3,3,Failed`);
      triggerAlert('success', 'Student response spreadsheet (CSV format) uploaded successfully!');
    }, 1500);
  };

  const triggerPrint = () => {
    window.print();
  };

  const getSeverityBadge = (sev: 'High' | 'Medium' | 'Low') => {
    switch (sev) {
      case 'High': return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'Low': return 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20';
    }
  };

  return (
    <div className={`p-1 space-y-6 animate-fadeIn ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="shrink-0" />
            Item Analysis & Assessment Analytics
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Scientifically evaluate exam quality, map competencies (CBME/OBE), process question papers with OCR, and compile student psychometrics.
          </p>
        </div>
        
        {/* Presets and Controls (No Dropdowns) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 font-mono">Load Demo Preset:</span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => loadPreset(p)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-bold transition-all hover:scale-[1.02] cursor-pointer ${
                subject === p.subject
                  ? 'bg-indigo-600 text-white border-transparent shadow'
                  : isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {p.subject.split(" & ")[0]}
            </button>
          ))}
          <button
            onClick={clearInputs}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-rose-400' : 'bg-slate-50 border-slate-200 text-rose-600'
            }`}
          >
            Clear Workspace
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs Column vs Dashboard Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Setup & Files Inputs (5 Columns on Large screens) */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Card 1: Basic Information Setup */}
          <div className={`p-5 rounded-2xl border shadow-sm space-y-4 ${
            isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg">
                <GraduationCap size={16} />
              </span>
              <h4 className="font-bold text-sm font-sans">1. Basic Information Setup</h4>
            </div>
            
            <p className="text-[10.5px] text-slate-400 font-light leading-snug">
              Enter assessment configuration. <span className="text-rose-500 font-bold">*</span> fields are strictly compulsory and must be typed in manually.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Course / Program <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. MBBS, B.Tech Engineering"
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  } ${showValidationErrors && !course.trim() ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-500/5' : ''}`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Programme <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                  placeholder="e.g. UG, PG, Diploma"
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  } ${showValidationErrors && !programme.trim() ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-500/5' : ''}`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Class / Year</label>
                <input
                  type="text"
                  value={classYear}
                  onChange={(e) => setClassYear(e.target.value)}
                  placeholder="e.g. Year 3, III Phase I"
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Semester / Term</label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g. Semester 5, Term II"
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Pharmacology, CSE"
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Subject Name <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. General Pharmacology"
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  } ${showValidationErrors && !subject.trim() ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-500/5' : ''}`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Paper</label>
                <input
                  type="text"
                  value={paper}
                  onChange={(e) => setPaper(e.target.value)}
                  placeholder="e.g. Paper I, AI-302"
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Pharmacokinetics"
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Subtopic</label>
                <input
                  type="text"
                  value={subtopic}
                  onChange={(e) => setSubtopic(e.target.value)}
                  placeholder="e.g. Drug Metabolism"
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Faculty</label>
                <input
                  type="text"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  placeholder="e.g. Prof. Jenkins"
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">University / Board</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. National Medical College"
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Academic Year</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="e.g. 2025-2026"
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Exam Type</label>
                <input
                  type="text"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  placeholder="e.g. Summative, Formative"
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Assessment Type</label>
                <input
                  type="text"
                  value={assessmentType}
                  onChange={(e) => setAssessmentType(e.target.value)}
                  placeholder="e.g. University Exam, Mock"
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Number of Students</label>
                <input
                  type="text"
                  value={numStudents}
                  onChange={(e) => setNumStudents(e.target.value)}
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Maximum Marks</label>
                <input
                  type="text"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(e.target.value)}
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Pass Marks</label>
                <input
                  type="text"
                  value={passMarks}
                  onChange={(e) => setPassMarks(e.target.value)}
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Exam Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>

            {/* Optional / Advanced Settings in Details toggler */}
            <details className="text-xs space-y-3 cursor-pointer">
              <summary className="text-indigo-500 font-semibold focus:outline-none py-1">
                View Advanced Optional Configuration (Bloom, Blueprint, etc.)
              </summary>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Credits (Optional)</label>
                  <input
                    type="text"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    placeholder="e.g. 4 Credits"
                    className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Competency Mapping (Optional)</label>
                  <input
                    type="text"
                    value={competencyMapping}
                    onChange={(e) => setCompetencyMapping(e.target.value)}
                    placeholder="e.g. PH1.1 to PH1.10"
                    className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Bloom Distribution (Optional)</label>
                  <input
                    type="text"
                    value={bloomLevelDistribution}
                    onChange={(e) => setBloomLevelDistribution(e.target.value)}
                    placeholder="e.g. K:30%, U:40%, Ap:30%"
                    className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Blueprint Selection (Optional)</label>
                  <input
                    type="text"
                    value={blueprintSelection}
                    onChange={(e) => setBlueprintSelection(e.target.value)}
                    placeholder="e.g. NMC Curriculum 2024"
                    className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>
            </details>
          </div>

          {/* Card 2: Question Paper OCR Processing */}
          <div className={`p-5 rounded-2xl border shadow-sm space-y-4 ${
            isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg">
                <UploadCloud size={16} />
              </span>
              <h4 className="font-bold text-sm font-sans">2. Upload & Process Question Paper</h4>
            </div>

            <p className="text-[10.5px] text-slate-400 font-light leading-snug">
              Upload PDF, Image, Word (DOCX), or scanned copies. The built-in neural OCR engine will auto-crop, extract question numbering, and classify cognitive levels.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                type="button"
                onClick={simulatePaperUpload}
                disabled={isUploadingPaper}
                className={`py-3 px-3 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                  isDarkMode 
                    ? 'hover:bg-slate-800 border-slate-800 text-slate-300' 
                    : 'hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {isUploadingPaper ? (
                  <RefreshCw className="animate-spin text-indigo-500" size={18} />
                ) : (
                  <FileText className="text-indigo-500" size={18} />
                )}
                <span className="font-bold text-[10px]">Upload PDF / DOCX</span>
              </button>

              <button 
                type="button"
                onClick={simulatePaperUpload}
                disabled={isUploadingPaper}
                className={`py-3 px-3 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                  isDarkMode 
                    ? 'hover:bg-slate-800 border-slate-800 text-slate-300' 
                    : 'hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <UploadCloud className="text-indigo-500" size={18} />
                <span className="font-bold text-[10px]">Upload Image/Scan</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-400 font-medium text-xs">Question Paper Text Script (Editable OCR Output):</label>
              <textarea
                value={paperText}
                onChange={(e) => setPaperText(e.target.value)}
                placeholder="Pasted or OCR extracted questions will show up here..."
                className={`w-full h-24 p-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-250 text-slate-750'
                }`}
              />
            </div>
          </div>

          {/* Card 3: Optional Student Performance Data */}
          <div className={`p-5 rounded-2xl border shadow-sm space-y-4 ${
            isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg">
                <Database size={16} />
              </span>
              <h4 className="font-bold text-sm font-sans">3. Student Performance Data (Optional)</h4>
            </div>

            <p className="text-[10.5px] text-slate-400 font-light leading-snug">
              Import student response spreadsheets (CSV/Excel) or LMS/ERP exports to auto-calculate psychometric indexes (KR-20, Cronbach Alpha, difficulty & discrimination metrics).
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                type="button"
                onClick={simulateStudentDataUpload}
                disabled={isUploadingStudentData}
                className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-1.5 font-bold cursor-pointer ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <FileText size={14} className="text-slate-400" />
                <span>Upload CSV / Excel</span>
              </button>
              
              <button 
                type="button"
                onClick={simulateStudentDataUpload}
                disabled={isUploadingStudentData}
                className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-1.5 font-bold cursor-pointer ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Database size={14} className="text-slate-400" />
                <span>ERP/LMS Export</span>
              </button>
            </div>

            {studentDataPasted && (
              <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono flex items-center gap-1.5">
                <CheckCircle2 size={12} />
                <span>85 Student records indexed for item-level analysis.</span>
              </div>
            )}
          </div>

          {/* Analyse Button */}
          <button
            type="button"
            onClick={handleAnalyse}
            disabled={isAnalyzing}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer hover:scale-[1.01]"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                <span>Processing AI Assessment...</span>
              </>
            ) : (
              <>
                <Brain size={16} />
                <span className="uppercase tracking-wider text-xs">Analyse Assessment & Quality</span>
              </>
            )}
          </button>

        </div>

        {/* Right Side: Dashboard Display & Sections (7 Columns) */}
        <div className="xl:col-span-7 space-y-6">

          {/* Analysis Processing overlay animation */}
          {isAnalyzing && (
            <div className={`p-8 rounded-2xl border flex flex-col justify-center items-center text-center space-y-4 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-indigo-600 dark:text-indigo-400">IQAssess AI Engine Activating</h4>
                <p className="text-xs text-slate-400">Compiling assessment indicators and psychometrics ({analysisProgress}%)</p>
              </div>

              {/* Progress steps animation list */}
              <div className="w-full max-w-md bg-slate-950 p-4 rounded-xl text-left font-mono text-[10px] text-slate-300 space-y-1.5 border border-slate-800">
                {progressLog.map((log, index) => (
                  <div key={index} className="flex items-start gap-2 animate-fadeIn">
                    <span className="text-indigo-500 shrink-0">➜</span>
                    <span className={index === currentStepIndex ? 'text-indigo-400 font-bold' : 'text-slate-400'}>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actual Dashboard Output when results are active */}
          {!isAnalyzing && analysisResults ? (
            <div className="space-y-6">

              {/* OVERALL SUMMARY CARD */}
              <div className={`p-6 rounded-2xl border shadow-sm ${
                isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-500 font-mono text-[9px] font-black uppercase rounded border border-indigo-500/20">
                      Assessment Intelligence Scorecard
                    </span>
                    <h4 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 font-sans">
                      {subject || "General Assessment"} Quality Audit
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {course} │ {programme} │ {faculty || "Academic Board"} │ {university || "General Higher Ed"}
                    </p>
                  </div>

                  {/* Rating Badge with Traffic Light Colors */}
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="relative flex items-center justify-center w-12 h-12">
                      {/* Outer circular indicator */}
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle cx="24" cy="24" r="20" stroke={isDarkMode ? "#1e293b" : "#e2e8f0"} strokeWidth="4" fill="transparent" />
                        <circle cx="24" cy="24" r="20" stroke="#10b981" strokeWidth="4" fill="transparent" 
                          strokeDasharray={2 * Math.PI * 20}
                          strokeDashoffset={2 * Math.PI * 20 * (1 - (analysisResults.overallQualityScore / 100))} />
                      </svg>
                      <span className="absolute text-xs font-black text-emerald-500">{analysisResults.overallQualityScore}%</span>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">Assessment Quality</span>
                      <strong className="block text-emerald-500 text-sm font-black">{analysisResults.qualityRating}</strong>
                    </div>
                  </div>
                </div>

                {/* KPI Metrics strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-5">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl space-y-1 text-center">
                    <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Total Items</span>
                    <strong className="text-base font-black text-slate-800 dark:text-slate-100 block">{analysisResults.totalQuestions} Questions</strong>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl space-y-1 text-center">
                    <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Total Marks</span>
                    <strong className="text-base font-black text-indigo-500 block">{analysisResults.totalMarks} Marks</strong>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl space-y-1 text-center">
                    <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Cronbach Alpha</span>
                    <strong className="text-base font-black text-emerald-500 block">{analysisResults.cronbachAlpha.toFixed(2)}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl space-y-1 text-center">
                    <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Avg. Student score</span>
                    <strong className="text-base font-black text-slate-800 dark:text-slate-100 block">{analysisResults.avgScore}%</strong>
                  </div>
                </div>
              </div>

              {/* DASHBOARD MODULE NAVIGATOR (NO DROPDOWNS ALLOWED) */}
              <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
                {[
                  { id: 'overview', label: '1. Overview & Balance', icon: BookOpen },
                  { id: 'bloom-topics', label: '2. Bloom & Topics', icon: Brain },
                  { id: 'reliability', label: '3. Psychometrics & Reliability', icon: Activity },
                  { id: 'outcomes', label: '4. CBME Outcomes', icon: FileCheck },
                  { id: 'items', label: '5. Question-wise Analysis', icon: HelpCircle },
                  { id: 'auditor', label: '6. AI Auditor Alerts', icon: AlertTriangle },
                  { id: 'roles', label: '7. Roles & Security', icon: Shield },
                  { id: 'history', label: '8. Version History', icon: History }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-[10.5px] font-bold rounded-lg transition-all cursor-pointer ${
                      activeSubTab === tab.id
                        ? 'bg-indigo-600 text-white shadow'
                        : isDarkMode
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        : 'text-slate-600 hover:text-slate-850 hover:bg-slate-200/60'
                    }`}
                  >
                    <tab.icon size={12} className="shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* TAB CONTENT I1: OVERVIEW & ASSESSMENT BALANCE */}
              {activeSubTab === 'overview' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Section 1 & 12 details */}
                  <div className={`p-5 rounded-xl border space-y-4 ${
                    isDarkMode ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-150'
                  }`}>
                    <h5 className="font-bold text-xs uppercase text-indigo-500 font-mono">Section 1 & 12: Assessment Balance & Overview</h5>
                    
                    <p className="text-xs text-slate-400 font-light">
                      Comprehensive mathematical and qualitative balance metrics verifying theoretical vs clinical application weights, cognitive load ratios, and marks distribution.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Block */}
                      <div className="space-y-3">
                        <strong className="text-xs block font-bold text-slate-400">Qualitative Ratios</strong>
                        
                        {/* theory vs clinical bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10.5px] font-bold">
                            <span>Clinical / Practical Application</span>
                            <span className="text-indigo-500">65%</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: '65%' }}></div>
                          </div>
                          <p className="text-[9px] text-slate-400 font-light italic">Clinical case-based items test actionable decision-making.</p>
                        </div>

                        {/* recall vs application */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10.5px] font-bold">
                            <span>Higher-Order Thinking (Application/Analysis)</span>
                            <span className="text-emerald-500">70%</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: '70%' }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Right Block */}
                      <div className="space-y-3">
                        <strong className="text-xs block font-bold text-slate-400">Assessment Balance Evaluation</strong>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 space-y-2 border border-slate-100 dark:border-slate-800">
                          <div className="flex items-start gap-1.5 text-xs">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-700 dark:text-slate-300 block">Optimal MCQ-to-Essay ratio</span>
                              <span className="text-[10px] text-slate-400 block font-light">Assessment integrates 48% essay and 52% MCQ structure providing strong construct validity.</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-1.5 text-xs">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-700 dark:text-slate-300 block">Balanced Cognitive Weight</span>
                              <span className="text-[10px] text-slate-400 block font-light">Sufficient lower-level questions act as baseline validation without diluting psychometric discrimination.</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 13: Clinical Relevance Analysis */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <h6 className="font-bold text-[11px] text-slate-400 mb-2">Section 13: Clinical Relevance Indicators</h6>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { name: 'Case-Based Items', count: '3 Questions', score: '60% weight', status: 'High' },
                          { name: 'Decision-Making', count: '1 Item', score: '24% weight', status: 'Optimal' },
                          { name: 'Evidence-Based', count: '2 Items', score: '15% weight', status: 'Good' },
                          { name: 'Integrated (CBME)', count: '2 Items', score: '40% weight', status: 'Excellent' }
                        ].map((stat, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-center border border-slate-100 dark:border-slate-800/60">
                            <span className="text-[9px] text-slate-400 block">{stat.name}</span>
                            <strong className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mt-0.5">{stat.count}</strong>
                            <span className="text-[8px] text-indigo-500 font-mono block font-bold mt-1">{stat.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Export and PDF Options */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] text-slate-400 font-light italic">Report Generated on UTC 2026-07-10</span>
                      <button
                        onClick={triggerPrint}
                        className="text-[10px] bg-slate-100 dark:bg-slate-850 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-lg font-bold border border-slate-200 dark:border-slate-750 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer size={10} />
                        <span>Print Assessment Quality Report</span>
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB CONTENT I2: BLOOM'S TAXONOMY & TOPICS */}
              {activeSubTab === 'bloom-topics' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Topic Distribution & Bloom Analysis */}
                  <div className={`p-5 rounded-xl border space-y-4 ${
                    isDarkMode ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-150'
                  }`}>
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-xs uppercase text-indigo-500 font-mono">Section 2 & 3: Topic Weights & Bloom's Taxonomy</h5>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-mono font-bold rounded">Cognitive Balance OK</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Topic weights chart */}
                      <div className="space-y-3">
                        <strong className="text-xs block font-bold text-slate-400">Section 2: Topic Distribution (Expected vs Actual)</strong>
                        
                        <div className="space-y-3">
                          {analysisResults.topics.map((t, idx) => (
                            <div key={idx} className="space-y-1 text-xs">
                              <div className="flex justify-between font-medium">
                                <span>{t.name}</span>
                                <span className="text-[10px] text-slate-400">Actual: {t.actual}% (Target: {t.expected}%)</span>
                              </div>
                              {/* Overlay Bar Chart */}
                              <div className="h-4 w-full rounded-md bg-slate-100 dark:bg-slate-900 overflow-hidden relative flex items-center px-1">
                                <div className="absolute left-0 top-0 h-full bg-indigo-500/25 rounded-md" style={{ width: `${t.expected}%` }}></div>
                                <div className="absolute left-0 top-1 h-2 bg-indigo-600 rounded-md" style={{ width: `${t.actual}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bloom Pyramid */}
                      <div className="space-y-3">
                        <strong className="text-xs block font-bold text-slate-400">Section 3: Bloom's Cognitive Levels Distribution</strong>
                        
                        <div className="space-y-1 text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                          {[
                            { name: "Creation", level: "C6", pct: 5, color: "bg-rose-500" },
                            { name: "Evaluation", level: "C5", pct: 15, color: "bg-amber-500" },
                            { name: "Analysis", level: "C4", pct: 20, color: "bg-yellow-500" },
                            { name: "Application", level: "C3", pct: 30, color: "bg-emerald-500" },
                            { name: "Understanding", level: "C2", pct: 20, color: "bg-sky-500" },
                            { name: "Knowledge", level: "C1", pct: 10, color: "bg-indigo-500" }
                          ].map((b, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="w-16 text-[9px] font-mono text-slate-400">{b.name}</span>
                              <div className="flex-1 h-3.5 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden relative flex items-center px-2">
                                <div className={`absolute left-0 top-0 h-full ${b.color} opacity-25`} style={{ width: `${b.pct}%` }}></div>
                                <span className="text-[8px] font-bold z-10 font-mono">{b.pct}% weight</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI Recommendation in Section 3 */}
                    <div className="p-3.5 bg-indigo-500/5 rounded-xl border border-indigo-500/10 space-y-1.5 mt-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500">
                        <Sparkles size={14} />
                        <span>AI Cognitive Balance Recommendation:</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                        "Increase higher-order cognitive questions (Analysis C4 and Evaluation C5) in the pharmacology/AI ethics category. Current knowledge-level questions constitute over 40% of overall paper weights. Consider shifting descriptive marks towards scenario modeling."
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB CONTENT I3: PSYCHOMETRICS & RELIABILITY */}
              {activeSubTab === 'reliability' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Reliability indicators */}
                  <div className={`p-5 rounded-xl border space-y-4 ${
                    isDarkMode ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-150'
                  }`}>
                    <h5 className="font-bold text-xs uppercase text-indigo-500 font-mono">Section 10 & 7: Psychometric Reliability & Student Analytics</h5>
                    
                    <p className="text-xs text-slate-400 font-light">
                      High-fidelity calculations of Cronbach Alpha, Kuder-Richardson index (KR-20), Split-Half reliability models, and student score distributions.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Section 10 Reliability Table */}
                      <div className="space-y-3">
                        <strong className="text-xs block font-bold text-slate-400">Section 10: Reliability Coefficients</strong>
                        <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900 text-[10px] text-slate-400 uppercase font-mono">
                              <tr>
                                <th className="p-2">Coefficient Metric</th>
                                <th className="p-2 text-right">Value</th>
                                <th className="p-2">Status Rating</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              <tr>
                                <td className="p-2 font-bold text-slate-600 dark:text-slate-350">Kuder-Richardson (KR-20)</td>
                                <td className="p-2 text-right font-mono text-emerald-500 font-black">{analysisResults.kr20.toFixed(2)}</td>
                                <td className="p-2"><span className="text-[9px] bg-emerald-500/15 text-emerald-500 px-1.5 py-0.5 rounded font-bold font-mono">High Reliability</span></td>
                              </tr>
                              <tr>
                                <td className="p-2 font-bold text-slate-600 dark:text-slate-350">Cronbach's Alpha</td>
                                <td className="p-2 text-right font-mono text-emerald-500 font-black">{analysisResults.cronbachAlpha.toFixed(2)}</td>
                                <td className="p-2"><span className="text-[9px] bg-emerald-500/15 text-emerald-500 px-1.5 py-0.5 rounded font-bold font-mono">Excellent</span></td>
                              </tr>
                              <tr>
                                <td className="p-2 font-bold text-slate-600 dark:text-slate-350">Split-Half Guttman Coefficient</td>
                                <td className="p-2 text-right font-mono text-indigo-500 font-black">{analysisResults.splitHalf.toFixed(2)}</td>
                                <td className="p-2"><span className="text-[9px] bg-indigo-500/15 text-indigo-500 px-1.5 py-0.5 rounded font-bold font-mono">Good Quality</span></td>
                              </tr>
                              <tr>
                                <td className="p-2 font-bold text-slate-600 dark:text-slate-350">Std Error of Measurement (SEM)</td>
                                <td className="p-2 text-right font-mono text-slate-400 font-black">{analysisResults.sem.toFixed(2)}</td>
                                <td className="p-2"><span className="text-[9px] text-slate-400 font-light italic">Low Uncertainty</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Score distribution bar chart */}
                      <div className="space-y-3">
                        <strong className="text-xs block font-bold text-slate-400">Section 7: Student Performance Score Distribution</strong>
                        
                        <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
                          {analysisResults.scoreDistribution.map((d, idx) => {
                            // find percentage
                            const totalStudentsCount = analysisResults.scoreDistribution.reduce((sum, c) => sum + c.count, 0);
                            const percent = (d.count / totalStudentsCount) * 100;
                            return (
                              <div key={idx} className="flex items-center gap-2 text-[10px]">
                                <span className="w-10 font-bold text-slate-400 font-mono">{d.range}</span>
                                <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-900 rounded overflow-hidden">
                                  <div className="h-full bg-indigo-500" style={{ width: `${percent}%` }}></div>
                                </div>
                                <span className="w-6 font-mono text-right font-bold">{d.count}s</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Section 15 Quality Indicators details */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <h6 className="font-bold text-[11px] text-indigo-400 uppercase font-mono mb-3">Section 15: Quality Indicators</h6>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                          { name: 'Difficulty Balance', score: analysisResults.indicators.difficultyBalance, color: 'text-indigo-500' },
                          { name: 'Blueprint Compliance', score: analysisResults.indicators.blueprintCompliance, color: 'text-emerald-500' },
                          { name: 'CBME Compliance', score: analysisResults.indicators.cbmeCompliance, color: 'text-emerald-500' },
                          { name: 'Faculty Quality Score', score: analysisResults.indicators.facultyQuality, color: 'text-indigo-500' },
                          { name: 'Assessment Readiness', score: analysisResults.indicators.readinessScore, color: 'text-sky-500' }
                        ].map((ind, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-center border border-slate-100 dark:border-slate-800/60">
                            <span className="text-[9px] text-slate-400 block font-light leading-tight">{ind.name}</span>
                            <strong className={`text-sm font-black block mt-1.5 ${ind.color}`}>{ind.score}%</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB CONTENT I4: CBME OUTCOMES & COMPETENCY */}
              {activeSubTab === 'outcomes' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* CBME & Outcome Mappings */}
                  <div className={`p-5 rounded-xl border space-y-4 ${
                    isDarkMode ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-150'
                  }`}>
                    <h5 className="font-bold text-xs uppercase text-indigo-500 font-mono">Section 5 & 6: Competency & Learning Outcomes (CBME Coverage)</h5>
                    
                    <p className="text-xs text-slate-400 font-light">
                      Audit tracking of Programme Outcomes (PO), Course Outcomes (CO), Specific Learning Outcomes (SLO), and CBME Curriculum compliance indices.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Competencies mapped */}
                      <div className="space-y-3">
                        <strong className="text-xs block font-bold text-slate-400">Section 5: Competencies Assessed vs Missed</strong>
                        
                        <div className="space-y-2">
                          {analysisResults.competencies.map((comp, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl flex justify-between items-center border border-slate-100 dark:border-slate-800/60">
                              <div>
                                <span className="text-[8px] font-mono text-slate-400">{comp.code}</span>
                                <h6 className="font-bold text-xs text-slate-700 dark:text-slate-350">{comp.name}</h6>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                comp.status === 'Achieved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                {comp.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Learning Outcomes */}
                      <div className="space-y-3">
                        <strong className="text-xs block font-bold text-slate-400">Section 6: Learning Outcome Attainment Levels</strong>
                        
                        <div className="space-y-2">
                          {analysisResults.learningOutcomes.map((lo, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/60 space-y-1 text-xs">
                              <div className="flex justify-between font-medium">
                                <span className="font-bold text-slate-700 dark:text-slate-350 italic">LO: {lo.name}</span>
                                <span className={`text-[9px] font-bold ${
                                  lo.status === 'Achieved' ? 'text-emerald-500' : 'text-amber-500'
                                }`}>{lo.status}</span>
                              </div>
                              <div className="flex justify-between items-center text-[9.5px] text-slate-400">
                                <span>Attainment Threshold (80% score):</span>
                                <span className="font-mono text-indigo-500 font-bold">{lo.count}% of batch achieved</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB CONTENT I5: QUESTION-WISE ANALYSIS */}
              {activeSubTab === 'items' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Detailed Psychometric metrics table */}
                  <div className={`p-5 rounded-xl border space-y-4 ${
                    isDarkMode ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-150'
                  }`}>
                    <h5 className="font-bold text-xs uppercase text-indigo-500 font-mono">Section 8 & 9: Individual Question-wise Item Analysis</h5>
                    
                    <p className="text-xs text-slate-400 font-light">
                      Select any question from the list to view its comprehensive distractor spread, point-biserial correlations, difficulty indices, and AI audit recommendations.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Left list (4 columns) */}
                      <div className="md:col-span-5 space-y-2 max-h-[350px] overflow-y-auto pr-1">
                        {questionsList.map((q, idx) => (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => setSelectedQuestionIndex(idx)}
                            className={`w-full p-2.5 rounded-xl text-left border flex justify-between items-center transition-all cursor-pointer ${
                              selectedQuestionIndex === idx
                                ? 'bg-indigo-600 border-transparent text-white'
                                : isDarkMode
                                ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="space-y-0.5 truncate max-w-[130px]">
                              <span className="text-[9px] font-mono font-bold block opacity-60">{q.id} │ {q.type}</span>
                              <strong className="text-xs font-bold block truncate">{q.text}</strong>
                            </div>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                              q.recommendedAction === 'Retain' ? 'bg-emerald-500/15 text-emerald-500' :
                              q.recommendedAction === 'Modify' ? 'bg-amber-500/15 text-amber-500' :
                              'bg-rose-500/15 text-rose-500'
                            }`}>
                              {q.recommendedAction}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Right Detail Card (7 columns) */}
                      <div className="md:col-span-7 space-y-4">
                        {selectedQuestionIndex !== null && questionsList[selectedQuestionIndex] && (() => {
                          const activeItem = questionsList[selectedQuestionIndex];
                          return (
                            <div className="space-y-4">
                              <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 space-y-1.5">
                                <span className="text-[9px] font-mono font-bold text-indigo-500 block">Question Text:</span>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-relaxed italic">
                                  "{activeItem.text}"
                                </p>
                              </div>

                              {/* Distractor Spread (Section 9) */}
                              <div className="space-y-2">
                                <strong className="text-xs block font-bold text-slate-400">Section 9: Distractor Selection Rates (%)</strong>
                                <div className="space-y-1.5">
                                  {Object.entries(activeItem.distRates).map(([opt, count]) => {
                                    // simple simulation of percentage
                                    const percentVal = count;
                                    return (
                                      <div key={opt} className="flex items-center gap-2 text-xs">
                                        <span className="w-5 font-bold font-mono">{opt}</span>
                                        <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden relative flex items-center px-2">
                                          <div className="absolute left-0 top-0 h-full bg-indigo-500/20" style={{ width: `${percentVal}%` }}></div>
                                          <span className="text-[8px] font-bold z-10">{percentVal}% choice rate</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Detailed Metrics Table */}
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl">
                                  <span className="text-[9px] text-slate-400 block font-mono">Difficulty Index (p-value):</span>
                                  <strong className="text-xs text-slate-700 dark:text-slate-200 font-bold font-mono">{activeItem.difficultyIndex.toFixed(2)}</strong>
                                  <span className="text-[8.5px] text-slate-400 block mt-0.5">({activeItem.difficultyIndex < 0.4 ? 'Hard' : activeItem.difficultyIndex > 0.8 ? 'Easy' : 'Ideal'})</span>
                                </div>
                                <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl">
                                  <span className="text-[9px] text-slate-400 block font-mono">Discrimination (d-value):</span>
                                  <strong className="text-xs text-slate-700 dark:text-slate-200 font-bold font-mono">{activeItem.discriminationIndex.toFixed(2)}</strong>
                                  <span className="text-[8.5px] text-slate-400 block mt-0.5">({activeItem.discriminationIndex < 0.2 ? 'Critical' : 'Excellent'})</span>
                                </div>
                              </div>

                              {/* Actionable recommendations */}
                              <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 space-y-1">
                                <span className="text-[9px] font-mono font-bold text-indigo-500 block">AI Psychometric Recommendation:</span>
                                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                  {activeItem.aiRecommendation}
                                </p>
                              </div>

                            </div>
                          );
                        })()}
                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* TAB CONTENT I6: AI AUDITOR ALERTS */}
              {activeSubTab === 'auditor' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* AI Auditor Findings (Section 14 & AI Recommendations) */}
                  <div className={`p-5 rounded-xl border space-y-4 ${
                    isDarkMode ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-150'
                  }`}>
                    <h5 className="font-bold text-xs uppercase text-indigo-500 font-mono">Section 14: AI Assessment Auditor & Quality Alerts</h5>
                    
                    <p className="text-xs text-slate-400 font-light">
                      Cognitive audit scans for duplicated conceptual structures, double negatives, unaligned scoring margins, grammatical anomalies, or non-functional distractor elements.
                    </p>

                    <div className="space-y-3">
                      {analysisResults.auditorFindings.map((finding, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-start gap-3 text-xs">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] mt-0.5 ${getSeverityBadge(finding.severity)}`}>
                            {finding.severity} Severity
                          </span>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-bold">
                              <span className="text-slate-700 dark:text-slate-350">{finding.type}</span>
                              <span className="text-[9px] font-mono text-slate-400">Question ID: {finding.questionId}</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                              {finding.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI Strategic Recommendations */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                      <strong className="text-xs font-bold text-slate-400">Actionable Remediation Roadmap</strong>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 space-y-1">
                          <strong className="font-bold text-rose-500">Decrease / Reduce:</strong>
                          <ul className="list-disc pl-4 space-y-0.5 text-slate-500 dark:text-slate-400">
                            <li>Recall-level baseline questions (current weight 42%).</li>
                            <li>Identical mechanism inquiries across sub-sections.</li>
                          </ul>
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                          <strong className="font-bold text-emerald-500">Increase / Strengthen:</strong>
                          <ul className="list-disc pl-4 space-y-0.5 text-slate-500 dark:text-slate-400">
                            <li>Add higher-order decision clinical cases.</li>
                            <li>Strengthen option validity of non-functional distractors.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB CONTENT I7: ROLES & SECURITY */}
              {activeSubTab === 'roles' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Role Switcher & Cryptographic Security */}
                  <div className={`p-5 rounded-xl border space-y-4 ${
                    isDarkMode ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-150'
                  }`}>
                    <h5 className="font-bold text-xs uppercase text-indigo-500 font-mono">Platform Roles & Cryptographic Security Settings</h5>
                    
                    <p className="text-xs text-slate-400 font-light">
                      Switch workspace roles to explore custom review privileges. View encrypted records storage, digital signatures, audit trail logs, and approval workflows.
                    </p>

                    {/* Role switcher row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {[
                        { role: 'University Admin', icon: UserCheck, desc: 'Central governance' },
                        { role: 'HoD / Chairperson', icon: Users, desc: 'Paper moderation' },
                        { role: 'Faculty Creator', icon: User, desc: 'Drafting questions' },
                        { role: 'External Examiner', icon: Shield, desc: 'Double-blind review' }
                      ].map((r, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-center space-y-1 hover:scale-[1.01] transition-all cursor-pointer">
                          <r.icon className="mx-auto text-indigo-500" size={16} />
                          <strong className="block text-slate-700 dark:text-slate-300 font-bold">{r.role}</strong>
                          <span className="text-[9px] text-slate-400 block font-light leading-none">{r.desc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Security indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                          <Lock size={12} className="text-indigo-500" />
                          <span>AES-256 Storage Encryption</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-light">All question draft texts are fully encrypted at rest inside standard Supabase vaults.</p>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                          <Fingerprint size={12} className="text-indigo-500" />
                          <span>Audit Trail Ledger</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-light">Blockchain-inspired unalterable state ledger logs every draft update and moderator reviews.</p>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                          <FileCheck size={12} className="text-indigo-500" />
                          <span>Digital Signatures</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-light">Approved assessment reports are secured with verifiable cryptographic administrative signatures.</p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB CONTENT I8: VERSION HISTORY */}
              {activeSubTab === 'history' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Version Control and Moderation repository */}
                  <div className={`p-5 rounded-xl border space-y-4 ${
                    isDarkMode ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-150'
                  }`}>
                    <h5 className="font-bold text-xs uppercase text-indigo-500 font-mono">Syllabus Revision History & Mod Control</h5>
                    
                    <p className="text-xs text-slate-400 font-light">
                      Track historical assessment revisions, faculty moderation logs, and final approved draft versions stored inside the central repository.
                    </p>

                    <div className="relative border-l border-indigo-500/20 pl-4 ml-2 space-y-5 text-xs">
                      {[
                        { version: 'v3 (Current Approved Draft)', date: 'UTC 2026-07-10 06:12', user: 'HoD Sarah Jenkins', action: 'Approved final double-blind review and digital signature applied.' },
                        { version: 'v2 (Assessment Analysed)', date: 'UTC 2026-07-10 06:08', user: 'Prof. Dr. Sarah Jenkins', action: 'Uploaded student response sheet of 85 students and calculated p-value/d-value.' },
                        { version: 'v1 (Draft Created)', date: 'UTC 2026-07-10 06:05', user: 'AI Assistant', action: 'Extracted question script via OCR and completed Bloom distribution mapping.' }
                      ].map((hist, idx) => (
                        <div key={idx} className="space-y-1 relative">
                          {/* Circle dot on timeline */}
                          <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 ${
                            idx === 0 ? 'bg-indigo-500 border-indigo-600' : 'bg-slate-300 border-slate-400'
                          }`}></div>
                          
                          <div className="flex justify-between items-center">
                            <strong className="font-bold text-slate-700 dark:text-slate-300">{hist.version}</strong>
                            <span className="text-[9px] font-mono text-slate-400">{hist.date}</span>
                          </div>
                          <span className="text-[9.5px] text-indigo-500 block font-bold font-mono">By: {hist.user}</span>
                          <p className="text-slate-400 font-light">{hist.action}</p>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Empty state when no analysis results exist */
            <div className={`p-8 rounded-2xl border text-center space-y-5 flex flex-col justify-center items-center h-[400px] ${
              isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl animate-bounce">
                <Brain size={32} />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="font-bold text-base text-slate-700 dark:text-slate-200">Assessment Analytics Idle</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Enter your Course, Programme, and Subject parameters in Step 1, optionally load presets, then click the "Analyse Assessment" button to trigger the full 15-section item analysis report!
                </p>
              </div>

              {/* Quick Preset Buttons (No Dropdown) */}
              <div className="space-y-2 w-full max-w-xs">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Quick Pre-fill Templates:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => loadPreset(PRESETS[0])}
                    className="p-2 border rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white border-transparent cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    Pharmacology MCQ
                  </button>
                  <button
                    onClick={() => loadPreset(PRESETS[1])}
                    className="p-2 border rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white border-transparent cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    AI Ethics Exam
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
