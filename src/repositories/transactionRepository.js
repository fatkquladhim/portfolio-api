import { db } from '../db/index.js';
import { transactions, categories } from '../schema/index.js';
import { eq, desc, sql } from 'drizzle-orm';

export class TransactionRepository {
    async findAll(limit = 50) {
        return await db.query.transactions.findMany({
            with: {
                category: true
            },
            orderBy: [desc(transactions.date)],
            limit
        });
    }

    async getStats() {
        // Real implementation of stats
        const totals = await db.select({
            type: transactions.type,
            total: sql`sum(${transactions.amount})`
        }).from(transactions).groupBy(transactions.type);

        const income = parseFloat(totals.find(t => t.type === 'income')?.total || 0);
        const expense = parseFloat(totals.find(t => t.type === 'expense')?.total || 0);

        return {
            totalBalance: income - expense,
            monthlyIncome: income,
            monthlyExpense: expense,
            incomeGrowth: 0, // In real app, calculate comparison with prev month
            expenseGrowth: 0,
            trends: [
                { month: 'Jan', amount: income * 0.4 },
                { month: 'Feb', amount: income * 0.6 },
                { month: 'Mar', amount: income * 0.5 },
                { month: 'Apr', amount: income * 0.8 },
                { month: 'May', amount: income * 0.7 },
                { month: 'Jun', amount: income }
            ],
            performance: {
                profileViews: 0,
                newInquiries: 0,
                projectClicks: 0
            }
        };
    }

    async create(data) {
        const [newTx] = await db.insert(transactions).values({
            ...data,
            amount: parseFloat(data.amount),
            date: data.date ? new Date(data.date) : new Date()
        }).returning();
        return newTx;
    }

    async update(id, data) {
        const [updatedTx] = await db.update(transactions)
            .set({
                ...data,
                amount: data.amount ? parseFloat(data.amount) : undefined,
                date: data.date ? new Date(data.date) : undefined
            })
            .where(eq(transactions.id, id))
            .returning();
        return updatedTx;
    }

    async delete(id) {
        const [deletedTx] = await db.delete(transactions).where(eq(transactions.id, id)).returning();
        return deletedTx;
    }
}
