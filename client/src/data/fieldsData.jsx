export const DOMAINS = [
  // ================================================
  // 1. TECHNOLOGY & ENGINEERING
  // ================================================
  {
    id: 'engineering',
    title: 'Technology & Engineering',
    description: 'The backbone of modern innovation, from software to heavy machinery.',
    color: 'from-blue-600 to-indigo-600',
    sectors: [
      {
        id: 'cs',
        name: 'Computer Science',
        description: 'Software engineering, AI, algorithms, and systems architecture.',
        icon: 'Code2', 
        color: 'from-violet-500 to-fuchsia-500',
        accent: 'text-violet-400',
        categories: ['Full Stack', 'DevOps', 'AI/ML', 'Cybersecurity', 'Blockchain', 'Game Dev']
      },
      {
        id: 'ee',
        name: 'Electrical & Electronics',
        description: 'Power systems, circuitry, and telecommunications.',
        icon: 'Zap',
        color: 'from-amber-400 to-orange-500',
        accent: 'text-amber-400',
        categories: ['Embedded Systems', 'IoT', 'VLSI', 'Power Grid', 'Telecommunications']
      },
      {
        id: 'me',
        name: 'Mechanical Engineering',
        description: 'Robotics, automotive, and thermodynamic systems.',
        icon: 'Settings',
        color: 'from-slate-500 to-zinc-600',
        accent: 'text-slate-400',
        categories: ['Robotics', 'Automotive', 'Aerospace', 'HVAC', 'Mechatronics']
      },
      {
        id: 'chem_eng',
        name: 'Chemical Engineering',
        description: 'Industrial chemical processes and materials science.',
        icon: 'FlaskConical',
        color: 'from-lime-500 to-green-600',
        accent: 'text-lime-400',
        categories: ['Petrochemicals', 'Polymers', 'Process Control', 'Biochemical Eng']
      }
    ]
  },

  // ================================================
  // 2. SCIENCE & RESEARCH
  // ================================================
  {
    id: 'science',
    title: 'Science & Research',
    description: 'Exploring the fundamental laws of nature and the universe.',
    color: 'from-cyan-600 to-blue-600',
    sectors: [
      {
        id: 'physics',
        name: 'Physics & Astronomy',
        description: 'Quantum mechanics, astrophysics, and theoretical physics.',
        icon: 'Atom',
        color: 'from-indigo-400 to-violet-500',
        accent: 'text-indigo-400',
        categories: ['Quantum Computing', 'Astrophysics', 'Nuclear Physics', 'Optics']
      },
      {
        id: 'bio_sci',
        name: 'Biological Sciences',
        description: 'The study of life, genetics, and ecology.',
        icon: 'Dna',
        color: 'from-emerald-400 to-teal-500',
        accent: 'text-emerald-400',
        categories: ['Genetics', 'Marine Biology', 'Zoology', 'Botany', 'Microbiology']
      },
      {
        id: 'env_sci',
        name: 'Environmental Science',
        description: 'Climate change, sustainability, and geology.',
        icon: 'Leaf',
        color: 'from-green-500 to-emerald-700',
        accent: 'text-green-400',
        categories: ['Climate Science', 'Geology', 'Oceanography', 'Meteorology']
      },
      {
        id: 'math',
        name: 'Mathematics & Stats',
        description: 'Data analysis, cryptography, and theoretical math.',
        icon: 'Calculator',
        color: 'from-sky-400 to-blue-500',
        accent: 'text-sky-400',
        categories: ['Data Science', 'Cryptography', 'Actuarial Science', 'Applied Math']
      }
    ]
  },

  // ================================================
  // 3. CONSTRUCTION & INFRASTRUCTURE
  // ================================================
  {
    id: 'infrastructure',
    title: 'Construction & Infrastructure',
    description: 'Building the physical world we live in.',
    color: 'from-stone-600 to-zinc-600',
    sectors: [
      {
        id: 'civil',
        name: 'Civil Engineering',
        description: 'Bridges, roads, dams, and large-scale infrastructure.',
        icon: 'Building2',
        color: 'from-orange-500 to-amber-600',
        accent: 'text-orange-400',
        categories: ['Structural Eng', 'Urban Planning', 'Transportation', 'Geotechnical']
      },
      {
        id: 'arch',
        name: 'Architecture',
        description: 'Designing sustainable and aesthetic buildings.',
        icon: 'Compass',
        color: 'from-stone-400 to-zinc-500',
        accent: 'text-stone-400',
        categories: ['Interior Design', 'Landscape Arch', 'Sustainable Design', 'BIM']
      },
      {
        id: 'mining',
        name: 'Mining & Geology',
        description: 'Resource extraction and geological surveying.',
        icon: 'Pickaxe',
        color: 'from-neutral-600 to-stone-700',
        accent: 'text-neutral-400',
        categories: ['Mineralogy', 'Petroleum Eng', 'Surveying', 'Gemology']
      }
    ]
  },
  // ================================================
  // 4. BUSINESS & FINANCE
  // ================================================
  {
    id: 'business',
    title: 'Business & Finance',
    description: 'Driving economic growth, strategy, and leadership.',
    color: 'from-emerald-600 to-green-700',
    sectors: [
      {
        id: 'finance',
        name: 'Finance & Banking',
        description: 'Managing wealth, investments, and economic systems.',
        icon: 'BadgeDollarSign',
        color: 'from-emerald-400 to-green-500',
        accent: 'text-emerald-400',
        categories: ['Investment Banking', 'Corporate Finance', 'FinTech', 'Accounting', 'Risk Mgmt']
      },
      {
        id: 'marketing',
        name: 'Marketing & Sales',
        description: 'Brand strategy, digital outreach, and consumer psychology.',
        icon: 'Megaphone',
        color: 'from-rose-400 to-pink-500',
        accent: 'text-rose-400',
        categories: ['Digital Marketing', 'SEO/SEM', 'Brand Mgmt', 'Public Relations', 'Sales']
      },
      {
        id: 'entrepreneurship',
        name: 'Entrepreneurship',
        description: 'Building startups and scaling innovation.',
        icon: 'Rocket',
        color: 'from-orange-400 to-red-500',
        accent: 'text-orange-400',
        categories: ['Venture Capital', 'Product Mgmt', 'Lean Startup', 'E-commerce']
      },
      {
        id: 'hr',
        name: 'Human Resources',
        description: 'Talent acquisition, culture, and organizational behavior.',
        icon: 'Users',
        color: 'from-blue-400 to-cyan-500',
        accent: 'text-blue-400',
        categories: ['Recruitment', 'Organizational Psych', 'Labor Relations', 'Training']
      }
    ]
  },

  // ================================================
  // 5. MEDICINE & HEALTHCARE
  // ================================================
  {
    id: 'health',
    title: 'Medicine & Healthcare',
    description: 'Saving lives through clinical practice and medical research.',
    color: 'from-red-600 to-rose-600',
    sectors: [
      {
        id: 'clinical',
        name: 'Clinical Medicine',
        description: 'Diagnosis, surgery, and patient care.',
        icon: 'Stethoscope',
        color: 'from-red-400 to-rose-500',
        accent: 'text-red-400',
        categories: ['Cardiology', 'Surgery', 'Pediatrics', 'Oncology', 'Emergency Med']
      },
      {
        id: 'pharma',
        name: 'Pharmacy & Research',
        description: 'Drug development and pharmaceutical sciences.',
        icon: 'Pill',
        color: 'from-teal-400 to-cyan-500',
        accent: 'text-teal-400',
        categories: ['Pharmacology', 'Biotech', 'Clinical Trials', 'Toxicology']
      },
      {
        id: 'psych',
        name: 'Psychology & Mental Health',
        description: 'Understanding the mind and behavioral therapy.',
        icon: 'Brain',
        color: 'from-pink-400 to-purple-500',
        accent: 'text-pink-400',
        categories: ['Clinical Psych', 'Neuroscience', 'Counseling', 'Cognitive Sci']
      },
      {
        id: 'nursing',
        name: 'Nursing & Allied Health',
        description: 'Critical care, rehabilitation, and therapy.',
        icon: 'HeartPulse',
        color: 'from-rose-300 to-pink-400',
        accent: 'text-rose-300',
        categories: ['Nursing', 'Physical Therapy', 'Occupational Therapy', 'Nutrition']
      }
    ]
  },

  // ================================================
  // 6. LAW, POLICY & GOVERNMENT
  // ================================================
  {
    id: 'law',
    title: 'Law & Government',
    description: 'Upholding justice, creating policy, and international relations.',
    color: 'from-yellow-600 to-orange-700',
    sectors: [
      {
        id: 'legal',
        name: 'Law & Legal Studies',
        description: 'Corporate law, criminal justice, and litigation.',
        icon: 'Scale',
        color: 'from-yellow-500 to-amber-600',
        accent: 'text-yellow-500',
        categories: ['Corporate Law', 'Criminal Justice', 'IP Law', 'International Law']
      },
      {
        id: 'politics',
        name: 'Political Science',
        description: 'Governance, diplomacy, and public administration.',
        icon: 'Landmark',
        color: 'from-blue-500 to-slate-500',
        accent: 'text-blue-400',
        categories: ['International Relations', 'Public Policy', 'Diplomacy', 'Intelligence']
      }
    ]
  },

  // ================================================
  // 7. CREATIVE, MEDIA & ARTS
  // ================================================
  {
    id: 'creative',
    title: 'Creative & Arts',
    description: 'Expression through visual, audio, and digital media.',
    color: 'from-purple-600 to-fuchsia-600',
    sectors: [
      {
        id: 'design',
        name: 'Art & Design',
        description: 'Visual identity, fashion, and UI/UX.',
        icon: 'Palette',
        color: 'from-purple-400 to-indigo-500',
        accent: 'text-purple-400',
        categories: ['Graphic Design', 'UI/UX', 'Fashion Design', 'Illustration']
      },
      {
        id: 'media',
        name: 'Media & Journalism',
        description: 'Broadcasting, content creation, and reporting.',
        icon: 'Mic',
        color: 'from-yellow-400 to-orange-500',
        accent: 'text-yellow-400',
        categories: ['Journalism', 'Film Production', 'Audio Engineering', 'Photography']
      },
      {
        id: 'history',
        name: 'History & Humanities',
        description: 'Philosophy, archaeology, and literature.',
        icon: 'Scroll',
        color: 'from-orange-400 to-red-400',
        accent: 'text-orange-400',
        categories: ['History', 'Philosophy', 'Archaeology', 'Literature', 'Languages']
      }
    ]
  },

  // ================================================
  // 8. AGRICULTURE & ENVIRONMENT
  // ================================================
  {
    id: 'agri',
    title: 'Agriculture & Nature',
    description: 'Feeding the world and managing natural resources.',
    color: 'from-lime-600 to-green-700',
    sectors: [
      {
        id: 'farming',
        name: 'Agriculture & Farming',
        description: 'Crop management, agronomy, and sustainable farming.',
        icon: 'Wheat',
        color: 'from-lime-400 to-green-500',
        accent: 'text-lime-400',
        categories: ['Agronomy', 'Horticulture', 'Agri-Tech', 'Animal Husbandry']
      },
      {
        id: 'forestry',
        name: 'Forestry & Wildlife',
        description: 'Conservation, park management, and ecology.',
        icon: 'Trees',
        color: 'from-emerald-600 to-teal-700',
        accent: 'text-emerald-500',
        categories: ['Forestry', 'Wildlife Conservation', 'Marine Ecology']
      }
    ]
  },

  // ================================================
  // 9. SERVICES & SKILLED TRADES
  // ================================================
  {
    id: 'trades',
    title: 'Services & Trades',
    description: 'Essential hands-on skills and hospitality services.',
    color: 'from-slate-600 to-gray-700',
    sectors: [
      {
        id: 'hospitality',
        name: 'Hospitality & Tourism',
        description: 'Hotel management, culinary arts, and travel.',
        icon: 'Utensils',
        color: 'from-orange-400 to-red-400',
        accent: 'text-orange-400',
        categories: ['Culinary Arts', 'Hotel Mgmt', 'Event Planning', 'Travel & Tourism']
      },
      {
        id: 'aviation',
        name: 'Aviation & Transport',
        description: 'Piloting, air traffic control, and logistics.',
        icon: 'Plane',
        color: 'from-sky-500 to-blue-600',
        accent: 'text-sky-400',
        categories: ['Pilot Training', 'Aviation Mgmt', 'Logistics', 'Maritime']
      },
      {
        id: 'skilled_trades',
        name: 'Skilled Trades',
        description: 'Specialized craftsmanship and technical work.',
        icon: 'Hammer',
        color: 'from-stone-500 to-zinc-600',
        accent: 'text-stone-400',
        categories: ['Electrician', 'Plumbing', 'Carpentry', 'Welding', 'HVAC Tech']
      }
    ]
  }
];

// FLATTENED EXPORT
export const FIELDS = DOMAINS.flatMap(domain => domain.sectors);