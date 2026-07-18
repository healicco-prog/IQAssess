import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle, ShieldAlert, Award, 
  HelpCircle, Globe, ChevronRight, FileText, 
  Users, TrendingUp, Cpu, Settings, MessageSquare, 
  BookOpen, Star, Mail, Search, Filter, ArrowRight, 
  Clock, User, Share2, Send, Bookmark, Check, 
  ChevronDown, Hash, Heart, X, MessageCircle, ArrowLeft, 
  Calendar, Eye, ThumbsUp, Lightbulb, GraduationCap,
  Stethoscope, Layers, Lock, EyeOff, Home
} from 'lucide-react';

import { supabase } from '../lib/supabase';

// Define Interface for component props
interface LandingPageProps {
  onGetStarted: (customSession?: { username: string; email: string; role: string; institution: string; version?: 'Standard' | 'Premium' }) => void;
  onSelectTab?: (tabId: string) => void;
  subView?: 'home' | 'blogs' | 'login';
  onChangeSubView?: (view: 'home' | 'blogs' | 'login') => void;
}

// Interfaces for Blog system
interface BlogComment {
  id: string;
  authorName: string;
  text: string;
  timestamp: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  gradient: string;
  likes: number;
  views: number;
  image?: string;
  summary?: string;
}

// 20 Categories as specified in the prompt
const BLOG_CATEGORIES = [
  "All Categories",
  "Assessment Development",
  "Competency-Based Education (CBME)",
  "Outcome Based Education (OBE)",
  "Accreditation & Quality Assurance",
  "AI in Assessment",
  "Question Paper Design",
  "Bloom's Taxonomy",
  "Assessment Blueprinting",
  "Anonymous Evaluation",
  "Rubrics & Evaluation",
  "Medical Education",
  "Nursing Education",
  "Dental Education",
  "Faculty Development",
  "Educational Technology",
  "Student Assessment",
  "Institutional Quality Assurance",
  "Research in Assessment",
  "Case-Based Learning",
  "Professional Education"
];

// Rich cover images and executive summaries mapped to each blog ID
const BLOG_EXTRAS: Record<string, { image: string; summary: string }> = {
  "how-ai-transforming-assessment": {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    summary: "AI-driven assessment platforms are redefining grading efficiency by automating rubric mapping, removing human evaluator bias, and delivering hyper-personalized feedback loops that guide student improvement directly."
  },
  "guide-competency-based-assessment": {
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80",
    summary: "Competency-Based Medical and Professional Education prioritizes verified mastery of specific skills over classroom attendance hours, requiring structured evaluation frameworks and clinical portfolios."
  },
  "outcome-based-education-best-practices": {
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    summary: "Securing institutional accreditation hinges on clear backward syllabus design. Faculty must actively align Course Outcomes (COs) and Program Outcomes (POs) with student examination questions."
  },
  "building-effective-rubrics-evaluation": {
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    summary: "Transforming ambiguous grading scales into robust, multi-tiered rubrics enables educators to grade student submissions in seconds with high consistency and clear, constructive quality benchmarks."
  },
  "anonymous-evaluation-fairness": {
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80",
    summary: "Subjective grading is susceptible to implicit bias. Implementing anonymous evaluation workflows, double-blind dual assessor allocation, and automatic variance triggers safeguards academic fairness."
  },
  "assessment-blueprinting-made-simple": {
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
    summary: "An examination blueprint ensures exam questions align proportionally with curriculum weightages and cognitive levels, safeguarding student success from lopsided test designs."
  },
  "nmc-cbme-assessment-strategies": {
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    summary: "A practical roadmap for medical institutions to navigate the National Medical Commission's CBME directives, integrating DOAP sessions, formative portfolios, and continuous logbooks."
  },
  "using-blooms-taxonomy-assessment": {
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    summary: "Syllabus examination papers must evaluate higher-order cognitive domains. Educators should balance rote memory checks with scenario essays that require application, analysis, and creation."
  },
  "creating-effective-case-based-assessments": {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    summary: "Case-based evaluation aligns assessments with real-world complexities. High-fidelity case structures encourage critical thinking and diagnostic reasoning under complex constraints."
  },
  "the-future-of-ai-powered-evaluation": {
    image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80",
    summary: "The convergence of LLMs and multimodal OCR is paving the way for advanced cognitive grading engines that can read handwritten diagrams, trace concept maps, and offer adaptive testing pathways."
  }
};

