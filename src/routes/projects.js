import { Router } from 'express';
import { ProjectRepository } from '../repositories/projectRepository.js';
import { ProjectService } from '../services/projectService.js';
import { ProjectController } from '../controllers/projectController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

const projectRepo = new ProjectRepository();
const projectService = new ProjectService(projectRepo);
const projectController = new ProjectController(projectService);

// Public routes
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);

// Protected routes
router.post('/', authMiddleware, projectController.create);
router.put('/:id', authMiddleware, projectController.update);
router.delete('/:id', authMiddleware, projectController.delete);

export default router;

