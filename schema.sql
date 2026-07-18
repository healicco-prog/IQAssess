-- Create tables for Tools and Development
CREATE TABLE IF NOT EXISTS essay_builder (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    prompt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    user_id UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS mcq_builder (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    question_text TEXT,
    options JSONB,
    correct_option TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    user_id UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS rubric_builder (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    criteria JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    user_id UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS blueprint_builder (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    course TEXT,
    subject TEXT,
    topics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    user_id UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS assessment_builder (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT,
    content JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    user_id UUID REFERENCES auth.users(id)
);

-- Create tables for Assessment Systems
CREATE TABLE IF NOT EXISTS essay_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assessment_id UUID REFERENCES assessment_builder(id),
    student_id UUID REFERENCES auth.users(id),
    submission_text TEXT,
    score JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS reflection_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assessment_id UUID REFERENCES assessment_builder(id),
    student_id UUID REFERENCES auth.users(id),
    reflection_text TEXT,
    score JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS paper_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assessment_id UUID REFERENCES assessment_builder(id),
    student_id UUID REFERENCES auth.users(id),
    submission_file_url TEXT,
    score JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS mcq_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assessment_id UUID REFERENCES assessment_builder(id),
    student_id UUID REFERENCES auth.users(id),
    answers JSONB,
    score_total INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create tables for Analytics & Quality
CREATE TABLE IF NOT EXISTS blueprint_assessors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blueprint_id UUID REFERENCES blueprint_builder(id),
    compliance_score NUMERIC,
    quality_index TEXT,
    analysis_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    user_id UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS item_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID,
    item_type TEXT,
    difficulty_index NUMERIC,
    discrimination_index NUMERIC,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
