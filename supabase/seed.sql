-- ==============================================================================
-- KERIS Website - Sample Seed Data (Idempotent & Safe for Re-runs)
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 0. CLEAN TABLE DATA (Like starting a new project)
TRUNCATE public.scholars, public.scholarships, public.committee, public.history_entries, public.news_entries CASCADE;

-- 1. Seed Scholarships
INSERT INTO public.scholarships (
  id, name, status, about, courses_offered, study_duration, country, application_url,
  extra_details, income_group, min_result, logo_url, is_bumiputera, is_anak_negeri
)
VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'Yayasan Khazanah Global Scholarship',
    'open',
    'A prestigious flagship sponsorship supporting outstanding Malaysian students to pursue undergraduate studies at premier universities worldwide, fostering leadership potential.',
    ARRAY['Computer Science', 'Data Science', 'Economics', 'Finance', 'Civil Engineering', 'Mechanical Engineering'],
    '4 - 5 Years (Including Foundation/A-Levels)',
    'United Kingdom, United States, Australia',
    'https://www.yayasankhazanah.com.my',
    'Covers full tuition fees, monthly living stipend, initial travel and return airfare, computer allowance, and dedicated leadership development camps.',
    'Open to all (Merit-based)',
    'Minimum 8A+ in SPM',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80',
    false,
    false
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'Petronas Education Sponsorship Programme (PESP)',
    'open',
    'Petronas offers scholarships to talented young Malaysians with exceptional academic results and leadership abilities to pursue tertiary studies locally and abroad.',
    ARRAY['Chemical Engineering', 'Petroleum Engineering', 'Mechanical Engineering', 'Computer Science', 'Geology', 'Accounting'],
    '4 Years',
    'Malaysia, United States, United Kingdom',
    'https://educationsponsorship.petronas.com.my',
    'Full academic sponsorship with guaranteed career pathway and onboarding development program at PETRONAS upon graduation.',
    'Open to all',
    'Minimum 8A (A/A+) in SPM',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format&fit=crop&q=80',
    false,
    false
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'JPA Program Khas Jepun, Korea, Perancis, Jerman (JKPJ)',
    'soon',
    'Government sponsorship under Jabatan Perkhidmatan Awam (JPA) for top SPM achievers to pursue preparatory and engineering/technical degrees in leading industrial nations.',
    ARRAY['Mechanical Engineering', 'Electrical Engineering', 'Aerospace Engineering', 'Robotics', 'Biotechnology'],
    '5 - 6 Years (Including 2 Years Language Preparatory)',
    'Japan, South Korea, France, Germany',
    'https://esilav2.jpa.gov.my',
    'Includes comprehensive language immersion preparatory program at local pre-u colleges followed by full overseas degree funding.',
    'Open to all (Priority to B40/M40)',
    'Straight As in SPM',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&auto=format&fit=crop&q=80',
    true,
    false
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'Bank Negara Malaysia Kijang Scholarship',
    'closed',
    'Awarded to the nation''s top SPM performers who aspire to pursue university degrees in Economics, Accounting, Finance, Actuarial Science, and Law.',
    ARRAY['Economics', 'Finance', 'Actuarial Science', 'Accounting', 'Law', 'Computer Science'],
    '4 Years',
    'United Kingdom, United States, Australia, Malaysia',
    'https://www.bnm.gov.my/careers/scholarships',
    'Pre-university sponsorship, tuition fees, book and subsistence allowances, plus structured summer internships with the Central Bank of Malaysia.',
    'Merit-based',
    'Minimum 8A+ in SPM',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
    false,
    false
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    'Biasiswa Yayasan Kelantan Darulnaim (YAKIN)',
    'open',
    'Special state sponsorship awarded to anak jati Kelantan pursuing higher education across public and recognized private universities.',
    ARRAY['Medicine', 'Islamic Finance', 'Civil Engineering', 'Information Technology', 'Syariah & Law'],
    '3 - 5 Years',
    'Malaysia',
    'https://yakin.kelantan.gov.my',
    'Specifically designated for students born in Kelantan or having at least one parent born in Kelantan.',
    'B40 and M40',
    'Minimum 6As in SPM',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=80',
    true,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  status = EXCLUDED.status,
  about = EXCLUDED.about,
  courses_offered = EXCLUDED.courses_offered,
  study_duration = EXCLUDED.study_duration,
  country = EXCLUDED.country,
  application_url = EXCLUDED.application_url,
  extra_details = EXCLUDED.extra_details,
  income_group = EXCLUDED.income_group,
  min_result = EXCLUDED.min_result,
  logo_url = EXCLUDED.logo_url,
  is_bumiputera = EXCLUDED.is_bumiputera,
  is_anak_negeri = EXCLUDED.is_anak_negeri;

