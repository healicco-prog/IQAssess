// IQAssess Institutional Assessment Management System Types

export type SystemRole = 'User';

export interface UserSession {
  username: string;
  email: string;
  role: any;
  institution: string;
  version?: 'Standard' | 'Premium';
}

export interface AssessmentItem {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  type: 'Essay' | 'MCQ' | 'Reflection' | 'Full Paper';
  createdDate: string;
  pendingReviewsCount: number;
  completedReviewsCount: number;
}

// 2. Paper AS
export interface ScannedPaper {
  id: string;
  studentCode: string;
  scannedUrl?: string;
  subject: string;
  sections: {
    sectionLetter: string;
    description: string;
    questionsCount: number;
    allocatedMarks: number;
    scannedTextExtracted: string;
    aiScoreSuggestion: number;
    assignedScore: number | null;
    rubricMatchText: string;
    notes: string;
  }[];
  overallAiReport: string;
}

// 3. Essay AS
export interface EssayGradingResult {
  score: number;
  maxScore: number;
  criteriaScores: {
    relevance: { score: number; max: number; analysis: string };
    structure: { score: number; max: number; analysis: string };
    criticalThinking: { score: number; max: number; analysis: string };
    creativity: { score: number; max: number; analysis: string };
    grammar: { score: number; max: number; analysis: string };
    evidenceUsage: { score: number; max: number; analysis: string };
    argumentQuality: { score: number; max: number; analysis: string };
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

// 4. MCQ AS
export interface MCQQuestion {
  questionText: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
    isCorrect: boolean;
    aiDistractorExplanation: string;
  }[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  discriminationIndex?: number; // Simulated
  difficultyIndex?: number; // Simulated
}

export interface MCQTest {
  id: string;
  topic: string;
  outcomeMapped: string;
  questions: MCQQuestion[];
}

// 5. Reflection AS
export interface ReflectionJournal {
  id: string;
  authorCode: string; // e.g. "REF-ST-402"
  reflectionType: 'Journal' | 'Internship Reflection' | 'Professional Practice';
  content: string;
  evaluatedDate?: string;
  scores?: {
    depth: number;
    selfAwareness: number;
    learningEvidence: number;
    conceptualApplication: number;
    growthMindset: number;
  };
  aiFeedback?: string;
}

// 6. Rubrics
export interface RubricGrid {
  title: string;
  outcomes: string[];
  criteria: {
    name: string;
    excellent: string;
    good: string;
    developing: string;
    needsImprovement: string;
    weight: number; // e.g. 25 for percentage
  }[];
}

// Blueprint Form
export interface BlueprintInput {
  subject: string;
  gradeLevel: string;
  outcomes: string;
  bloomLevel: string;
}
