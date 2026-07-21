import { aiGateway } from '../ai/AIGateway';
import { QuestionBank } from '../entities/AssessmentDomain';

export class AIQuestionGenerator {
  constructor(private tenantId: string) {}

  async generateQuestions(
    subject: string, 
    topic: string, 
    count: number, 
    difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD'
  ): Promise<Partial<QuestionBank>[]> {
    const prompt = `Generate ${count} ${difficulty} level questions for ${subject} - ${topic}.`;
    const schema = `[{ "content": "string", "options": ["string"], "correct_answer": "string", "explanation": "string", "bloom_taxonomy": "REMEMBER|UNDERSTAND|APPLY|ANALYZE|EVALUATE|CREATE" }]`;
    
    const generated = await aiGateway.generateJSON<any[]>(this.tenantId, prompt, schema);
    
    return generated.map((q: any) => ({
      ...q,
      subject_id: subject,
      topic_id: topic,
      difficulty_level: difficulty,
      ai_generated: true,
      question_type: q.options ? 'MCQ' : 'SUBJECTIVE',
      quality_score: this.predictQuality(q)
    }));
  }

  private predictQuality(question: any): number {
    if (question.explanation && question.explanation.length > 50) return 90;
    return 75;
  }

  async detectDuplicates(newQuestion: string, existingQuestions: string[]): Promise<boolean> {
    const prompt = `Are these questions semantically identical? Q1: ${newQuestion}, Existing: ${existingQuestions.join(' | ')}`;
    const response = await aiGateway.chat(this.tenantId, [
      { role: 'user', content: prompt }
    ]);
    return response.text.toLowerCase().includes('yes');
  }

  async mapLearningOutcome(question: string): Promise<string[]> {
    const prompt = `What are the learning outcomes for this question: ${question}`;
    const response = await aiGateway.chat(this.tenantId, [
      { role: 'user', content: prompt }
    ]);
    return response.text.split(',').map(s => s.trim());
  }
}

