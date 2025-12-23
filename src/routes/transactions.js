import { Router } from 'express';
import { TransactionRepository } from '../repositories/transactionRepository.js';
import { TransactionService } from '../services/transactionService.js';
import { TransactionController } from '../controllers/transactionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

const transactionRepo = new TransactionRepository();
const transactionService = new TransactionService(transactionRepo);
const transactionController = new TransactionController(transactionService);

router.get('/', transactionController.getAll);
router.get('/stats', transactionController.getStats);
router.post('/', authMiddleware, transactionController.create);
router.put('/:id', authMiddleware, transactionController.update);
router.delete('/:id', authMiddleware, transactionController.delete);

export default router;

