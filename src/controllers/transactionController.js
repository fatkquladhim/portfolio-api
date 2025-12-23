import { successResponse, errorResponse } from '../utils/responseHelper.js';

export class TransactionController {
    constructor(transactionService) {
        this.transactionService = transactionService;
    }

    getAll = async (req, res) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 50;
            const transactions = await this.transactionService.getAllTransactions(limit);
            return successResponse(res, transactions);
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    getStats = async (req, res) => {
        try {
            const stats = await this.transactionService.getDashboardStats();
            return successResponse(res, stats);
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    create = async (req, res) => {
        try {
            const transaction = await this.transactionService.createTransaction(req.body);
            return successResponse(res, transaction, 'Transaction created successfully', 201);
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    update = async (req, res) => {
        try {
            const transaction = await this.transactionService.updateTransaction(parseInt(req.params.id), req.body);
            if (!transaction) return errorResponse(res, 'Transaction not found', 404);
            return successResponse(res, transaction, 'Transaction updated successfully');
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    delete = async (req, res) => {
        try {
            const transaction = await this.transactionService.deleteTransaction(parseInt(req.params.id));
            if (!transaction) return errorResponse(res, 'Transaction not found', 404);
            return successResponse(res, null, 'Transaction deleted successfully');
        } catch (error) {
            return errorResponse(res, error);
        }
    }
}
