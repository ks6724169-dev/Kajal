import { api } from './httpClient';

type AiTextResponse = {
  reply?: string;
  result?: string;
};

export const aiService = {
  chat: (payload: { prompt: string; persona?: string; context?: string }) => api.post<AiTextResponse>('/ai/chat', payload),
  lessonPlan: (payload: { subject: string; grade: string; topic: string }) => api.post<AiTextResponse>('/ai/lesson-plan', payload),
  timetable: (payload: { institutionName: string; classes: unknown[]; teachers: unknown[]; workingDays?: number }) => api.post<AiTextResponse>('/ai/timetable', payload),
  questionPaper: (payload: { subject: string; grade: string; difficulty: string; totalMarks: number; topics: string }) => api.post<AiTextResponse>('/ai/question-paper', payload),
  reportCard: (payload: { studentName: string; grades: unknown; attendance: number; behaviorNotes: string }) => api.post<AiTextResponse>('/ai/report-card', payload)
};
