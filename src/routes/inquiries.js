import { Router } from 'express';
import { InquiryRepository } from '../repositories/inquiryRepository.js';
import { InquiryService } from '../services/inquiryService.js';
import { InquiryController } from '../controllers/inquiryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

const repo = new InquiryRepository();
const service = new InquiryService(repo);
const controller = new InquiryController(service);

// Public route to submit inquiry
router.post('/', controller.create);

// Protected routes to manage inquiries
router.get('/', authMiddleware, controller.getAll);
router.patch('/:id/read', authMiddleware, controller.markAsRead);
router.delete('/:id', authMiddleware, controller.delete);

export default router;
