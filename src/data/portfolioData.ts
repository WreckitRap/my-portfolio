export interface Profile {
  name: string;
  title: string;
  location: string;
  focus: string;
  currentlyLearning: string;
  openTo: string;
  email: string;
  phone?: string;
  linkedin: string;
  github?: string;
}

export interface Project {
  icon: string;
  name: string;
  role: string;
  year: string;
  impact: string;
  description: string;
  link?: string;
}

export interface ResumeExperience {
  role: string;
  company: string;
  period: string;
  detail: string;
}

export const profile: Profile = {
  name: 'Ralph D. Tungcul',
  title: 'Software Engineer | Full Stack Web Developer',
  location: 'Quezon City, Philippines',
  focus: 'VILT and MERN full-stack web applications',
  currentlyLearning: 'building scalable full-stack products',
  openTo: 'new opportunities',
  email: 'tungculralph15@gmail.com',
  phone: '+63 919 009 1515',
  linkedin: 'https://www.linkedin.com/in/ralph-tungcul-07907526b/',
  github: 'https://github.com/WreckitRap',
};

export const aboutText: string[] = [
  "Hi! I'm Ralph — a Software Engineer and Full Stack Web Developer based in Quezon City, Philippines.",
  'I build end-to-end web applications using the VILT stack: Vue.js, Inertia.js, Laravel, and Tailwind CSS. I also work with the MERN stack: MongoDB, Express.js, React.js, and Node.js, along with MySQL.',
  'I enjoy creating dynamic user interfaces, optimizing backend services, and making sure the frontend and backend communicate smoothly.',
  'Before moving fully into software engineering, I handled project supervision and project control work, so I also care about delivery, communication, and practical business results — not just code.',
];

export const projects: Project[] = [
  {
    icon: '🏥',
    name: 'NURSE_SCHEDULER',
    role: 'Full Stack Developer',
    year: '2026',
    impact: 'Laravel 12 · React · Inertia.js · Tailwind · MySQL',
    description:
      'Full-stack hospital scheduling system for nursing teams. Admins build conflict-free weekly schedules digitally, nurses request time off, and coverage gaps are detected automatically. Built to help hospital admins schedule from home instead of staying extra hours.',
    link: 'https://nurse.ralphtungcul.dev/login',
  },
  {
    icon: '🧩',
    name: 'VILT_CLIENT_APPS',
    role: 'Software Engineer',
    year: '2023–Present',
    impact: 'PHP · VILT · MySQL',
    description:
      'Developing efficient and scalable client web applications using PHP, Vue.js, Inertia.js, Laravel, Tailwind CSS, and MySQL.',
  },
  {
    icon: '📡',
    name: 'PROJECT_DELIVERY_SUPERVISION',
    role: 'Project Supervisor',
    year: '2020–2022',
    impact: 'Team delivery',
    description:
      'Oversaw project deliverables, monitored team progress, provided regular status updates, and coordinated with stakeholders to keep projects moving efficiently.',
  },
  {
    icon: '🏗️',
    name: 'PROJECT_CONTROL_OPS',
    role: 'Project Control Manager',
    year: '2019–2020',
    impact: 'Quality + resources',
    description:
      'Formulated tactics for high-quality project results and optimized resource utilization across project operations.',
  },
  {
    icon: '🎓',
    name: 'MERN_CAPSTONE',
    role: 'Full Stack Trainee',
    year: '2023',
    impact: 'Product Inventory',
    description: 'Full stack MERN capstone — Product Inventory system.',
    link: 'https://tungcul-ralph-fullstack-s65-s71.vercel.app/',
  },
];

export const skills: Record<string, string[]> = {
  'VILT Stack': ['Vue.js', 'Inertia.js', 'Laravel', 'Tailwind CSS'],
  'MERN Stack': ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
  Core: [
    'HTML',
    'CSS',
    'JavaScript',
    'PHP',
    'React Native',
    'MySQL',
  ],
};

export const resume = {
  name: profile.name,
  title: profile.title,
  email: profile.email,
  phone: profile.phone ?? '',
  linkedin: profile.linkedin,
  github: profile.github ?? '',
  summary:
    'Full stack web developer with hands-on experience across the VILT stack and MERN stack, plus MySQL. Skilled in building dynamic user interfaces, optimizing backend services, and ensuring seamless integration between client and server.',
  experience: [
    {
      role: 'Software Engineer',
      company: 'Tensei Philippines Inc.',
      period: 'August 2023 – Present',
      detail:
        'Develops web applications using PHP, the VILT stack (Vue.js, Inertia.js, Laravel, Tailwind CSS), and MySQL to deliver efficient, scalable solutions for clients.',
    },
    {
      role: 'Project Supervisor',
      company: 'Wuhan Fiberhome International Technologies',
      period: 'September 2020 – April 2022',
      detail:
        'Ensured prompt and efficient delivery of project deliverables while overseeing team progress and coordinating with stakeholders.',
    },
    {
      role: 'Project Control Manager',
      company: 'JEZKA Construction Corporation',
      period: 'April 2019 – September 2020',
      detail:
        'Formulated effective tactics to attain high-quality project results and optimized resource utilization across project operations.',
    },
  ] satisfies ResumeExperience[],
  education:
    'B.S. Electronics Communication Engineering — University of Saint Louis Tuguegarao, Tuguegarao City, Cagayan, 2010–2016',
  certifications: [
    'Zuitt Web Developer Program — Full Stack Web Development (MERN Stack), Completer, June–August 2023',
    'Basic Android Development Training, DICT Region 02, October 2022',
  ],
  stack: [
    'Vue.js',
    'Inertia.js',
    'Laravel',
    'Tailwind CSS',
    'React.js',
    'React Native',
    'Node.js',
    'Express.js',
    'PHP',
    'MySQL',
    'MongoDB',
  ],
};