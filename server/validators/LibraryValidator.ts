import { z } from 'zod';

export const RegisterBookSchema = z.object({
  title: z.string().min(1),
  isbn: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  subcategoryId: z.string().uuid().optional(),
  authorId: z.string().uuid().optional(),
  publisherId: z.string().uuid().optional(),
  edition: z.string().optional(),
  language: z.string().optional(),
  pages: z.number().positive().optional(),
  price: z.number().positive().optional(),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional()
});

export const RegisterBookCopySchema = z.object({
  bookId: z.string().uuid(),
  barcode: z.string().optional(),
  shelfId: z.string().uuid().optional(),
  condition: z.enum(['GOOD', 'DAMAGED', 'LOST']).optional()
});

export const IssueBookSchema = z.object({
  memberId: z.string().uuid(),
  copyId: z.string().uuid(),
  dueDate: z.string().datetime()
});

export const ReturnBookSchema = z.object({
  issueId: z.string().uuid(),
  conditionOnReturn: z.enum(['GOOD', 'DAMAGED', 'LOST']).optional(),
  fineAmount: z.number().nonnegative().optional()
});

export const ReserveBookSchema = z.object({
  memberId: z.string().uuid(),
  bookId: z.string().uuid(),
  expiryDate: z.string().datetime().optional()
});

export const RecordFineSchema = z.object({
  memberId: z.string().uuid(),
  issueId: z.string().uuid().optional(),
  amount: z.number().positive(),
  reason: z.string().optional()
});

export const UploadDigitalResourceSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  resourceType: z.enum(['EBOOK', 'RESEARCH_PAPER', 'JOURNAL', 'STUDY_MATERIAL', 'PREVIOUS_PAPER', 'QUESTION_BANK', 'VIDEO', 'AUDIO']),
  categoryId: z.string().uuid().optional(),
  authorId: z.string().uuid().optional(),
  fileUrl: z.string().url(),
  fileSize: z.number().positive().optional(),
  publishedDate: z.string().datetime().optional(),
  specificDetails: z.record(z.string(), z.any()).optional() // For Ebook, ResearchPaper, etc. specific fields
});

export const RFIDTagSchema = z.object({
  copyId: z.string().uuid().optional(),
  rfidTag: z.string().min(1)
});

export const QRCodeRegistrySchema = z.object({
  entityType: z.enum(['BOOK', 'COPY', 'MEMBER']),
  entityId: z.string().uuid(),
  qrCodeData: z.string().min(1)
});

export const AIRecommendationSchema = z.object({
  memberId: z.string().uuid()
});

export const SmartSearchSchema = z.object({
  query: z.string().min(1)
});
