import { useState, useEffect } from 'react';

export interface PortfolioProject {
  id: string;
  studentId: string;
  title: string;
  category: string;
  description: string;
  skills: string[];
  link?: string;
  date: string;
  badge?: string;
}

export interface AchievementItem {
  id: string;
  studentId: string;
  title: string;
  authority: string;
  awardLevel: string; // 'National' | 'State' | 'School'
  date: string;
  description: string;
}

export interface ClubInfo {
  id: string;
  name: string;
  mentor: string;
  mentorContact: string;
  description: string;
  meetingTime: string;
  capacity: number;
  membersCount: number;
}

export interface HouseInfo {
  id: string;
  name: string;
  master: string;
  color: string;
  logo: string;
  points: number;
  captain: string;
  description: string;
}

const INITIAL_PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj_1',
    studentId: 's_1',
    title: 'Galaxy Transit Guard (GPS AI Router)',
    category: 'Computer Science',
    description: 'An AI-driven router that automatically estimates the traffic delays on bus routes.',
    skills: ['React', 'TypeScript', 'Tailwind', 'Gemini AI API'],
    link: 'https://github.com/galaxy/transit-guard',
    date: '2026-05-10',
    badge: 'Excellent Innovation'
  },
  {
    id: 'proj_2',
    studentId: 's_1',
    title: 'Calculus derivatives playground',
    category: 'Mathematics',
    description: 'An interactive graph plotter utilizing mathematical modeling libraries.',
    skills: ['D3.js', 'Vite', 'HTML5 Canvas'],
    link: 'https://calculus.apex.edu',
    date: '2026-04-12'
  },
  {
    id: 'proj_3',
    studentId: 's_3',
    title: 'Eco System Sustainability Audit Paper',
    category: 'Environmental Science',
    description: 'Published a school research paper on managing toxic plastic footprint indices in municipal schools.',
    skills: ['Scientific Writing', 'Statistical Analysis', 'Excel'],
    date: '2026-06-01',
    badge: 'Highly Commended'
  }
];

const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach_1',
    studentId: 's_1',
    title: 'Inter-School Hackathon 2026 Champion',
    authority: 'Delhi Science Forum',
    awardLevel: 'State',
    date: '2026-05-15',
    description: 'Bagged Gold medal for constructing the best full-stack emergency response dispatcher app.'
  },
  {
    id: 'ach_2',
    studentId: 's_3',
    title: 'National Youth Parliament Best Speaker',
    authority: 'Ministry of Parliamentary Affairs',
    awardLevel: 'National',
    date: '2026-06-25',
    description: 'Awarded first-class oratorical trophy by the Speaker of Parliament.'
  }
];

const INITIAL_CLUBS: ClubInfo[] = [
  { id: 'c_club_1', name: 'Coding & AI Club', mentor: 'Dr. Rajesh Sharma', mentorContact: 'rajesh.sharma@apex.edu', description: 'Exploring machine learning, web interfaces, and modern programming.', meetingTime: 'Tuesdays 3:30 PM', capacity: 30, membersCount: 22 },
  { id: 'c_club_2', name: 'Robotics Society', mentor: 'Mr. Rakesh Kapoor', mentorContact: 'rakesh.kapoor@apex.edu', description: 'Assembling Arduino boards, IoT sensors, and motion mechanisms.', meetingTime: 'Thursdays 3:30 PM', capacity: 25, membersCount: 18 },
  { id: 'c_club_3', name: 'Debate & Oratory', mentor: 'Mr. Alok Tripathi', mentorContact: 'alok.tripathi@apex.edu', description: 'Fostering public speaking, speech logic, and active political rhetoric.', meetingTime: 'Mondays 4:00 PM', capacity: 20, membersCount: 15 },
  { id: 'c_club_4', name: 'Drama & Arts', mentor: 'Ms. Clara D\'Souza', mentorContact: 'clara.dsouza@apex.edu', description: 'Theatre productions, visual arts design, staging, and acting workshops.', meetingTime: 'Fridays 3:00 PM', capacity: 40, membersCount: 32 },
  { id: 'c_club_5', name: 'Eco Warriors', mentor: 'Mrs. Priya Nair', mentorContact: 'priya.nair@apex.edu', description: 'Leading active waste minimization audits, energy safety, and plantations.', meetingTime: 'Wednesdays 3:30 PM', capacity: 35, membersCount: 21 }
];

const INITIAL_HOUSES: HouseInfo[] = [
  { id: 'h_1', name: 'Gold Phoenixes', master: 'Mrs. Aditi Sen', color: 'amber', logo: '🔥', points: 420, captain: 'Aarav Sharma', description: 'Rising through academic merit, technological brilliance, and discipline.' },
  { id: 'h_2', name: 'Red Gryphons', master: 'Mr. Alok Tripathi', color: 'rose', logo: '🦁', points: 380, captain: 'Priya Iyer', description: 'Valiant in debates, public relations, sportsmanship, and artistic performance.' },
  { id: 'h_3', name: 'Blue Krakens', master: 'Mr. Rakesh Kapoor', color: 'blue', logo: '🐙', points: 310, captain: 'Karan Malhotra', description: 'Powering through swimming, mathematics, scientific research, and innovation.' },
  { id: 'h_4', name: 'Green Hydras', master: 'Mrs. Priya Nair', color: 'emerald', logo: '🐍', points: 340, captain: 'Sneha Goel', description: 'Leading environmental audits, physical agility, resilience, and community work.' }
];

export const usePortfolioStore = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>(() => {
    const saved = localStorage.getItem('galaxy_portfolio_projects');
    return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO_PROJECTS;
  });

  const [achievements, setAchievements] = useState<AchievementItem[]>(() => {
    const saved = localStorage.getItem('galaxy_portfolio_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [clubs, setClubs] = useState<ClubInfo[]>(() => {
    const saved = localStorage.getItem('galaxy_clubs_list');
    return saved ? JSON.parse(saved) : INITIAL_CLUBS;
  });

  const [houses, setHouses] = useState<HouseInfo[]>(() => {
    const saved = localStorage.getItem('galaxy_houses_list');
    return saved ? JSON.parse(saved) : INITIAL_HOUSES;
  });

  useEffect(() => {
    localStorage.setItem('galaxy_portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('galaxy_portfolio_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('galaxy_clubs_list', JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem('galaxy_houses_list', JSON.stringify(houses));
  }, [houses]);

  const addProject = (proj: Omit<PortfolioProject, 'id' | 'date'>) => {
    const newProj: PortfolioProject = {
      ...proj,
      id: `proj_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [newProj, ...prev]);
  };

  const addAchievement = (ach: Omit<AchievementItem, 'id' | 'date'>) => {
    const newAch: AchievementItem = {
      ...ach,
      id: `ach_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setAchievements(prev => [newAch, ...prev]);
  };

  const incrementHousePoints = (houseName: string, pts: number) => {
    setHouses(prev => prev.map(h => h.name === houseName ? { ...h, points: h.points + pts } : h));
  };

  return {
    projects,
    achievements,
    clubs,
    houses,
    addProject,
    addAchievement,
    incrementHousePoints
  };
};
