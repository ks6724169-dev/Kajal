import { ExtendedStudent } from '../stores/studentStore';
import { PromotionService } from '../services/PromotionService';

export const usePromotion = (student: ExtendedStudent | null) => {
  if (!student) {
    return {
      status: 'under-review' as const,
      reasons: ['No active student loaded.'],
      gpaScore: 0,
      attendanceScore: 0,
      behaviorScore: 0
    };
  }
  return PromotionService.evaluatePromotion(student);
};
