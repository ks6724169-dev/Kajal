import { useState, useEffect } from 'react';

export interface DailyAttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'leave' | 'late';
  remarks?: string;
}

export interface PeriodAttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  period: number; // 1 to 8
  subject: string;
  status: 'present' | 'absent' | 'late';
  teacher: string;
}

// Complete mock attendance dates for last week
const generateMockAttendance = (): DailyAttendanceRecord[] => {
  const records: DailyAttendanceRecord[] = [];
  const studentIds = ['s_1', 's_2', 's_3', 's_4', 's_5'];
  const dates = ['2026-07-14', '2026-07-15', '2026-07-16', '2026-07-17', '2026-07-18', '2026-07-19'];
  
  dates.forEach(d => {
    studentIds.forEach(sid => {
      let status: 'present' | 'absent' | 'leave' | 'late' = 'present';
      if (sid === 's_2' && (d === '2026-07-16' || d === '2026-07-18')) {
        status = 'absent';
      } else if (sid === 's_4' && d === '2026-07-15') {
        status = 'leave';
      } else if (sid === 's_5' && d === '2026-07-17') {
        status = 'late';
      }
      records.push({
        id: `att_${d}_${sid}`,
        studentId: sid,
        date: d,
        status,
        remarks: status !== 'present' ? 'Automated status log' : undefined
      });
    });
  });
  return records;
};

const generateMockPeriodAttendance = (): PeriodAttendanceRecord[] => {
  const records: PeriodAttendanceRecord[] = [];
  const studentIds = ['s_1', 's_2', 's_3', 's_4', 's_5'];
  const date = '2026-07-19';
  const subjects = [
    { period: 1, subject: 'Multivariate Calculus', teacher: 'Mrs. Aditi Sen' },
    { period: 2, subject: 'Advanced Physics', teacher: 'Mr. Rakesh Kapoor' },
    { period: 3, subject: 'Artificial Intelligence', teacher: 'Dr. Rajesh Sharma' },
    { period: 4, subject: 'Organic Chemistry', teacher: 'Mrs. Priya Nair' },
    { period: 5, subject: 'Literature & Drama', teacher: 'Ms. Clara D\'Souza' }
  ];

  studentIds.forEach(sid => {
    subjects.forEach(sub => {
      let status: 'present' | 'absent' | 'late' = 'present';
      if (sid === 's_2' && sub.period === 2) {
        status = 'absent'; // skipped physics
      } else if (sid === 's_5' && sub.period === 1) {
        status = 'late';
      }
      records.push({
        id: `patt_${date}_p${sub.period}_${sid}`,
        studentId: sid,
        date,
        period: sub.period,
        subject: sub.subject,
        status,
        teacher: sub.teacher
      });
    });
  });

  return records;
};

export const useAttendanceStore = () => {
  const [dailyRecords, setDailyRecords] = useState<DailyAttendanceRecord[]>(() => {
    const saved = localStorage.getItem('galaxy_attendance_daily');
    return saved ? JSON.parse(saved) : generateMockAttendance();
  });

  const [periodRecords, setPeriodRecords] = useState<PeriodAttendanceRecord[]>(() => {
    const saved = localStorage.getItem('galaxy_attendance_period');
    return saved ? JSON.parse(saved) : generateMockPeriodAttendance();
  });

  useEffect(() => {
    localStorage.setItem('galaxy_attendance_daily', JSON.stringify(dailyRecords));
  }, [dailyRecords]);

  useEffect(() => {
    localStorage.setItem('galaxy_attendance_period', JSON.stringify(periodRecords));
  }, [periodRecords]);

  const markDaily = (studentId: string, date: string, status: 'present' | 'absent' | 'leave' | 'late', remarks?: string) => {
    setDailyRecords(prev => {
      const idx = prev.findIndex(r => r.studentId === studentId && r.date === date);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], status, remarks };
        return copy;
      }
      return [...prev, { id: `att_${Date.now()}_${studentId}`, studentId, date, status, remarks }];
    });
  };

  const markPeriod = (studentId: string, date: string, period: number, subject: string, status: 'present' | 'absent' | 'late', teacher: string) => {
    setPeriodRecords(prev => {
      const idx = prev.findIndex(r => r.studentId === studentId && r.date === date && r.period === period);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], status };
        return copy;
      }
      return [...prev, { id: `patt_${Date.now()}_${studentId}`, studentId, date, period, subject, status, teacher }];
    });
  };

  return {
    dailyRecords,
    periodRecords,
    markDaily,
    markPeriod
  };
};
