import { Router } from 'express';
import { CategoryRepository } from '../repositories/categoryRepository.js';
import { CategoryService } from '../services/categoryService.js';
import { CategoryController } from '../controllers/categoryController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

const categoryRepo = new CategoryRepository();
const categoryService = new CategoryService(categoryRepo);
const categoryController = new CategoryController(categoryService);

router.get('/', categoryController.getAll);
router.post('/', authMiddleware, categoryController.create);
router.put('/:id', authMiddleware, categoryController.update);
router.delete('/:id', authMiddleware, categoryController.delete);

export default router;
