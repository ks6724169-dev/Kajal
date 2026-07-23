import { Tenant } from '../types';

export const TENANTS: Tenant[] = [
  { id: 'apex_k12', name: 'Apex International K-12', schoolCode: 'apex12', type: 'school', city: 'Delhi', state: 'Delhi', academicYear: '2026-2027', themeColor: '#4f46e5', logo: '🎓' },
  { id: 'galaxy_tech', name: 'Galaxy Institute of Technology', schoolCode: 'galaxy', type: 'college', city: 'Mumbai', state: 'Maharashtra', academicYear: '2026-2027', themeColor: '#7c3aed', logo: '🚀' },
  { id: 'st_xaviers', name: 'St. Xavier Public Academy', schoolCode: 'stx', type: 'school', city: 'Bangalore', state: 'Karnataka', academicYear: '2026-2027', themeColor: '#2563eb', logo: '🏛️' }
];

export const MOCK_NOTIFICATIONS = [];
export const MOCK_USER_ACTIVITY = [];
export const INITIAL_EXAMS = [];
export const INITIAL_FEES = [];
export const INITIAL_TEACHERS = [];
export const INITIAL_BOOKS = [];
export const INITIAL_BUSES = [];
