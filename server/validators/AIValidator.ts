import { z } from 'zod';

export const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1)
});

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().optional(),
  jsonMode: z.boolean().optional(),
  stream: z.boolean().optional(),
  provider: z.string().optional(),
  model: z.string().optional()
});

export const VisionRequestSchema = z.object({
  image: z.string(), // Base64 encoded string
  mimeType: z.string().min(5),
  promptText: z.string().optional(),
  provider: z.string().optional()
});

export const OCRRequestSchema = z.object({
  document: z.string(), // Base64 encoded string
  mimeType: z.string().min(5),
  promptText: z.string().optional(),
  provider: z.string().optional()
});

export const FileRequestSchema = z.object({
  file: z.string(), // Base64 encoded string
  mimeType: z.string().min(5),
  promptText: z.string().optional()
});

export const EmbeddingRequestSchema = z.object({
  text: z.string().min(1),
  provider: z.string().optional()
});

export const RecommendationRequestSchema = z.object({
  context: z.string().min(1)
});

export const TranslateRequestSchema = z.object({
  text: z.string().min(1),
  targetLanguage: z.string().min(2)
});

export const SummarizeRequestSchema = z.object({
  text: z.string().min(1)
});
