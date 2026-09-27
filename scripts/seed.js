import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 1. Parse .env file manually
const envPath = path.resolve(__dirname, '../.env')
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found at', envPath)
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const [k, ...v] = trimmed.split('=')
  env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '')
}

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🌱 Connected to Supabase at:', supabaseUrl)

async function seed() {
  // -------------------------------------------------------------
  // 1. SEED SCHOLARSHIPS
  // -------------------------------------------------------------
  console.log('⏳ Seeding Scholarships...')
  const scholarshipsData = [
    {
      name: 'Yayasan Khazanah Global Scholarship',
      status: 'Open',
      about: 'A prestigious flagship sponsorship supporting outstanding Malaysian students to pursue undergraduate studies at premier universities worldwide, fostering leadership potential.',
      courses_offered: ['Computer Science', 'Data Science', 'Economics', 'Finance', 'Civil Engineering', 'Mechanical Engineering'],
      study_duration: '4 - 5 Years (Including Foundation/A-Levels)',
      country: 'United Kingdom, United States, Australia',
      application_url: 'https://www.yayasankhazanah.com.my',
      extra_details: 'Covers full tuition fees, monthly living stipend, initial travel and return airfare, computer allowance, and dedicated leadership development camps.',
      income_group: 'Open to all (Merit-based)',
      min_result: 'Minimum 8A+ in SPM',
      logo_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Petronas Education Sponsorship Programme (PESP)',
      status: 'Open',
      about: 'Petronas offers scholarships to talented young Malaysians with exceptional academic results and leadership abilities to pursue tertiary studies locally and abroad.',
      courses_offered: ['Chemical Engineering', 'Petroleum Engineering', 'Mechanical Engineering', 'Computer Science', 'Geology', 'Accounting'],
      study_duration: '4 Years',
      country: 'Malaysia, United States, United Kingdom',
      application_url: 'https://educationsponsorship.petronas.com.my',
      extra_details: 'Full academic sponsorship with guaranteed career pathway and onboarding development program at PETRONAS upon graduation.',
      income_group: 'Open to all',
      min_result: 'Minimum 8A (A/A+) in SPM',
      logo_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'JPA Program Khas Jepun, Korea, Perancis, Jerman (JKPJ)',
      status: 'Upcoming',
      about: 'Government sponsorship under Jabatan Perkhidmatan Awam (JPA) for top SPM achievers to pursue preparatory and engineering/technical degrees in leading industrial nations.',
      courses_offered: ['Mechanical Engineering', 'Electrical Engineering', 'Aerospace Engineering', 'Robotics', 'Biotechnology'],
      study_duration: '5 - 6 Years (Including 2 Years Language Preparatory)',
      country: 'Japan, South Korea, France, Germany',
      application_url: 'https://esilav2.jpa.gov.my',
      extra_details: 'Includes comprehensive language immersion preparatory program at local pre-u colleges followed by full overseas degree funding.',
      income_group: 'Open to all (Priority to B40/M40)',
      min_result: 'Straight As in SPM',
      logo_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Bank Negara Malaysia Kijang Scholarship',
      status: 'Closed',
      about: 'Awarded to the nation\'s top SPM performers who aspire to pursue university degrees in Economics, Accounting, Finance, Actuarial Science, and Law.',
      courses_offered: ['Economics', 'Finance', 'Actuarial Science', 'Accounting', 'Law', 'Computer Science'],
      study_duration: '4 Years',
      country: 'United Kingdom, United States, Australia, Malaysia',
      application_url: 'https://www.bnm.gov.my/careers/scholarships',
      extra_details: 'Pre-university sponsorship, tuition fees, book and subsistence allowances, plus structured summer internships with the Central Bank of Malaysia.',
      income_group: 'Merit-based',
      min_result: 'Minimum 8A+ in SPM',
      logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Yayasan Sime Darby Undergraduate Scholarship',
      status: 'Upcoming',
      about: 'Supporting bright and deserving individuals with high academic standing and strong extracurricular records to pursue undergraduate degrees locally and internationally.',
      courses_offered: ['Agriculture', 'Civil Engineering', 'Human Resource Management', 'Marketing', 'Data Science'],
      study_duration: '3 - 4 Years',
      country: 'Malaysia, United Kingdom',
      application_url: 'https://www.yayasansimedarby.com',
      extra_details: 'Tuition fees, living expenses, book allowances, medical insurance, and priority consideration for internship opportunities within Sime Darby companies.',
      income_group: 'Priority to households with combined monthly income < RM11,000',
      min_result: 'Minimum 7As in SPM',
      logo_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'MARA Young Talent Programme (YTP)',
      status: 'Open',
      about: 'Flagship convertible loan scheme for high-achieving Bumiputera SPM students to pursue preparatory studies leading to bachelor degrees in world-class institutions.',
      courses_offered: ['Medicine', 'Dentistry', 'Pharmacy', 'Architecture', 'Computer Science', 'Aviation'],
      study_duration: '4 - 5 Years',
      country: 'Malaysia, United Kingdom, Australia, New Zealand',
      application_url: 'https://www.mara.gov.my',
      extra_details: 'Convertible study loan with generous waiver terms based on final academic honors classification.',
      income_group: 'Bumiputera students (B40/M40 priority)',
      min_result: 'Minimum 7A- and above in SPM',
      logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80',
    },
  ]

  const { data: insertedScholarships, error: errScholarships } = await supabase
    .from('scholarships')
    .insert(scholarshipsData)
    .select('id, name')

  if (errScholarships) {
    console.error('❌ Error inserting scholarships:', errScholarships.message)
    return
  }
  console.log(`✅ Inserted ${insertedScholarships.length} scholarships.`)

  const sMap = {}
  insertedScholarships.forEach(s => { sMap[s.name] = s.id })

  // -------------------------------------------------------------
  // 2. SEED SCHOLARS
  // -------------------------------------------------------------
  console.log('⏳ Seeding Scholars...')
  const scholarsData = [
    {
      name: 'Ahmad Faris bin Zulkifli',
      spm_batch: 2022,
      scholarship_id: sMap['Yayasan Khazanah Global Scholarship'],
      past_school: 'Maktab Rendah Sains MARA Pengkalan Chepa',
      current_university: 'Imperial College London',
      course: 'MEng Electrical and Electronic Engineering',
      photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
      instagram: 'fariszul_my',
      contact_email: 'faris.zul@imperial.ac.uk',
      about: 'Hailing from Pasir Mas, Faris was active in robotic competitions throughout secondary school. Passionate about semiconductor tech and sustainable energy transition.',
    },
    {
      name: 'Nur Aisyah binti Mohd Radzi',
      spm_batch: 2023,
      scholarship_id: sMap['Petronas Education Sponsorship Programme (PESP)'],
      past_school: 'SMK Maktab Sultan Ismail (SIC), Kota Bharu',
      current_university: 'Universiti Teknologi PETRONAS (UTP)',
      course: 'BSc Computer Science (Data Science)',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      instagram: 'aisyah_radzi',
      contact_email: 'aisyah.radzi@utp.edu.my',
      about: 'SPM 2023 straight-A+ scorer from Kota Bharu. Enthusiastic about artificial intelligence applications in natural disaster forecasting for East Coast communities.',
    },
    {
      name: 'Nik Muhammad Danish bin Nik Ariffin',
      spm_batch: 2021,
      scholarship_id: sMap['JPA Program Khas Jepun, Korea, Perancis, Jerman (JKPJ)'],
      past_school: 'SM Sains Tengku Muhammad Faris Petra',
      current_university: 'Kyoto University, Japan',
      course: 'BSc Mechanical Engineering',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      instagram: 'nikdanish.jp',
      contact_email: 'danish.ariffin@kyoto-u.ac.jp',
      about: 'Studied Japanese intensive preparatory at Ambang Asuhan Jepun (UM) before moving to Kansai. Actively mentors Kelantanese juniors aspiring to study in East Asia.',
    },
    {
      name: 'Siti Sarah binti Khairul Anuar',
      spm_batch: 2022,
      scholarship_id: sMap['Bank Negara Malaysia Kijang Scholarship'],
      past_school: 'SMK Zainab (1), Kota Bharu',
      current_university: 'London School of Economics (LSE)',
      course: 'BSc Economics',
      photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
      instagram: 'sarah.khairul',
      contact_email: 's.k.anuar@lse.ac.uk',
      about: 'Passionate about macroeconomic policy and financial inclusion for small rural entrepreneurs in Kelantan. Completed Cambridge A-Levels at Kolej Tuanku Ja\'afar.',
    },
    {
      name: 'Muhammad Amirul Hakim bin Roslan',
      spm_batch: 2023,
      scholarship_id: sMap['MARA Young Talent Programme (YTP)'],
      past_school: 'MRSM Tumpat',
      current_university: 'Universiti Malaya (UM)',
      course: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)',
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      instagram: 'amirul_hakim99',
      contact_email: 'amirul.roslan@um.edu.my',
      about: 'Aspiring pediatric specialist from Tumpat. Strong advocate for peer-tutoring initiatives and volunteer medical relief in flood-affected regions.',
    },
    {
      name: 'Wan Dania Batrisyia binti Wan Azman',
      spm_batch: 2021,
      scholarship_id: sMap['Yayasan Sime Darby Undergraduate Scholarship'],
      past_school: 'SMK Kubang Kerian 1',
      current_university: 'University of Bristol, UK',
      course: 'MEng Civil Engineering',
      photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
      instagram: 'dania.azman',
      contact_email: 'dania.azman@bristol.ac.uk',
      about: 'Focusing on flood mitigation infrastructure and smart urban water systems. President of the Bristol Malaysian Cultural Society 2024/2025.',
    },
  ]

  const { error: errScholars } = await supabase.from('scholars').insert(scholarsData)
  if (errScholars) {
    console.error('❌ Error inserting scholars:', errScholars.message)
  } else {
    console.log(`✅ Inserted ${scholarsData.length} scholars.`)
  }

  // -------------------------------------------------------------
  // 3. SEED COMMITTEE MEMBERS
  // -------------------------------------------------------------
  console.log('⏳ Seeding Committee Members...')
  const committeeData = [
    // 3 Directors (with Managing Director in middle for perfect landing page hero display)
    {
      name: 'Syed Alif Imran',
      role: 'Director of Strategic Initiatives',
      department: 'Directors',
      is_head: false,
      photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Nik Adam Harris',
      role: 'Managing Director',
      department: 'Directors',
      is_head: true,
      photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Wan Nurul Izzah',
      role: 'Director of Operations & Partnerships',
      department: 'Directors',
      is_head: false,
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    },

    // Secretarial & Finance
    {
      name: 'Muhammad Haziq Imran',
      role: 'Head of Secretarial & Finance',
      department: 'Secretarial & Finance',
      is_head: true,
      photo_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Fatin Nabilah binti Che Rani',
      role: 'Finance Associate',
      department: 'Secretarial & Finance',
      is_head: false,
      photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
    },

    // Programmes & PR
    {
      name: 'Mohd Danial Haikal',
      role: 'Head of Programmes & PR',
      department: 'Programmes & PR',
      is_head: true,
      photo_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Nur Aina Safiya',
      role: 'PR & Outreach Officer',
      department: 'Programmes & PR',
      is_head: false,
      photo_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&auto=format&fit=crop&q=80',
    },

    // Content & Resources
    {
      name: 'Siti Maisarah binti Zahari',
      role: 'Head of Content & Resources',
      department: 'Content & Resources',
      is_head: true,
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Luqman Hakim bin Azhar',
      role: 'Editorial Lead',
      department: 'Content & Resources',
      is_head: false,
      photo_url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80',
    },

    // Publicity & Design
    {
      name: 'Irfan Syazwan',
      role: 'Head of Publicity & Design',
      department: 'Publicity & Design',
      is_head: true,
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Anis Nadirah',
      role: 'Creative Designer',
      department: 'Publicity & Design',
      is_head: false,
      photo_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
    },

    // Technical
    {
      name: 'Amiruddin Asyraf',
      role: 'Head of Technical & Web Dev',
      department: 'Technical',
      is_head: true,
      photo_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Farhan Naufal',
      role: 'Systems & Cloud Engineer',
      department: 'Technical',
      is_head: false,
      photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    },
  ]

  const { error: errCommittee } = await supabase.from('committee').insert(committeeData)
  if (errCommittee) {
    console.error('❌ Error inserting committee:', errCommittee.message)
  } else {
    console.log(`✅ Inserted ${committeeData.length} committee members.`)
  }

  // -------------------------------------------------------------
  // 4. SEED NEWS & ANNOUNCEMENTS
  // -------------------------------------------------------------
  console.log('⏳ Seeding News & Events...')
  const newsData = [
    {
      title: 'KERIS Annual SPM 2026 Higher Education Roadshow Kicks Off',
      body: 'KERIS is proud to announce the launch of our flagship outreach roadshow spanning 10 districts across Kelantan. Over 1,200 SPM candidates will receive direct mentorship, university application advice, and essay workshops led by overseas and local scholars.',
      date: '2026-03-12',
      category: 'Event',
      image_urls: [
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Masterclass: Cracking JPA & Khazanah Assessment Centers',
      body: 'Join our exclusive webinar with alumni currently studying at Oxford, Cambridge, Imperial, and Kyoto. Gain direct insights into group discussions, behavioral interviews, and personal statements.',
      date: '2026-02-28',
      category: 'Workshop',
      image_urls: [
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'KERIS Mentorship Programme (KMP) Batch 4 Applications Open',
      body: 'Our 1-on-1 mentorship program pairs post-SPM students with senior scholars from their exact target course and scholarship. Registration is completely free and open until the end of the month.',
      date: '2026-02-15',
      category: 'Announcement',
      image_urls: [
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Community Impact Report 2025: Over 85 Scholars Placed Worldwide',
      body: 'Reflecting on our milestones: KERIS assisted over 3,000 Kelantanese students in 2025 through roadshows, digital webinars, and personal statement clinics, securing over RM 18M in total scholarships.',
      date: '2026-01-20',
      category: 'Event',
      image_urls: [
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
      ],
    },
  ]

  const { error: errNews } = await supabase.from('news_entries').insert(newsData)
  if (errNews) {
    console.error('❌ Error inserting news entries:', errNews.message)
  } else {
    console.log(`✅ Inserted ${newsData.length} news articles.`)
  }

  console.log('\n✨ Database seeding complete! Refresh your app to see the live data.')
}

seed().catch(err => {
  console.error('❌ Unexpected seed error:', err)
  process.exit(1)
})