// Sample Featured Blogs with rich structural data
const SAMPLE_BLOGS: BlogPost[] = [
  {
    id: "how-ai-transforming-assessment",
    title: "How AI is Transforming Assessment in Higher Education",
    excerpt: "Discover how universities are utilizing artificial intelligence to create fairer, faster, and more scalable examination workflows.",
    category: "AI in Assessment",
    tags: ["AI in Assessment", "Educational Technology", "Assessment Development"],
    author: { name: "Dr. Elena Vance", role: "Professor of Learning Analytics", avatar: "EV" },
    date: "Jun 18, 2026",
    readTime: "5 min read",
    gradient: "from-blue-600 via-indigo-600 to-indigo-700",
    likes: 142,
    views: 1840,
    content: `### The Paradigm Shift in Educational Assessment

Traditional evaluation systems are cracking under modern academic demands. Graders face severe burnout while students receive fragmented, non-descriptive scores weeks after submissions. Integrating AI into assessment development is no longer a luxury—it is an accreditation imperative.

#### Reducing Evaluator Subjectivity & Bias

By mapping rubrics down to precise semantic check-points, intelligent platforms eliminate classic "grading fatigue" where the first ten papers are scored differently than the last fifty. An objective machine pipeline processes anonymous tokens, guaranteeing absolute transparency.

#### Instructive, Generative Feedback Circles

The most powerful aspect of AI assessment is not scoring, but the automated synthesis of high-fidelity student diagnostics. Instead of simply placing \`78%\` on a paper, the system points out precise conceptual gaps, matches them to learning outcomes, and recommends dedicated study blueprints.`
  },
  {
    id: "guide-competency-based-assessment",
    title: "A Complete Guide to Competency-Based Assessment",
    excerpt: "Transitioning to CBME requires rigorous assessment standards. Learn how to construct competency blueprints effortlessly.",
    category: "Competency-Based Education (CBME)",
    tags: ["Competency-Based Education (CBME)", "Student Assessment", "Institutional Quality Assurance"],
    author: { name: "Prof. Kenneth Chang", role: "Director of Studies", avatar: "KC" },
    date: "Jun 12, 2026",
    readTime: "7 min read",
    gradient: "from-indigo-600 to-cyan-500",
    likes: 98,
    views: 1250,
    content: `### Understanding Competency-Based Education (CBE)

Competency-based frameworks guarantee that students master specific, predefined execution milestones before moving forward, rather than counting logged classroom hours.

#### Key Foundations of CBME Assessments
1. **Explicit Mastery Metrics**: No ambiguous grades; criteria are binary or mapped on multi-tiered competency rubrics.
2. **Flexible Pacing**: Assessment on demand rather than fixed examination days.
3. **Outcome-Oriented Frameworks**: Directly proving compliance with national benchmarks (such as ABET, CEPH, or NMC guidelines).

Evaluating these milestones requires multi-dimensional portfolios, clinical checklists (such as Mini-CEX or OSCEs in medical setups), and continuous reflective logs.`
  },
  {
    id: "outcome-based-education-best-practices",
    title: "Outcome-Based Education (OBE): Best Practices for Faculty",
    excerpt: "How to align Course Outcomes (COs) and Program Outcomes (POs) with student test performance to secure accreditation.",
    category: "Outcome Based Education (OBE)",
    tags: ["Outcome Based Education (OBE)", "Institutional Quality Assurance", "Faculty Development"],
    author: { name: "Dr. Arthur Miller", role: "Accreditation Advisor", avatar: "AM" },
    date: "Jun 09, 2026",
    readTime: "6 min read",
    gradient: "from-blue-700 via-cyan-600 to-emerald-500",
    likes: 115,
    views: 1420,
    content: `### Aligning COs & POs in Modern Syllabi

Outcome-Based Education (OBE) requires backward design: define target graduate attributes (POs), map them to course capabilities (COs), and build custom examinations to measure each outcome explicitly.

#### Recommended OBE Best Practices:
* **Outcome Tagging**: Ensure every exam question is tagged with at least one CO and its corresponding cognitive level.
* **Direct Attainment Mapping**: Build spreadsheet-free digital tracking charts that parse automatic class means against threshold performance limits.
* **Continuous Quality Improvement (CQI)**: Formulate annual gap assessments when attainment averages slip below 65%.`
  },
  {
    id: "building-effective-rubrics-evaluation",
    title: "Building Effective Rubrics for Student Evaluation",
    excerpt: "Transform subjective grading into rigorous, structured scorecards. Explore the anatomy of descriptive assessment rubrics.",
    category: "Rubrics & Evaluation",
    tags: ["Rubrics & Evaluation", "Faculty Development", "Assessment Development"],
    author: { name: "Elena Rostova", role: "Educational Designer", avatar: "ER" },
    date: "Jun 06, 2026",
    readTime: "4 min read",
    gradient: "from-emerald-500 to-teal-700",
    likes: 76,
    views: 940,
    content: `### The Anatomy of an Unbeatable Rubric

An excellent rubric turns nebulous quality metrics into distinct, high-fidelity checkboxes that can be graded in seconds.

#### Core Structural Elements
* **Evaluation Criteria**: Crucial parameters like "Relevance", "Critical Reasoning", or "Evidence Integration".
* **Scale of Achievement**: Distinct levels (e.g., Novice, Competent, Mastery) labeled with points.
* **Descriptive Indicators**: Literal descriptions explaining *why* a student lands on any specific level.

By feeding these indicators into OCR workflows, teachers can assess scanned documents with absolute consistency.`
  },
  {
    id: "anonymous-evaluation-fairness",
    title: "Anonymous Evaluation and Assessment Fairness",
    excerpt: "Eliminating unconscious bias in subjective scoring through double-blind grading and variance triggers.",
    category: "Anonymous Evaluation",
    tags: ["Anonymous Evaluation", "Accreditation & Quality Assurance", "Research in Assessment"],
    author: { name: "Dr. Amara Thorne", role: "Chief of Academic Standards", avatar: "AT" },
    date: "May 28, 2026",
    readTime: "8 min read",
    gradient: "from-slate-900 to-slate-700",
    likes: 189,
    views: 2400,
    content: `### Confronting Systemic Grading Bias

Research proves that non-anonymous evaluations can be contaminated by implicit student biases, past academic records, and halo effects. Double-blind assessment is the single most effective intervention.

#### How Double-Blind Pipelines Work:
1. **QR-Encoded Anonymization**: Student scripts are scanned and automatically encoded with random cryptotags.
2. **Independent Dual Allocation**: Two assessors grade the exact same work without seeing each other's score or remarks.
3. **Variance Monitoring**: If scores disagree by more than 15%, the script triggers an automatic review by a senior moderator.`
  },
  {
    id: "assessment-blueprinting-made-simple",
    title: "Assessment Blueprinting Made Simple",
    excerpt: "Ensure perfect distribution of marks, exam topics, and cognitive difficulty levels prior to writing your papers.",
    category: "Assessment Blueprinting",
    tags: ["Assessment Blueprinting", "Question Paper Design", "Bloom's Taxonomy"],
    author: { name: "Prof. Rajesh Kumar", role: "Curriculum Specialist", avatar: "RK" },
    date: "May 23, 2026",
    readTime: "5 min read",
    gradient: "from-purple-600 to-indigo-600",
    likes: 92,
    views: 1100,
    content: `### Demystifying the Exam Blueprint (Table of Specifications)

An exam without a blueprint is like a building without architectural schematics. Blueprints map syllabus weightage against cognitive demand dimensions.

#### Generating a Modern Assessment Blueprint:
* Specify chapters and their credit-hour allocation.
* Overlay Bloom's Cognitive Domains: Recall (K1), Understanding (K2), Application (K3), Analysis (K4).
* Automatically compute marks per topic to protect student outcomes from lopsided examinations.`
  },
  {
    id: "nmc-cbme-assessment-strategies",
    title: "NMC CBME Assessment Strategies for Medical Colleges",
    excerpt: "A comprehensive guide on managing CBME curriculums, logbooks, and formative portfolio metrics.",
    category: "Medical Education",
    tags: ["Medical Education", "Competency-Based Education (CBME)", "Professional Education"],
    author: { name: "Dr. Arthur Armstrong", role: "Professor of Medical Education", avatar: "AA" },
    date: "May 19, 2026",
    readTime: "9 min read",
    gradient: "from-rose-600 to-emerald-600",
    likes: 210,
    views: 2950,
    content: `### Aligning with NMC CBME Guidelines

Medical educators under the National Medical Commission (NMC) are tasked with tracking rigorous Competency-Based Medical Education (CBME) domains across thousands of clinical hours.

#### Practical Implementation Metrics
* **DOAP Sessions**: Systematically log "Demonstrate, Observe, Assess, Perform" events with active checklists.
* **Continuous Formative Logs**: Consolidate periodic formative scores rather than relying solely on grand summative finals.
* **Reflective Diaries**: Review student case narratives to gauge ethical awareness and professional stance.`
  },
  {
    id: "using-blooms-taxonomy-assessment",
    title: "Using Bloom's Taxonomy in Assessment Design",
    excerpt: "Move beyond simple rote learning. Create exams targeting higher-order cognitive domains like creation and evaluation.",
    category: "Bloom's Taxonomy",
    tags: ["Bloom's Taxonomy", "Question Paper Design", "Faculty Development"],
    author: { name: "Sarah Jenkins", role: "Instructional Specialist", avatar: "SJ" },
    date: "May 15, 2026",
    readTime: "6 min read",
    gradient: "from-amber-505 via-orange-600 to-red-650",
    likes: 120,
    views: 1350,
    content: `### Assessing Progressive Cognitive Stages

Bloom's Revised Taxonomy structure serves as a guide for engineering well-balanced test papers. Too often, exams cluster 90% of weightage on basic \`Recall\` functions.

#### Balancing your Cognitive Distribution:
* **Remember & Understand**: Limit these to 30% of standard professional exams.
* **Apply & Analyze**: Introduce case studies, diagnostic logs, and scenario essays to measure K3 & K4 levels.
* **Evaluate & Create**: Require rubrics-based assignments, research portfolios, and group prototypes.`
  },
  {
    id: "creating-effective-case-based-assessments",
    title: "Creating Effective Case-Based Assessments",
    excerpt: "A practical walkthrough on crafting high-fidelity clinical and managerial scenarios for modern exams.",
    category: "Case-Based Learning",
    tags: ["Case-Based Learning", "Medical Education", "Professional Education"],
    author: { name: "Dr. Lisa Cuddy", role: "Dean of Clinical Affairs", avatar: "LC" },
    date: "May 08, 2026",
    readTime: "7 min read",
    gradient: "from-teal-600 to-indigo-700",
    likes: 104,
    views: 1210,
    content: `### Why Case-Based Scenarios Win

Case-Based Learning (CBL) mirrors genuine, messy real-world scenarios. Students must untangle compounding symptoms or multi-variable business bottlenecks to find resolutions.

#### Rules for Designing Elite Scenario Prompts
1. **Authenticity**: Never use dry, clinical textbook cases. Introduce temporal developments or secondary complications.
2. **Discriminative distractors**: MCQ choices must include common clinical cognitive errors so you can track precisely *why* a student failed.
3. **Structured multi-part scoring**: Break down deep essays into analytical clusters (e.g., Immediate diagnosis, treatment options, preventive protocol).`
  },
  {
    id: "the-future-of-ai-powered-evaluation",
    title: "The Future of AI-Powered Evaluation",
    excerpt: "What is next on the horizon? Combining LLMs, multimodal OCR, and real-time biometric test security features.",
    category: "AI in Assessment",
    tags: ["AI in Assessment", "Research in Assessment", "Educational Technology"],
    author: { name: "Dr. Timothy Gable", role: "AI Research Lead", avatar: "TG" },
    date: "Apr 28, 2026",
    readTime: "8 min read",
    gradient: "from-indigo-900 to-blue-700",
    likes: 254,
    views: 3100,
    content: `### On the Horizon: Cognitive Assessment Engines

As natural language models and vision processing converge, AI evaluation will progress from basic keyword scans into full conceptual comprehension.

#### Next-Generation Features:
* **Multimodal Handwriting Parsing**: Decipher complex scribble layers, doodles, and biological diagrams accurately on paper scripts.
* **Biometric Engagement Calibration**: Scan telemetry queues to alert online proctors of candidate focus loss or sudden cognitive strain.
* **Dynamic Blueprint Generation**: Automatically rewrite exams in real-time to match candidate focus shifts during testing sessions.`
  }
];

