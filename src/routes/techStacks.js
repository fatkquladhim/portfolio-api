import { Router } from 'express';
import { TechStackRepository } from '../repositories/techStackRepository.js';
import { TechStackService } from '../services/techStackService.js';
import { TechStackController } from '../controllers/techStackController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

const repo = new TechStackRepository();
const service = new TechStackService(repo);
const controller = new TechStackController(service);

router.get('/', controller.getAll);
router.post('/', authMiddleware, controller.create);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.delete);

export default router;