-- 2. Seed Scholars
INSERT INTO public.scholars (
  id, name, batch, spm_batch, scholarship_id, past_school, current_university,
  course, photo_url, vlog_url, instagram, contact_email, about
)
VALUES
  (
    'b1111111-1111-1111-1111-111111111111',
    'Ahmad Faris bin Zulkifli',
    2022,
    2022,
    'a1111111-1111-1111-1111-111111111111',
    'Maktab Rendah Sains MARA Pengkalan Chepa',
    'Imperial College London',
    'MEng Electrical and Electronic Engineering',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'fariszul_my',
    'faris.zul@imperial.ac.uk',
    'Hailing from Pasir Mas, Faris was active in robotic competitions throughout secondary school. Passionate about semiconductor tech and sustainable energy transition.'
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'Nur Aisyah binti Mohd Radzi',
    2023,
    2023,
    'a2222222-2222-2222-2222-222222222222',
    'SMK Maktab Sultan Ismail (SIC), Kota Bharu',
    'Universiti Teknologi PETRONAS (UTP)',
    'BSc Computer Science (Data Science)',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    null,
    'aisyah_radzi',
    'aisyah.radzi@utp.edu.my',
    'SPM 2023 straight-A+ scorer from Kota Bharu. Enthusiastic about artificial intelligence applications in natural disaster forecasting for East Coast communities.'
  ),
  (
    'b3333333-3333-3333-3333-333333333333',
    'Nik Muhammad Danish bin Nik Ariffin',
    2021,
    2021,
    'a3333333-3333-3333-3333-333333333333',
    'SM Sains Tengku Muhammad Faris Petra',
    'Kyoto University, Japan',
    'BSc Mechanical Engineering',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'nikdanish.jp',
    'danish.ariffin@kyoto-u.ac.jp',
    'Studied Japanese intensive preparatory at Ambang Asuhan Jepun (UM) before moving to Kansai. Actively mentors Kelantanese juniors aspiring to study in East Asia.'
  ),
  (
    'b4444444-4444-4444-4444-444444444444',
    'Siti Sarah binti Khairul Anuar',
    2022,
    2022,
    'a4444444-4444-4444-4444-444444444444',
    'SMK Zainab (1), Kota Bharu',
    'London School of Economics (LSE)',
    'BSc Economics',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    null,
    'sarah.khairul',
    's.k.anuar@lse.ac.uk',
    'Passionate about macroeconomic policy and financial inclusion for small rural entrepreneurs in Kelantan.'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  batch = EXCLUDED.batch,
  spm_batch = EXCLUDED.spm_batch,
  scholarship_id = EXCLUDED.scholarship_id,
  past_school = EXCLUDED.past_school,
  current_university = EXCLUDED.current_university,
  course = EXCLUDED.course,
  photo_url = EXCLUDED.photo_url,
  vlog_url = EXCLUDED.vlog_url,
  instagram = EXCLUDED.instagram,
  contact_email = EXCLUDED.contact_email,
  about = EXCLUDED.about;

-- 3. Seed Committee Members
INSERT INTO public.committee (id, name, role, department, batch_year, is_head, photo_url)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Syed Alif Imran', 'Director of Strategic Initiatives', 'Directors', 2026, false, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80'),
  ('c2222222-2222-2222-2222-222222222222', 'Nik Adam Harris', 'Managing Director', 'Directors', 2026, true, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80'),
  ('c3333333-3333-3333-3333-333333333333', 'Wan Nurul Izzah', 'Director of Operations & Partnerships', 'Directors', 2026, false, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80'),
  ('c4444444-4444-4444-4444-444444444444', 'Muhammad Haziq Imran', 'Head of Secretarial & Finance', 'Secretarial & Finance', 2026, true, 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80'),
  ('c5555555-5555-5555-5555-555555555555', 'Mohd Danial Haikal', 'Head of Programmes & PR', 'Programmes & PR', 2026, true, 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80'),
  ('c6666666-6666-6666-6666-666666666666', 'Siti Maisarah binti Zahari', 'Head of Content & Resources', 'Content & Resources', 2026, true, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80'),
  ('c7777777-7777-7777-7777-777777777777', 'Irfan Syazwan', 'Head of Publicity & Design', 'Publicity & Design', 2026, true, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'),
  ('c8888888-8888-8888-8888-888888888888', 'Amiruddin Asyraf', 'Head of Technical & Web Dev', 'Technical', 2026, true, 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  batch_year = EXCLUDED.batch_year,
  is_head = EXCLUDED.is_head,
  photo_url = EXCLUDED.photo_url;

-- 4. Seed History / Milestones
INSERT INTO public.history_entries (id, year, title, body, image_url)
VALUES
  (
    'd1111111-1111-1111-1111-111111111111',
    2023,
    'KERIS Founded',
    'Initiated by a cohort of passionate Kelantanese scholars abroad with a unified vision to democratize scholarship mentorship for post-SPM students in rural Kelantan.',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'd2222222-2222-2222-2222-222222222222',
    2024,
    'Inaugural SPM Outreach Roadshow',
    'Conducted physical scholarship clinics across 6 secondary schools in Kota Bharu, Machang, and Pasir Mas, impacting over 800 high-achieving candidates.',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'd3333333-3333-3333-3333-333333333333',
    2025,
    'Flagship Mentorship Programme Launch',
    'Officially launched 1-on-1 virtual mentoring matching over 150 SPM scholars with alumni across Ivy League, Oxbridge, Kyoto, and Malaysian research universities.',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'd4444444-4444-4444-4444-444444444444',
    2026,
    'KERIS Digital Ecosystem & Global Scholar Network',
    'Transitioned into a full-scale digital hub offering interactive scholarship directories, essay vetting repositories, and nationwide alumni networking.',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'
  )
ON CONFLICT (id) DO UPDATE SET
  year = EXCLUDED.year,
  title = EXCLUDED.title,
  body = EXCLUDED.body,
  image_url = EXCLUDED.image_url;

-- 5. Seed News & Announcements
INSERT INTO public.news_entries (id, title, body, date, category, image_urls)
VALUES
  (
    'e1111111-1111-1111-1111-111111111111',
    'KERIS Annual SPM 2026 Higher Education Roadshow Kicks Off',
    'KERIS is proud to announce the launch of our flagship outreach roadshow spanning 10 districts across Kelantan. Over 1,200 SPM candidates will receive direct mentorship, university application advice, and essay workshops led by overseas and local scholars.',
    '2026-03-12',
    'Event',
    ARRAY['https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80']
  ),
  (
    'e2222222-2222-2222-2222-222222222222',
    'Masterclass: Cracking JPA & Khazanah Assessment Centers',
    'Join our exclusive webinar with alumni currently studying at Oxford, Cambridge, Imperial, and Kyoto. Gain direct insights into group discussions, behavioral interviews, and personal statements.',
    '2026-02-28',
    'Event',
    ARRAY['https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80']
  ),
  (
    'e3333333-3333-3333-3333-333333333333',
    'KERIS Mentorship Programme (KMP) Batch 4 Applications Open',
    'Our 1-on-1 mentorship program pairs post-SPM students with senior scholars from their exact target course and scholarship. Registration is completely free and open until the end of the month.',
    '2026-02-15',
    'Announcement',
    ARRAY['https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80']
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  body = EXCLUDED.body,
  date = EXCLUDED.date,
  category = EXCLUDED.category,
  image_urls = EXCLUDED.image_urls;