export function LandingPage({ onGetStarted, onSelectTab, subView = 'home', onChangeSubView }: LandingPageProps) {
  // Local sub-routing when prop is not supplied
  const [localSubView, setLocalSubView] = useState<'home' | 'blogs' | 'login'>('home');
  const activeView = onChangeSubView ? subView : localSubView;

  const setView = (view: 'home' | 'blogs' | 'login') => {
    if (onChangeSubView) {
      onChangeSubView(view);
    } else {
      setLocalSubView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pricing Interval State
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Active institution tab for the new Academician custom switcher
  const [activeInstitutionTab, setActiveInstitutionTab] = useState<string>('universities');

  // FAQ Accordion State (stores opened ID, null if all closed)
  const [openedFaq, setOpenedFaq] = useState<number | null>(0);

  // Demo Form State
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    role: 'Syllabus Coordinator',
    institution: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Enterprise Inquiry Modal State
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
  const [enterpriseForm, setEnterpriseForm] = useState({
    name: '',
    email: '',
    institution: '',
    message: ''
  });
  const [enterpriseSubmitted, setEnterpriseSubmitted] = useState(false);

  const handleEnterpriseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enterpriseForm.name.trim() || !enterpriseForm.email.trim() || !enterpriseForm.institution.trim()) {
      triggerToast("Please fill in all required fields marked with *");
      return;
    }
    setEnterpriseSubmitted(true);
    triggerToast("Inquiry submitted successfully! Our Sales team will contact you within 24 hours.");
  };

  // Login/Sign Up Form State
  const [loginMode, setLoginMode] = useState<'signin' | 'signup'>('signin');
  const [loginForm, setLoginForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'User',
    institution: ''
  });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  // Blog Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('iqassess_bookmarked_blogs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Local persistence for Likes and Views
  const [blogMetrics, setBlogMetrics] = useState<Record<string, { likes: number, views: number }>>(() => {
    const initial: Record<string, { likes: number, views: number }> = {};
    SAMPLE_BLOGS.forEach(b => {
      initial[b.id] = { likes: b.likes, views: b.views };
    });
    try {
      const saved = localStorage.getItem('iqassess_blog_metrics');
      if (saved) {
        return { ...initial, ...JSON.parse(saved) };
      }
    } catch {}
    return initial;
  });

  // Selected blog for Read Modal
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);
  
  // Real database fetch for blogs
  const [dbBlogs, setDbBlogs] = useState<BlogPost[]>([]);
  useEffect(() => {
    async function fetchBlogs() {
      const { data, error } = await supabase.from('blogs').select('*');
      if (!error && data) {
        setDbBlogs(data);
      }
    }
    fetchBlogs();
  }, []);

  // Merge dbBlogs with SAMPLE_BLOGS for display (db overrides local if found)
  const allBlogs = dbBlogs.length > 0 ? dbBlogs : SAMPLE_BLOGS;

  // Real commenting system stored in local state + local storage
  const [blogComments, setBlogComments] = useState<Record<string, BlogComment[]>>(() => {
    try {
      const saved = localStorage.getItem('iqassess_blog_comments');
      return saved ? JSON.parse(saved) : {
        "how-ai-transforming-assessment": [
          { id: "c1", authorName: "Dr. Susan Patel", text: "This mirrors exactly what we saw in our final nursing evaluations last season. Grader bias dropped by 80% with anonymous double-blind scoring.", timestamp: "2026-06-19 14:22" },
          { id: "c2", authorName: "Prof. Marcus Brody", text: "Are there study plans in place to test integrations with Blackboard or Canvas frameworks directly?", timestamp: "2026-06-20 09:15" }
        ],
        "guide-competency-based-assessment": [
          { id: "c3", authorName: "Dr. Linda Gray", text: "Excellent CBME breakdown. Incorporating direct rubrics mapping has saved our accreditation audit preparation timeline immensely.", timestamp: "2026-06-18 11:30" }
        ]
      };
    } catch {
      return {};
    }
  });

  const [commentForm, setCommentForm] = useState({ authorName: '', text: '' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync bookmarks & metrics & comments
  useEffect(() => {
    localStorage.setItem('iqassess_bookmarked_blogs', JSON.stringify(bookmarkedBlogs));
  }, [bookmarkedBlogs]);

  useEffect(() => {
    localStorage.setItem('iqassess_blog_metrics', JSON.stringify(blogMetrics));
  }, [blogMetrics]);

  useEffect(() => {
    localStorage.setItem('iqassess_blog_comments', JSON.stringify(blogComments));
  }, [blogComments]);

  // Handle URL deep link check on render
  useEffect(() => {
    if (window.location.pathname === '/blogs' || window.location.hash === '#blogs') {
      setView('blogs');
    } else if (window.location.pathname === '/login' || window.location.hash === '#login') {
      setView('login');
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleBookmarkToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedBlogs.includes(id)) {
      setBookmarkedBlogs(bookmarkedBlogs.filter(b => b !== id));
      triggerToast("Article removed from bookmarks.");
    } else {
      setBookmarkedBlogs([...bookmarkedBlogs, id]);
      triggerToast("Article bookmarked successfully.");
    }
  };

  const handleLikeBlog = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const likedKey = `iqassess_liked_${id}`;
    if (localStorage.getItem(likedKey)) {
      triggerToast("You have already liked this article.");
      return;
    }
    
    setBlogMetrics(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        likes: (prev[id]?.likes || 0) + 1
      }
    }));
    localStorage.setItem(likedKey, 'true');
    triggerToast("Thank you for your reaction!");
  };

  const incrementViewsCount = (id: string) => {
    const viewKey = `iqassess_viewed_${id}`;
    if (localStorage.getItem(viewKey)) return;

    setBlogMetrics(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        views: (prev[id]?.views || 0) + 1
      }
    }));
    localStorage.setItem(viewKey, 'true');
  };

  const handleShareBlog = (blog: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    const simulatedUrl = `${window.location.origin}/blogs/${blog.id}`;
    navigator.clipboard.writeText(simulatedUrl);
    triggerToast("Link copied to clipboard! (SEO Meta simulation)");
  };

  const handlePostComment = (blogId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.authorName.trim() || !commentForm.text.trim()) return;

    const newComment: BlogComment = {
      id: `comment_${Date.now()}`,
      authorName: commentForm.authorName.trim(),
      text: commentForm.text.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setBlogComments(prev => ({
      ...prev,
      [blogId]: [newComment, ...(prev[blogId] || [])]
    }));

    setCommentForm({ authorName: '', text: '' });
    triggerToast("Comment published under review status.");
  };

  const handleReadBlog = (blog: BlogPost) => {
    setActiveBlog(blog);
    incrementViewsCount(blog.id);
  };

  // Newsletter form
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsSubmitted, setNewsSubmitted] = useState(false);
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsSubmitted(true);
      setNewsletterEmail('');
    }
  };

  // Blog list computation
  const filteredBlogs = allBlogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (blog.tags && blog.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategory === "All Categories" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getRelatedPosts = (currentBlog: BlogPost) => {
    return allBlogs.filter(b => b.id !== currentBlog.id && (b.category === currentBlog.category || (b.tags && b.tags.some(tag => currentBlog.tags?.includes(tag))))).slice(0, 3);
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-[#2563EB] selection:text-white transition-colors relative min-h-screen">
      
      {/* Toast Alert Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-slide-up text-xs font-semibold">
          <Sparkles className="text-blue-400 shrink-0" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* RENDER HOME SAAS VIEW */}
      {activeView === 'home' && (
        <>
          {/* Hero Section */}
          <section className="relative pt-24 pb-28 md:pt-36 md:pb-40 overflow-hidden bg-[#0B0F19] text-white border-b border-indigo-950/40">
            {/* Retro-futuristic Cyber Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-20 pointer-events-none" />
            
            {/* High-tech Holographic Glowing Ambient Blooms */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
            


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Typography Column */}
                <div className="lg:col-span-7 space-y-8 text-left">
                  


                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white font-sans">
                    Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.2)]">Every Academician</span> with Intelligent Assessment & Outcome-Based Education
                  </h1>

                  <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
                    Create high-quality blueprints, map student outcomes, and automate evaluation workflows easily. An all-in-one AI platform engineered for educators, coordinators, clinical assessors, and administrators working in schools, colleges, health science institutions, and professional boards.
                  </p>

                  {/* Performance Advisory Notice with Neon Border accent */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/20 hover:border-blue-500/40 transition-colors text-slate-300 max-w-2xl flex items-start gap-3 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-blue-500 to-cyan-400" />
                    <Sparkles size={16} className="text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                    <p className="text-xs leading-relaxed font-sans">
                      <strong className="text-white font-black font-semibold">Performance Advisory:</strong> This AI tool is designed strictly to enhance and optimize academic performance, not to replace the critical judgment of educators. The final validity of any generated results must always be verified by a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-black font-bold">Qualified Academician</span>.
                    </p>
                  </div>

                  {/* Trust Indicators badges */}
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {["AI-Powered Core", "Competency-Based OBE Aligned", "Accreditation Compliant", "Multimodal Scanner OCR"].map((badge, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-900/60 hover:bg-slate-900/90 hover:border-cyan-500/30 transition border border-slate-800 rounded-lg text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        {badge}
                      </span>
                    ))}
                  </div>
                  
                  {/* Glowing Actions */}
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => {
                          setLoginMode('signup');
                          setView('login');
                        }}
                        id="hero-get-started-v2"
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 font-extrabold text-white transition-all shadow-lg hover:shadow-cyan-500/25 active:scale-95 flex items-center justify-center gap-2 text-sm leading-none border border-cyan-400/20 cursor-pointer"
                      >
                        Start Free Trial
                        <ChevronRight size={18} className="animate-bounce" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 font-medium flex items-center gap-1.5 mt-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      Try our <strong className="text-white">Premium Version</strong> free for <strong className="text-cyan-400">1 week</strong>!
                    </p>
                  </div>

                  {/* Quick stats grid as requested in Prompt (Styled with cyber frames) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80">
                    {[
                      { val: "90%", desc: "Faculty Time Saved", num: "STAT.TIME" },
                      { val: "100%", desc: "Competency Mapping", num: "STAT.OBE" },
                      { val: "10x", desc: "Faster Assessment", num: "STAT.SPD" },
                      { val: "24/7", desc: "AI-Powered Assistance", num: "STAT.LIV" },
                    ].map((st, i) => (
                      <div key={i} className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl relative overflow-hidden group hover:border-[#2563EB]/40 transition-colors">
                        <span className="text-[8px] font-mono text-slate-600 block mb-1">{st.num}</span>
                        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                          {st.val}
                        </div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{st.desc}</div>
                        <div className="absolute top-0 right-0 w-2 h-2 bg-slate-800 rounded-bl" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Visual Workflow Graphic - Intense Futuristic Panel */}
                <div className="lg:col-span-5 relative">
                  {/* Decorative glowing blob behind graphic */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 opacity-20 blur-xl group-hover:opacity-30 transition pointer-events-none" />
                  
                  <div className="relative mx-auto max-w-md bg-slate-950/95 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(37,99,235,0.15)] backdrop-blur-md">
                    <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                    
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400">IQASSESS // MAIN_LINK_ACTIVE</span>
                    </div>

                    <div className="space-y-4">
                      {/* Workflow block 1 */}
                      <div className="p-3 bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 rounded-xl flex gap-3 transition">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                          <BookOpen size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            Milestone Mapping
                            <span className="text-[8px] font-mono text-[#10B981] bg-emerald-500/10 px-1 rounded">SYS_CO_OK</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">Syllabus outcomes linked directly to Bloom's cognitive taxonomy.</p>
                        </div>
                      </div>

                      {/* Line */}
                      <div className="h-4 w-px bg-gradient-to-b from-blue-500/40 to-transparent ml-7" />

                      {/* Workflow block 2 */}
                      <div className="p-3 bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 rounded-xl flex gap-3 transition">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                          <Cpu size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            AI-Driven Builder
                            <span className="text-[8px] font-mono text-cyan-400 bg-cyan-500/10 px-1 rounded">BLP_GNR_A1</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">Custom question banks, blueprints & marking rubrics created instantly.</p>
                        </div>
                      </div>

                      {/* Line */}
                      <div className="h-4 w-px bg-gradient-to-b from-blue-500/40 to-transparent ml-7" />

                      {/* Workflow block 3 */}
                      <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl flex gap-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/10 rounded-full blur pointer-events-none" />
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 border border-blue-400/30">
                          <Award size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            Double-Blind Routing
                            <span className="px-1.5 py-0.5 bg-emerald-500 text-stone-900 rounded-md text-[8px] font-black uppercase">Active</span>
                          </div>
                          <p className="text-[10px] text-slate-300 mt-0.5">Anonymized token flow, independent graders allocation & bias checks.</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 p-2.5 rounded bg-slate-950 text-center text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                      ⚡ PIPELINE INTEGRATED // ONLINE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What is IQAssess & Academician Solutions Section */}
          <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <span className="text-xs font-bold tracking-widest text-[#2563EB] uppercase">Tailored for All Academicians</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"> What is IQAssess? </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  IQAssess is a next-generation intelligent evaluation ecosystem built for **all types of academicians**—including teachers, professors, clinical evaluators, curriculum coordinators, and deans—working across diverse educational domains to automate workloads while securing maximum compliance.
                </p>
              </div>

              {/* Targets visual grid showing the diverse range of institutions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { 
                    name: "Universities & Liberal Arts", 
                    desc: "Perfect for professors and registrars handling outcome-mapped syllabi, Course Outcomes (COs), and Program Outcomes (POs) with automated attainment spreadsheets.", 
                    icon: <GraduationCap size={20} className="text-blue-500" />
                  },
                  { 
                    name: "Medical, Dental & Nursing", 
                    desc: "Specially calibrated for clinical instructors tracking NMC competence rubrics, specialized Dental (BDS) standards, DOAP logs, and objective OSCE structures.", 
                    icon: <Stethoscope size={20} className="text-rose-500" />
                  },
                  { 
                    name: "Schools & Academies", 
                    desc: "Empowering school teachers and heads to easily generate balanced question sheets based on Bloom's Cognitive taxonomy with fully customizable rubrics.", 
                    icon: <BookOpen size={20} className="text-emerald-500" />
                  },
                  { 
                    name: "Allied Health & Vocational", 
                    desc: "Crafted for skill assessors, allied health educators, and vocational trainers managing competency check-sheets, project portfolios, and double-blind scoring loops.", 
                    icon: <Layers size={20} className="text-amber-500" />
                  }
                ].map((target, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800">
                        {target.icon}
                      </div>
                      <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mb-2">{target.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">{target.desc}</p>
                    </div>
                    <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-4 uppercase tracking-wider">0{idx + 1} Environment Model</div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* Pricing Section with Monthly/Yearly toggle */}
          <section className="py-20 bg-slate-50 dark:bg-[#070B12]" id="pricing">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                <span className="text-xs font-bold tracking-widest text-[#2563EB] uppercase">Transparent Investment</span>
                <h2 className="text-3xl font-extrabold text-slate-00 dark:text-white tracking-tight">Flexible, Transparent Pricing Plans</h2>
                <p className="text-slate-500 mt-2 font-light text-sm">Choose the tier optimized for your faculty members or entire multi-campus board structure.</p>

                {/* Switcher Toggle */}
                <div className="flex items-center justify-center gap-3 pt-4">
                  <span className={`text-xs font-bold ${pricingPeriod === 'monthly' ? 'text-blue-600' : 'text-slate-400 dark:text-slate-550'}`}>Monthly billing</span>
                  <button 
                    onClick={() => setPricingPeriod(pricingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                    className="w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-800 p-1 transition-colors relative"
                  >
                    <div className={`w-4 h-4 rounded-full bg-blue-600 transition-transform ${pricingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                  <span className={`text-xs font-bold ${pricingPeriod === 'yearly' ? 'text-blue-600' : 'text-slate-400 dark:text-slate-550'} flex items-center gap-1.5`}>
                    Annual billing
                    <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 text-[9px] rounded-full uppercase">Save ~20%</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Standard Version Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 relative flex flex-col justify-between shadow-sm hover:shadow-lg transition">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Standard Version</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Perfect for Faculty Members and Departments</p>
                    
                    <div className="my-6">
                      <span className="text-5xl font-black text-slate-900 dark:text-white">
                        {pricingPeriod === 'monthly' ? '₹500' : '₹5,000'}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {pricingPeriod === 'monthly' ? '/ Month' : '/ Year'}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800/80 my-6 pt-6">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block mb-4">Features Included:</span>
                      <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-3.5">
                        {[
                          "Essay Builder",
                          "MCQ Builder",
                          "Rubric Builder",
                          "Essay AS",
                          "Reflection AS"
                        ].map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-blue-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setLoginMode('signup');
                      setView('login');
                    }}
                    className="w-full mt-6 py-3 px-4 rounded-xl border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold transition-all text-xs cursor-pointer"
                  >
                    Get Standard
                  </button>
                </div>

                {/* Premium Version Card */}
                <div className="bg-slate-900 text-white border-2 border-blue-500 rounded-2xl p-8 relative flex flex-col justify-between shadow-xl">
                  {/* Badge */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">
                    Most Popular
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">Premium Version</h3>
                    <p className="text-xs text-slate-400 mt-1">Perfect for Institutions & Universities</p>
                    
                    <div className="my-6">
                      <span className="text-5xl font-black text-white">
                        {pricingPeriod === 'monthly' ? '₹1,000' : '₹10,000'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {pricingPeriod === 'monthly' ? '/ Month' : '/ Year'}
                      </span>
                    </div>

                    <div className="border-t border-slate-800 my-6 pt-6">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-4">Includes Everything in Standard, plus:</span>
                      <ul className="text-xs text-slate-300 space-y-3.5">
                        {[
                          "Blueprint Builder",
                          "Assessment Builder",
                          "Paper AS",
                          "MCQ AS",
                          "BluePrint Assessor",
                          "Item Analysis & Analytics"
                        ].map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        setLoginMode('signup');
                        setView('login');
                      }}
                      className="w-full mt-6 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all text-xs shadow-md shadow-blue-500/20 cursor-pointer"
                    >
                      Get Premium
                    </button>
                    <p className="text-[11px] text-cyan-400 font-bold text-center animate-pulse">
                      🎁 Start with a 1-Week Free Trial!
                    </p>
                  </div>
                </div>

                {/* Enterprise Version Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 relative flex flex-col justify-between shadow-sm hover:shadow-lg transition">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Enterprise Version</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-550 mt-1">Perfect for Institutions and Universities</p>
                    
                    <div className="my-6">
                      <span className="text-4xl font-black text-[#6366F1] dark:text-[#818CF8]">
                        Contact Us
                      </span>
                      <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-1">Custom quote & bulk deployment</p>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800/80 my-6 pt-6">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block mb-4">Tailored Capabilities:</span>
                      <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-3.5">
                        {[
                          "Anonymous Paper Valuation",
                          "Full Customisation support",
                          "Custom rubrics integration",
                          "Institutional SSO / Active Directory",
                          "In-depth dedicated security review",
                          "Dedicated account manager",
                          "SLA & priority cloud host option"
                        ].map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-indigo-550 shrink-0" />
                            <span className={i < 2 ? "font-bold text-slate-750 dark:text-slate-200" : ""}>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowEnterpriseModal(true)}
                    className="w-full mt-6 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all text-xs shadow-md shadow-indigo-550/10 cursor-pointer"
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </section>


          {/* Core Modules cards Section */}
          <section className="py-20 bg-slate-50 dark:bg-[#090D16]" id="features">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <span className="text-xs font-bold tracking-widest text-[#2563EB] uppercase">Comprehensive Suite</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
                  Academic Evaluation Modules
                </h2>
                <p className="text-slate-600 dark:text-slate-450 text-sm font-light leading-relaxed">
                  Durable, cloud-synchronized tools mapping your assessments with learning outcomes, Bloom's taxonomy, and outcome metrics. Click any card to launch pipelines in the portal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* 1. Assessment DS */}
                <div 
                  onClick={() => onSelectTab && onSelectTab('assessment-ds')}
                  className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:border-blue-500/40 hover:-translate-y-1 transition duration-300 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6 font-bold group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-colors">
                    <Users size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Assessment DS</h3>
                  <p className="text-slate-400 text-xs tracking-wider font-semibold uppercase mb-3">Assessment Development System</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
                    Configure question papers, essays, rubrics, and assignments. Fully automated AI-generation templates for high-order evaluations.
                  </p>
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Build Materials:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["MCQs", "Essays", "SAQs", "LAQs", "Case Scenarios", "Role Plays", "SDL Activities", "Assignments", "Rubrics"].map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded text-[9.5px] font-medium text-slate-500 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Blueprint Builder */}
                <div 
                  onClick={() => onSelectTab && onSelectTab('dashboard')}
                  className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:border-purple-500/40 hover:-translate-y-1 transition duration-300 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6 font-bold group-hover:bg-purple-600 group-hover:text-white dark:group-hover:bg-purple-500 transition-colors">
                    <FileText size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Blueprint Builder</h3>
                  <p className="text-slate-400 text-xs tracking-wider font-semibold uppercase mb-3">Table of Specifications</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
                    Produce complete examinations automatically. Distribute syllabus marks evenly, keeping precise track of Bloom's levels.
                  </p>
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Generate Features:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Assessment Blueprints", "Competency Mapping", "Bloom's Distribution", "Marks Distribution"].map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-855 rounded text-[9.5px] font-medium text-slate-500 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Anonymous Evaluation */}
                <div 
                  onClick={() => onSelectTab && onSelectTab('dashboard')}
                  className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-1 transition duration-300 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6 font-bold group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 transition-colors">
                    <Award size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Anonymous Evaluation</h3>
                  <p className="text-slate-400 text-xs tracking-wider font-semibold uppercase mb-3">Double-Blind Protocol</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
                    Anonymize student credentials completely. Route scripts dynamically to dual independent assessors with dispute moderation.
                  </p>
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Security Filters:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Blind Evaluation", "Double Blind Evaluation", "Digital Script Routing", "Moderation Workflows"].map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded text-[9.5px] font-medium text-slate-500 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Paper Assessment System */}
                <div 
                  onClick={() => onSelectTab && onSelectTab('paper-as')}
                  className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:border-[#10B981]/40 hover:-translate-y-1 transition duration-300 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/40 text-[#10B981] rounded-xl flex items-center justify-center mb-6 font-bold group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                    <Cpu size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#10B981] transition-colors">Paper Assessment System</h3>
                  <p className="text-slate-400 text-xs tracking-wider font-semibold uppercase mb-3">Multimodal Scans & OCR</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
                    Scans examinations and identifies student handwriting. Generates AI-assisted score recommendation grids mapped against rubrics.
                  </p>
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Paper Pipelines:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["OCR", "Script Evaluation", "AI Scoring Assistance", "Rubric Mapping"].map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded text-[9.5px] font-medium text-slate-500 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. Competency Analytics */}
                <div 
                  onClick={() => onSelectTab && onSelectTab('dashboard')}
                  className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:border-rose-500/40 hover:-translate-y-1 transition duration-300 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-450 rounded-xl flex items-center justify-center mb-6 font-bold group-hover:bg-rose-600 group-hover:text-white dark:group-hover:bg-rose-500 transition-colors">
                    <TrendingUp size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Competency Analytics</h3>
                  <p className="text-slate-400 text-xs tracking-wider font-semibold uppercase mb-3">Accreditation Metrics</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
                    Export comprehensive accreditation logs. Map attainment grids across departments, batches, and specific educational branches.
                  </p>
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Outcome Reporting:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["CO Mapping", "PO Mapping", "OBE Tracking", "Accreditation Reports"].map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded text-[9.5px] font-medium text-slate-500 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 6. Reflection Assessment */}
                <div 
                  onClick={() => onSelectTab && onSelectTab('reflection-as')}
                  className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:border-amber-500/40 hover:-translate-y-1 transition duration-300 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-6 font-bold group-hover:bg-amber-600 group-hover:text-white dark:group-hover:bg-amber-500 transition-colors">
                    <Globe size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Reflection Assessment</h3>
                  <p className="text-slate-400 text-xs tracking-wider font-semibold uppercase mb-3">Metacognitive Development</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
                    Assess clinical reflective notebooks, internship logs, and professionalism portfolios with deep qualitative analytical criteria.
                  </p>
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Track Indicators:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Portfolio Review", "Reflective Writing", "Internship Logs", "Professionalism Tracking"].map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded text-[9.5px] font-medium text-slate-500 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Who Can Use Section */}
          <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/75">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <span className="text-xs font-bold tracking-widest text-[#2563EB] uppercase">Diverse Educators Community</span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Academicians Who Rely on IQAssess</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-light">Providing optimized tools to match the unique evaluation challenges of educators in every discipline.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { name: "School Teachers", label: "Foundational Bloom's assessments" },
                  { name: "College Lecturers", label: "Outcome-mapped course portfolios" },
                  { name: "University Deans", label: "Syllabus design & grading boards" },
                  { name: "Medical Professors", label: "OSCE exam rubrics & clinical logs" },
                  { name: "Dental Educators", label: "Specialized clinical checklist matrices" },
                  { name: "Nursing Instructors", label: "Continuous workplace competencies" },
                  { name: "Allied Health Tutors", label: "Practical skill-sheet score cards" },
                  { name: "Vocational Mentors", label: "Work-based credentialing portfolios" },
                  { name: "Board Examiners", label: "State-wide double-blind grading" },
                  { name: "Corporate Assessors", label: "Workforce competency analytics" }
                ].map((aud, key) => (
                  <div key={key} className="p-5 h-36 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition duration-200">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#2563EB] flex items-center justify-center font-bold text-xs shrink-0">{key + 1}</div>
                    <div>
                      <h4 className="text-sm font-black text-slate-850 dark:text-white">{aud.name}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-tight mt-1">{aud.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why IQAssess? Checklist Section */}
          <section className="py-20 bg-white dark:bg-slate-900" id="why-iqassess">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 text-left space-y-4">
                  <span className="text-xs font-bold tracking-widest text-[#2563EB] uppercase">Institutional Value</span>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Why Choose IQAssess?</h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Designed to simplify regulatory audits while protecting student fairness at every single evaluation touch-point.
                  </p>
                </div>

                <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 p-8 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-5">
                  {[
                    { title: "Reduce Faculty Workload", desc: "Shave 70-90% off traditional question paper composition and rubrics scoring efforts." },
                    { title: "Improve Consistency & Fairness", desc: "Our double-blind routine flags grading deviations over 15% instantly for moderation queues." },
                    { title: "Enhance Assessment Quality", desc: "Calibrate exams precisely against Bloom's cognitive taxonomy domains to test genuine problem solving." },
                    { title: "Support Accreditation Panels", desc: "Build exhaustive continuous attainment tables and maps conforming directly with NBA, Board, or ABET audits." },
                    { title: "Enable Competency-Based Education", desc: "Direct integration for NMC, medical DOAP logs, other descriptive portfolios, and professionalism logs." },
                    { title: "Generate Assessment Analytics", desc: "Unveil faculty effectiveness, departmental progress metrics, and syllabus capability holes automatically." },
                    { title: "Improve Student Learning Outcomes", desc: "Bridge teacher-student gaps with high-grade quantitative feedback points instantly after grading is complete." }
                  ].map((why, key) => (
                    <div key={key} className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} className="stroke-[3px]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-850 dark:text-slate-100 leading-none">{why.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-normal">{why.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Educational Testimonials Section */}
          <section className="py-20 bg-slate-50 dark:bg-[#070B12]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <span className="text-xs font-bold tracking-widest text-[#2563EB] uppercase">Proven Success</span>
              <h2 className="text-3xl font-extrabold text-[#0F172A] dark:text-white mb-12">Educators Love IQAssess</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    type: "Medical College",
                    text: "Managing thousands of DOAP session evaluations across MBBS branches used to take up weeks of paperwork. IQAssess reduced this process into a few clicks on our institutional tablets.",
                    author: "Dr. Arthur Armstrong",
                    role: "Dean, Pacific West Medical College"
                  },
                  {
                    type: "University",
                    text: "Syllabus mapping for NAAC and NBA accreditation committees used to exhaust our entire administrative workforce. With automated CO-PO tagging tables, we compiled audit folders in record time.",
                    author: "Dean Margaret H.",
                    role: "Evaluation Director, State Technical University"
                  },
                  {
                    type: "Nursing College",
                    text: "Evaluating descriptive internship dairies is incredibly laborious. The Reflection Assessment tool mapped clinical rubrics cleanly while providing robust feedback profiles directly to our candidates.",
                    author: "Prof. Kenneth Chang",
                    role: "Head of Nursing, Allied Sciences Academy"
                  },
                  {
                    type: "Engineering Institution",
                    text: "The Double-Blind Evaluation module completely eliminated grading subjectivity on final project thesis papers. GR-based cryptotags and automated variance checks are remarkable.",
                    author: "Dr. Elena Vance",
                    role: "Department Coordinator, Metro Polytechnic Board"
                  }
                ].map((ts, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-left shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#2563EB] text-[9px] font-black uppercase tracking-wider mb-4">
                        {ts.type}
                      </span>
                      <p className="text-slate-600 dark:text-slate-350 text-xs italic leading-relaxed mb-6">"{ts.text}"</p>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-auto">
                      <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">{ts.author}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{ts.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Accordion Section */}
          <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-850">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 space-y-3">
                <span className="text-xs font-bold tracking-widest text-[#2563EB] uppercase">Got Questions?</span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "What is IQAssess?",
                    a: "IQAssess is a cloud-native, end-to-end intelligent assessment development and double-blind grading portal. It manages curriculums, maps custom syllabus requirements, designs comprehensive blueprints, automatically evaluates written script sheets, and prints accreditation-validated Continuous Attainment logs."
                  },
                  {
                    q: "How does AI evaluation work?",
                    a: "Our AI platform indexes multi-dimensional rubrics down to precise performance parameters. It handles scanned examinations using high-accuracy optical characters analysis, compares handwriting drafts against preset marking guides, and provides recommended metrics. Grades are strictly validated by a human instructor before release, ensuring security."
                  },
                  {
                    q: "Can I generate randomized question papers?",
                    a: "Yes! The Blueprint Builder allows teachers to specify structural topics and difficulty splits. The system instantly draws from verified item banks to output styled paper sheets along with detailed keys, exportable directly to PDF."
                  },
                  {
                    q: "Can it support NMC CBME?",
                    a: "Absolutely. IQAssess provides full programmatic integration with NMC Competency-Based Medical Education guidelines, enabling logbook tracking, clinical rubrics monitoring, DOAP sheets, and reflective portfolio reviews."
                  },
                  {
                    q: "Can it support outcome-based education (OBE)?",
                    a: "Yes, OBE alignment resides at the core of all our systems. Every assessment, MCQ option, and essay prompt tags directly to customized Course Outcomes (COs) and Program Outcomes (POs), feeding directly into real-time quality graphs."
                  },
                  {
                    q: "Can I export PDF reports?",
                    a: "Yes. Every finalized evaluation sheet, blueprint mockup, and continuous accreditation report is readily exportable as pristine PDF documents, ready for administrative audits."
                  },
                  {
                    q: "How secure is the platform?",
                    a: "IQAssess utilizes bank-grade SSL encryption and adheres strictly to student information containment guidelines. Credentials are fully cryptotagged during double-blind assessments, protecting candidate identification."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40 overflow-hidden">
                    <button 
                      onClick={() => setOpenedFaq(openedFaq === index ? null : index)}
                      className="w-full text-left p-5 flex justify-between items-center bg-transparent focus:outline-none"
                    >
                      <span className="font-semibold text-slate-805 dark:text-slate-100 text-sm">{faq.q}</span>
                      <ChevronDown size={14} className={`text-slate-400 transition-transform ${openedFaq === index ? 'rotate-180' : ''}`} />
                    </button>
                    {openedFaq === index && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-500 dark:text-slate-455 leading-relaxed bg-white/40 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-850">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-20 bg-gradient-to-tr from-slate-900 via-slate-900 to-indigo-950 text-white text-center border-t border-indigo-900/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
              <span className="text-xs font-black tracking-widest text-blue-400 uppercase">Ready to Transform Assessment?</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none text-white">
                Start Building Better Assessments with AI Today
              </h2>
              <p className="text-sm text-slate-200 max-w-xl mx-auto font-light leading-relaxed">
                Empower your department or university board with intelligent blueprinting, anonymous double-blind grading, and spreadsheet-free accreditation Attainment maps.
              </p>
              <div className="flex flex-col items-center gap-3 pt-4">
                <button 
                  onClick={() => {
                    setLoginMode('signup');
                    setView('login');
                  }}
                  className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white transition shadow-lg shadow-blue-500/20 text-xs cursor-pointer"
                >
                  Start Free Trial
                </button>
                <p className="text-xs text-slate-200 font-medium flex items-center gap-1.5 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Try our <strong className="text-white">Premium Version</strong> for <strong className="text-cyan-400">1 week</strong> free!
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 bg-slate-900 border-t border-slate-800 text-slate-500 text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex gap-6 sm:ml-auto">
                  <span onClick={() => setView('blogs')} className="hover:text-slate-300 cursor-pointer">Sitemap Blogs</span>
                  <span className="hover:text-slate-300 cursor-pointer">Security Standards</span>
                  <span className="hover:text-slate-300 cursor-pointer">Privacy Protocol</span>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* RENDER BLOGS VIEW */}
      {activeView === 'blogs' && (
        <div className="pt-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Breadcrumbs block */}
          <div className="mb-10 text-left">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <span onClick={() => setView('home')} className="hover:text-blue-550 cursor-pointer font-bold">Home</span>
              <span>/</span>
              <span className="text-slate-600 dark:text-slate-500">Blogs & Publications</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-905 dark:text-white tracking-tight">Academic Grading & Assessment Blog</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 max-w-2xl">
              Stay updated with academic curriculum updates, Bloom's taxonomy strategies, NMC CBME guides, outcome measurements, and continuous accreditation research.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Sidebar Category Filters (Desktop only) */}
            <div className="hidden lg:block space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Filter size={12} /> Filter By Category
                </h3>
                <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {BLOG_CATEGORIES.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedCategory(cat);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${selectedCategory === cat ? 'bg-blue-500 text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-600 dark:text-slate-400'}`}
                    >
                      {cat === "All Categories" ? cat : `✦ ${cat}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter subscription widget */}
              <div className="bg-gradient-to-tr from-[#0F172A] to-[#1E293B] text-white p-6 rounded-2xl shadow-md border border-slate-800/80">
                <Mail size={24} className="text-blue-400 mb-3" />
                <h3 className="text-sm font-bold">Newsletter Subscription</h3>
                <p className="text-[10px] text-slate-400 mt-1 lines-2 leading-relaxed">
                  Join 10,000+ educators receiving weekly syllabus blueprints, exam tips & grading updates.
                </p>
                {newsSubmitted ? (
                  <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-emerald-400 text-[10px]">
                    ✓ Subscribed! Check your inbox.
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="mt-4 space-y-2">
                    <input
                      type="email"
                      required
                      placeholder="Your official email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 transition py-2 text-xs rounded-lg font-bold"
                    >
                      Subscribe Now
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Main Blog catalog & searching */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Search input & Mobile filters */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-405" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search blogs, categories, authors..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-801 text-xs text-slate-800 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition shadow-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Mobile categories drop-down selector (shown only below large screens) */}
                <div className="lg:hidden w-full flex items-center gap-2">
                  <Filter size={14} className="text-slate-400 shrink-0" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-350"
                  >
                    {BLOG_CATEGORIES.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="text-[11px] font-semibold text-slate-400 shrink-0">
                  Showing {filteredBlogs.length} articles
                </div>
              </div>

              {/* Tag helpers strip based on dynamic keywords */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedCategory !== "All Categories" && (
                  <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg text-[10.5px] font-bold flex items-center gap-1">
                    Category: {selectedCategory}
                    <X size={12} className="cursor-pointer" onClick={() => setSelectedCategory("All Categories")} />
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-lg text-[10.5px] font-bold flex items-center gap-1">
                    Search: "{searchQuery}"
                    <X size={12} className="cursor-pointer" onClick={() => setSearchQuery('')} />
                  </span>
                )}
              </div>

              {/* Empty state check */}
              {filteredBlogs.length === 0 ? (
                <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-3">
                  <BookOpen size={48} className="text-slate-300 mx-auto animate-pulse" />
                  <h3 className="font-bold text-slate-805 dark:text-white">No Publications Found</h3>
                  <p className="text-xs text-slate-450 dark:text-slate-500 max-w-sm mx-auto">
                    We couldn't locate any educational blog entries matching your search filter criteria. Try choosing another category index or clearing your search phrase.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All Categories'); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-505 transition shadow"
                  >
                    Reset Filter Indexes
                  </button>
                </div>
              ) : (
                /* Blogs grid layout rendering template */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                  {filteredBlogs.map((blog) => {
                    const metrics = blogMetrics[blog.id] || { likes: blog.likes, views: blog.views };
                    const commentsCount = blogComments[blog.id]?.length || 0;
                    const isBookmarked = bookmarkedBlogs.includes(blog.id);
                    const extra = BLOG_EXTRAS[blog.id] || {
                      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
                      summary: blog.excerpt
                    };

                    return (
                      <div
                        key={blog.id}
                        onClick={() => handleReadBlog(blog)}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm hover:shadow-lg hover:border-blue-500/30 transition duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
                      >
                        <div>
                          {/* Beautiful Card Cover Image with Overlays */}
                          <div className="h-44 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-950">
                            <img
                              src={extra.image}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            {/* Overlay for contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                            
                            {/* Category Tag on Top Left, Bookmark on Top Right */}
                            <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                              <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white text-[9px] font-black tracking-widest uppercase border border-white/10">
                                {blog.category}
                              </span>
                              <button
                                onClick={(e) => handleBookmarkToggle(blog.id, e)}
                                className={`p-1.5 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white transition cursor-pointer ${isBookmarked ? 'text-amber-300' : ''}`}
                                title={isBookmarked ? "Bookmarked" : "Save to Reading List"}
                              >
                                <Bookmark size={13} fill={isBookmarked ? "currentColor" : "none"} />
                              </button>
                            </div>
                            
                            {/* Publish Date on Bottom Left */}
                            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-white/90 z-10 flex items-center gap-1.5">
                              <Calendar size={10} className="text-blue-400" />
                              {blog.date}
                            </div>
                          </div>

                          <div className="p-5 text-left space-y-3">
                            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                              {blog.title}
                            </h3>
                            
                            {/* Brief Info/Summary */}
                            <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-3 leading-relaxed font-normal">
                              {extra.summary}
                            </p>
                          </div>
                        </div>

                        {/* Interactive footer parameters count strip */}
                        <div className="p-5 border-t border-slate-50 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-[10.5px] font-medium text-slate-400 dark:text-slate-500">
                            <span 
                              onClick={(e) => { e.stopPropagation(); handleLikeBlog(blog.id); }}
                              className="flex items-center gap-1 hover:text-rose-500 transition cursor-pointer"
                              title="Reaction tally"
                            >
                              <Heart size={12} />
                              {metrics.likes}
                            </span>
                            <span className="flex items-center gap-1" title="Reading hits">
                              <Eye size={12} />
                              {metrics.views}
                            </span>
                            <span className="flex items-center gap-1" title="Comments summary">
                              <MessageCircle size={12} />
                              {commentsCount}
                            </span>
                          </div>

                          <span className="text-[10.5px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Read Article
                            <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RENDER LOGIN / SIGN UP VIEW */}
      {activeView === 'login' && (
        <div className="pt-12 pb-24 max-w-md mx-auto px-4">
          
          {/* Breadcrumbs returning bar */}
          <div className="mb-6 flex items-center justify-between">
            <button 
              onClick={() => setView('home')} 
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              Return Home
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-950 dark:text-white font-sans tracking-tight">
              {loginMode === 'signin' ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              {loginMode === 'signin' 
                ? 'Sign in to your IQAssess account' 
                : 'Register your institutional workspace profile'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-md space-y-6">
            
            {/* Mode Toggle Switch (capsule container like the user mockup) */}
            <div className="flex bg-slate-100/90 dark:bg-slate-950/80 p-1.5 rounded-xl border border-slate-100/50 dark:border-slate-800/50">
              <button
                type="button"
                onClick={() => { setLoginMode('signin'); setLoginError(''); }}
                className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  loginMode === 'signin'
                    ? 'bg-[#1E3A8A] text-white shadow-md'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setLoginMode('signup'); setLoginError(''); }}
                className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  loginMode === 'signup'
                    ? 'bg-[#1E3A8A] text-white shadow-md'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Banner if any */}
            {loginError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 rounded-lg text-xs leading-normal text-left">
                ⚠️ {loginError}
              </div>
            )}

            {/* Form Elements */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setLoginError('');
                setLoginLoading(true);

                // Form Validation Checks
                if (!loginForm.email.includes('@')) {
                  setLoginError('Invalid email address. Please use an official institutional ID.');
                  setLoginLoading(false);
                  return;
                }
                if (loginForm.password.length < 5) {
                  setLoginError('Password must contain at least 5 characters.');
                  setLoginLoading(false);
                  return;
                }
                if (loginMode === 'signup' && loginForm.password !== confirmPassword) {
                  setLoginError('Passwords do not match. Please re-enter.');
                  setLoginLoading(false);
                  return;
                }
                if (!loginForm.username.trim()) {
                  setLoginError('Preferred username / name is required to authenticate.');
                  setLoginLoading(false);
                  return;
                }

                // Simulated Handshake Delay
                setTimeout(() => {
                  setLoginLoading(false);
                  triggerToast(`Welcome back, ${loginForm.username}! Opening dashboard...`);
                  
                  // Trigger callback
                  onGetStarted({
                    username: loginForm.username,
                    email: loginForm.email,
                    role: loginMode === 'signup' ? 'Faculty / Instructor' : loginForm.role,
                    institution: loginMode === 'signup' ? 'State Technical College' : (loginForm.institution || 'State Academic Board'),
                    version: loginForm.email === 'drnarayanabjp@gmail.com' ? 'Premium' : 'Standard'
                  });
                }, 900);
              }}
              className="space-y-4 text-left"
            >
              
              {/* Optional Username/Name display */}
              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] dark:text-slate-300 mb-1.5 font-sans">
                  {loginMode === 'signup' ? 'Full Name & Degree' : 'Preferred Full Name / Member ID'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder={loginMode === 'signup' ? 'e.g. Dr. Arthur Miller, MD' : 'e.g. Dean Arthur Armstrong'}
                    className="w-full pl-10 pr-3.5 py-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-blue-50/40 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* EMAIL FIELD */}
              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] dark:text-slate-300 mb-1.5 font-sans">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="e.g. aimsrcpharmac@gmail.com"
                    className="w-full pl-10 pr-3.5 py-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-blue-50/40 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] dark:text-slate-300 mb-1.5 font-sans">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-blue-50/40 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white transition-all font-medium"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* CONFIRM PASSWORD (ONLY IN SIGNUP MODE) */}
              {loginMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] dark:text-slate-300 mb-1.5 font-sans">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-blue-50/40 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white transition-all font-medium"
                    />
                  </div>
                </div>
              )}

              {loginMode === 'signin' && (
                <div className="text-right">
                  <button 
                    type="button"
                    onClick={() => triggerToast("Institutional password recovery link has been simulated.")} 
                    className="text-xs text-blue-500 hover:underline cursor-pointer font-semibold font-sans animate-fade-in"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submission Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3.5 rounded-xl bg-[#1E3A8A] hover:bg-blue-800 disabled:bg-blue-400 font-extrabold text-white text-xs transition-all duration-200 tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10"
                >
                  {loginLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {loginMode === 'signin' ? 'Sign In' : 'Sign Up'}
                      <ChevronRight size={14} className="mt-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Account toggle helper text */}
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
              {loginMode === 'signin' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setLoginMode('signup'); setLoginError(''); }}
                    className="text-blue-500 hover:underline font-bold bg-transparent border-none cursor-pointer"
                  >
                    Create one free
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setLoginMode('signin'); setLoginError(''); }}
                    className="text-blue-500 hover:underline font-bold bg-transparent border-none cursor-pointer"
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>

          </div>



          {/* Secure statement footer */}
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed text-center font-light mt-6">
            🔐 All login pipelines are fully secure. Handshakes process local and server-side outcome maps. This tool is built to enhance academic workflows, not to replace manual oversight; therefore, final validity rests entirely with a Qualified Academician.
          </p>

          <div className="mt-6 text-center">
            <button
              onClick={() => setView('home')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer font-semibold transition"
            >
              <Home size={14} className="mb-0.5" />
              Return to Home Page
            </button>
          </div>

        </div>
      )}

      {/* FULL BLOG POST DETAILED READING SCREEN (MODAL MODE) */}
      {activeBlog && (() => {
        const extra = BLOG_EXTRAS[activeBlog.id] || {
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
          summary: activeBlog.excerpt
        };
        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md flex justify-center items-start overflow-y-auto p-4 sm:p-6 md:p-10 animate-fade-in">
            <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 text-left flex flex-col my-auto">
              
              {/* Sticky/Top Header Actions Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
                <button
                  onClick={() => setActiveBlog(null)}
                  className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back to Catalog
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleBookmarkToggle(activeBlog.id, e)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-slate-205 transition cursor-pointer"
                    title="Toggle bookmark status"
                  >
                    <Bookmark size={15} fill={bookmarkedBlogs.includes(activeBlog.id) ? "currentColor" : "none"} className={bookmarkedBlogs.includes(activeBlog.id) ? "text-amber-550" : ""} />
                  </button>
                  <button
                    onClick={(e) => handleShareBlog(activeBlog, e)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-slate-205 transition cursor-pointer"
                    title="Copy Article link"
                  >
                    <Share2 size={15} />
                  </button>
                  <button
                    onClick={() => setActiveBlog(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition cursor-pointer text-xs font-bold"
                  >
                    <span>Close</span>
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Main Scrolling Content Body */}
              <div className="p-6 sm:p-10 md:p-12 space-y-8 overflow-y-auto max-h-[80vh]">
                
                {/* Header breadcrumbs and reading time */}
                <div>
                  <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 mb-3">
                    <span onClick={() => { setActiveBlog(null); setView('home'); }} className="hover:underline cursor-pointer">IQAssess Home</span>
                    <span>/</span>
                    <span onClick={() => setActiveBlog(null)} className="hover:underline cursor-pointer">Blogs</span>
                    <span>/</span>
                    <span className="text-slate-650 dark:text-slate-400 font-bold line-clamp-1">{activeBlog.title}</span>
                  </div>

                  {/* Category Tags Line */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-lg tracking-wider uppercase">
                      {activeBlog.category}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock size={11} /> {activeBlog.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                    {activeBlog.title}
                  </h1>
                </div>

                {/* Author Info Card */}
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/60 p-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                    {activeBlog.author.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{activeBlog.author.name}</h4>
                    <p className="text-[10px] sm:text-xs text-slate-400">{activeBlog.author.role}</p>
                  </div>
                  <div className="ml-auto text-[10px] sm:text-xs text-slate-400 font-mono">
                    Published: {activeBlog.date}
                  </div>
                </div>

                {/* Beautiful Big Cover Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800/80">
                  <img
                    src={extra.image}
                    alt={activeBlog.title}
                    className="w-full aspect-[21/9] sm:aspect-[16/9] md:aspect-[21/9] object-cover hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-3 text-[10px] text-white/90 font-mono backdrop-blur-[1px]">
                    Featured Visual: {activeBlog.category} &amp; Accreditation Resource
                  </div>
                </div>

                {/* Executive Summary Block */}
                <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/20 dark:from-blue-950/20 dark:to-slate-900/10 border-l-4 border-blue-600 dark:border-blue-500 rounded-r-2xl p-6 text-left shadow-sm">
                  <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-blue-600 dark:text-blue-400 animate-pulse" /> Executive Summary
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-medium italic">
                    "{extra.summary}"
                  </p>
                </div>

                {/* Main Detailed Story Content */}
                <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 space-y-6 leading-relaxed border-b border-slate-100 dark:border-slate-800 pb-8 font-normal text-sm sm:text-base">
                  {activeBlog.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={index} className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white pt-4 pb-1 border-b border-slate-100 dark:border-slate-800/60 mb-3">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('#### ')) {
                      return (
                        <h4 key={index} className="text-base sm:text-lg font-bold text-slate-800 dark:text-white pt-2 mb-2">
                          {paragraph.replace('#### ', '')}
                        </h4>
                      );
                    }
                    if (paragraph.startsWith('1. ') || paragraph.startsWith('* ')) {
                      const lines = paragraph.split('\n');
                      return (
                        <ul key={index} className="list-disc pl-6 space-y-2 mt-2">
                          {lines.map((l, li) => {
                            const cleanLine = l.replace(/^\d+\.\s+\*\s*/, '').replace(/^\*\s*/, '').replace(/^\d+\.\s*/, '');
                            const parts = cleanLine.split('**');
                            if (parts.length >= 3) {
                              return (
                                <li key={li} className="leading-relaxed">
                                  <strong className="text-slate-900 dark:text-white font-semibold">{parts[1]}</strong>
                                  {parts.slice(2).join('')}
                                </li>
                              );
                            }
                            return <li key={li} className="leading-relaxed">{cleanLine}</li>;
                          })}
                        </ul>
                      );
                    }
                    return <p key={index} className="text-slate-600 dark:text-slate-300 leading-relaxed">{paragraph}</p>;
                  })}
                </div>

                {/* Reaction footer strip */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleLikeBlog(activeBlog.id)}
                      className="px-4 py-2 bg-rose-50 dark:bg-rose-950/20 border border-slate-100 dark:border-slate-800/80 text-rose-600 dark:text-rose-400 hover:bg-rose-100/60 dark:hover:bg-rose-900/30 font-bold rounded-xl text-xs transition duration-200 flex items-center gap-1.5 focus:outline-none cursor-pointer"
                    >
                      <Heart size={14} fill={localStorage.getItem(`iqassess_liked_${activeBlog.id}`) ? "currentColor" : "none"} />
                      Like Publication ({blogMetrics[activeBlog.id]?.likes || activeBlog.likes})
                    </button>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Eye size={12} /> {blogMetrics[activeBlog.id]?.views || activeBlog.views} institutional views
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {activeBlog.tags.slice(0, 3).map((tg, k) => (
                      <span key={k} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        #{tg.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Related/AI suggested articles panel layout */}
                <div className="bg-blue-50/20 dark:bg-slate-950/30 border border-blue-500/10 rounded-2xl p-6 md:p-8 text-left space-y-4">
                  <h4 className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb size={15} className="text-blue-500 animate-bounce" /> AI Suggested Publications &amp; Alignment
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Based on your reading session and focus category index, our AI-Curriculum assistant recommends matching other institutional outcomes and peer reviews:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getRelatedPosts(activeBlog).length === 0 ? (
                      <div className="text-xs text-slate-400 font-medium italic">Scanning syllabus outcome matches for other publications...</div>
                    ) : (
                      getRelatedPosts(activeBlog).map((rel) => (
                        <div 
                          key={rel.id}
                          onClick={() => handleReadBlog(rel)}
                          className="p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/20 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                        >
                          <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{rel.title}</h5>
                          <div className="text-[10px] text-slate-400 font-mono mt-3 flex items-center justify-between">
                            <span className="font-semibold uppercase tracking-wider text-slate-400">{rel.category}</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">Read <ArrowRight size={10} /></span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Footer Panel inside Modal */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-end gap-3">
                <button
                  onClick={() => setActiveBlog(null)}
                  className="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Close Reader View
                </button>
              </div>

            </div>
          </div>
        );
      })()}
      {/* ENTERPRISE SALES INQUIRY MODAL */}
      {showEnterpriseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-left">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setShowEnterpriseModal(false);
                setEnterpriseSubmitted(false);
                setEnterpriseForm({ name: '', email: '', institution: '', message: '' });
              }}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer text-xs font-bold"
            >
              <span>Close</span>
              <X size={13} />
            </button>

            {!enterpriseSubmitted ? (
              <form onSubmit={handleEnterpriseSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-md text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <Sparkles size={10} />
                    Enterprise Request
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact Institutional Sales</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                    Unlock anonymous paper valuation, bespoke outcome mappings, and deep LMS integrations configured precisely for your institution.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={enterpriseForm.name}
                      onChange={(e) => setEnterpriseForm({ ...enterpriseForm, name: e.target.value })}
                      placeholder="e.g. Dean Sarah Jenkins"
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Work Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={enterpriseForm.email}
                      onChange={(e) => setEnterpriseForm({ ...enterpriseForm, email: e.target.value })}
                      placeholder="e.g. s.jenkins@university.edu"
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Institution Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={enterpriseForm.institution}
                      onChange={(e) => setEnterpriseForm({ ...enterpriseForm, institution: e.target.value })}
                      placeholder="e.g. Metropolitan Academic Board"
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Customisation Needs & requirements
                    </label>
                    <textarea
                      rows={3}
                      value={enterpriseForm.message}
                      onChange={(e) => setEnterpriseForm({ ...enterpriseForm, message: e.target.value })}
                      placeholder="e.g. We require anonymous student answer book valuations, double-blind grading workflows, and Canvas LMS integration."
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEnterpriseModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition shadow-md shadow-indigo-500/20 cursor-pointer"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-950 dark:text-white">Request Sent Successfully!</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Our institutional onboarding architect will contact you at <strong className="text-slate-700 dark:text-slate-350">{enterpriseForm.email}</strong> shortly.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowEnterpriseModal(false);
                    setEnterpriseSubmitted(false);
                    setEnterpriseForm({ name: '', email: '', institution: '', message: '' });
                  }}
                  className="px-6 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                >
                  Dismiss Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
