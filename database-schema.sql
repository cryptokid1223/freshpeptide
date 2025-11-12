-- FreshPeptide Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Intake table
CREATE TABLE intake (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  intake_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Briefs table (AI-generated educational summaries)
CREATE TABLE briefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  brief_output JSONB NOT NULL,
  model_name TEXT,
  input_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Peptides library table
CREATE TABLE peptides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  regulatory_status TEXT NOT NULL,
  summary TEXT NOT NULL,
  mechanism TEXT,
  evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  common_adverse_effects TEXT,
  contraindications TEXT,
  recommended_dosage TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_intake_user_id ON intake(user_id);
CREATE INDEX idx_briefs_user_id ON briefs(user_id);
CREATE INDEX idx_peptides_slug ON peptides(slug);
CREATE INDEX idx_peptides_name ON peptides(name);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE peptides ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Intake policies
CREATE POLICY "Users can view own intake" ON intake
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own intake" ON intake
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own intake" ON intake
  FOR UPDATE USING (auth.uid() = user_id);

-- Briefs policies
CREATE POLICY "Users can view own briefs" ON briefs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own briefs" ON briefs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Peptides policies (public read)
CREATE POLICY "Anyone can view peptides" ON peptides
  FOR SELECT TO authenticated USING (true);

-- Insert sample peptides data
INSERT INTO peptides (slug, name, regulatory_status, summary, mechanism, evidence, common_adverse_effects, contraindications, recommended_dosage) VALUES
('bpc-157', 'BPC-157', 'Research-only / Compounded', 'Body Protection Compound-157 is a peptide studied for tissue repair and anti-inflammatory properties.', 'Promotes angiogenesis, modulates growth factors, and enhances cellular repair mechanisms', '[{"title": "Gastric Pentadecapeptide BPC 157 - Stable Gastric Pentadecapeptide", "year": 2012, "source": "Current Pharmaceutical Design", "summary": "Review of BPC 157 mechanisms in tissue protection"}]', 'Mild injection site reactions, rare allergic responses', 'Pregnancy, active cancer, uncontrolled bleeding disorders', '250-500 mcg daily, subcutaneous or intramuscular'),
('tb-500', 'TB-500 (Thymosin Beta-4)', 'Research-only', 'A peptide fragment studied for wound healing and tissue regeneration properties.', 'Regulates actin polymerization, promotes cell migration, and enhances tissue repair', '[{"title": "Thymosin Beta4: A Multi-Functional Regenerative Peptide", "year": 2015, "source": "Annals of NY Academy of Sciences", "summary": "Comprehensive review of TB-500 regenerative mechanisms"}]', 'Mild injection site reactions, temporary fatigue', 'Active malignancy, pregnancy', '2-2.5 mg twice weekly for 4-6 weeks, then maintenance'),
('cjc-1295', 'CJC-1295', 'Research-only', 'A growth hormone-releasing hormone analog studied for its potential to increase GH levels.', 'Extends half-life of growth hormone-releasing hormone, stimulating natural GH production', '[{"title": "Modified GRF (1-29) Analog in Aging", "year": 2010, "source": "Journal of Clinical Endocrinology", "summary": "Study on GH-releasing effects"}]', 'Injection site reactions, water retention, tingling sensations', 'Active cancer, diabetic retinopathy, pregnancy', '1-2 mg per week, subcutaneous injection'),
('ipamorelin', 'Ipamorelin', 'Research-only', 'A selective growth hormone secretagogue studied for muscle growth and fat loss.', 'Selective ghrelin receptor agonist promoting pulsatile GH release without affecting cortisol', '[{"title": "Ipamorelin - Novel GH Secretagogue", "year": 2001, "source": "European Journal of Endocrinology", "summary": "Characterization of ipamorelin mechanism"}]', 'Mild injection site reactions, increased hunger, water retention', 'Pregnancy, active malignancy', '200-300 mcg 2-3 times daily, subcutaneous'),
('selank', 'Selank', 'Prescription (Russia) / Research-only (US)', 'A peptide studied for anxiolytic and cognitive enhancement properties.', 'Modulates BDNF and IL-6 expression, affects monoamine neurotransmitters', '[{"title": "Selank: Anxiolytic Peptide", "year": 2009, "source": "Neuroscience and Behavioral Physiology", "summary": "Review of anxiolytic mechanisms"}]', 'Rare: mild irritability, sleep disturbances', 'Pregnancy, severe psychiatric disorders', '250-500 mcg intranasal or subcutaneous, 1-3 times daily'),
('semax', 'Semax', 'Prescription (Russia) / Research-only (US)', 'A peptide studied for neuroprotective and cognitive enhancement effects.', 'Increases BDNF, modulates neurotransmitter systems, enhances neuroplasticity', '[{"title": "Semax in Treatment of Cognitive Disorders", "year": 2013, "source": "Medical News of North Caucasus", "summary": "Clinical applications review"}]', 'Rare: restlessness, mild anxiety', 'Pregnancy, acute psychosis', '300-600 mcg intranasal, 1-2 times daily'),
('ghk-cu', 'GHK-Cu (Copper Peptide)', 'Research-only / Cosmetic use', 'A copper-binding peptide studied for skin regeneration and anti-aging properties.', 'Stimulates collagen and glycosaminoglycan synthesis, promotes wound healing and angiogenesis', '[{"title": "Regenerative and Protective Effects of GHK-Cu", "year": 2018, "source": "Biomedicine & Pharmacotherapy", "summary": "Comprehensive review of regenerative mechanisms"}]', 'Mild skin irritation when applied topically', 'Wilson''s disease, copper sensitivity', '1-3 mg subcutaneous or topical application'),
('melanotan-ii', 'Melanotan II', 'Research-only', 'A synthetic peptide analog studied for pigmentation and other metabolic effects.', 'Melanocortin receptor agonist affecting pigmentation, appetite, and sexual function', '[{"title": "Melanocortin Receptor Agonists", "year": 2014, "source": "Journal of Clinical Investigation", "summary": "Mechanisms of melanocortin signaling"}]', 'Nausea, facial flushing, increased libido, darkening of moles', 'Melanoma history, uncontrolled hypertension, pregnancy', '250-500 mcg 2-3 times weekly, subcutaneous'),
('epithalon', 'Epithalon (Epitalon)', 'Research-only', 'A peptide studied for its potential anti-aging and telomerase-activating properties.', 'Potential telomerase activation, melatonin regulation, antioxidant effects', '[{"title": "Peptide Regulation of Aging", "year": 2003, "source": "Biogerontology", "summary": "Studies on peptide bioregulation"}]', 'Rare: mild fatigue, drowsiness', 'Pregnancy, active malignancy', '5-10 mg for 10-20 days, 1-2 cycles per year'),
('pt-141', 'PT-141 (Bremelanotide)', 'FDA-approved for female sexual dysfunction', 'A melanocortin receptor agonist approved for hypoactive sexual desire disorder.', 'Activates melanocortin receptors in CNS affecting sexual arousal pathways', '[{"title": "Bremelanotide for Hypoactive Sexual Desire Disorder", "year": 2019, "source": "NEJM", "summary": "Phase 3 clinical trial results"}]', 'Nausea, flushing, headache, vomiting', 'Uncontrolled hypertension, cardiovascular disease, pregnancy', '1.75 mg subcutaneous as needed, max once per 24 hours');

