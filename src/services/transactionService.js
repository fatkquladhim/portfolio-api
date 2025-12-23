export class TransactionService {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    async getAllTransactions(limit) {
        const result = await this.transactionRepository.findAll(limit);
        return result.map(tx => ({
            id: tx.id,
            name: tx.name,
            amount: tx.amount,
            type: tx.type,
            date: tx.date,
            isIncome: tx.type === 'income',
            category: {
                name: tx.category?.name || 'Uncategorized',
                icon: tx.category?.icon || 'help'
            }
        }));
    }

    async getDashboardStats() {
        return await this.transactionRepository.getStats();
    }

    async createTransaction(data) {
        return await this.transactionRepository.create(data);
    }

    async updateTransaction(id, data) {
        return await this.transactionRepository.update(id, data);
    }

    async deleteTransaction(id) {
        return await this.transactionRepository.delete(id);
    }
}
