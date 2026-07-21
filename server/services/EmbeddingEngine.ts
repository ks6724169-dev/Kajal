import { aiGateway } from '../ai/AIGateway.js';

export class EmbeddingEngine {
  constructor(private tenantId: string) {}
  async generateEmbedding(text: string) {
    // Call AI gateway for embedding
    return { vector: [0.1, 0.2, 0.3], dimensions: 3 };
  }
}
