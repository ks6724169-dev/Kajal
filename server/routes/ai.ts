import { Router } from 'express';
import { aiController } from '../controllers/AIController.js';

const router = Router();

// Metadata & registries
router.get('/providers', aiController.getProviders.bind(aiController));
router.get('/models', aiController.getModels.bind(aiController));

// Core intelligence endpoints
router.post('/chat', aiController.chat.bind(aiController));
router.post('/vision', aiController.analyzeImage.bind(aiController));
router.post('/ocr', aiController.analyzeDocument.bind(aiController));
router.post('/summarize', aiController.summarize.bind(aiController));
router.post('/translate', aiController.translate.bind(aiController));
router.post('/embeddings', aiController.embed.bind(aiController));
router.post('/recommendation', aiController.recommendation.bind(aiController));

// Auditing, Usage and Health
router.get('/usage', aiController.getUsage.bind(aiController));
router.get('/cost', aiController.getCost.bind(aiController));
router.get('/health', aiController.getHealth.bind(aiController));

export default router;
