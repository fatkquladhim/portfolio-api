import { db } from '../db/index.js';
import { inquiries } from '../schema/index.js';
import { eq, desc } from 'drizzle-orm';

export class InquiryRepository {
    async findAll() {
        return await db.query.inquiries.findMany({
            orderBy: [desc(inquiries.createdAt)]
        });
    }

    async create(data) {
        const [inquiry] = await db.insert(inquiries).values(data).returning();
        return inquiry;
    }

    async updateReadStatus(id, isRead) {
        const [inquiry] = await db.update(inquiries)
            .set({ isRead, updatedAt: new Date() }) // Note: schema says createdAt, but usually we have updatedAt. Let me check schema again.
            .where(eq(inquiries.id, id))
            .returning();
        return inquiry;
    }

    async delete(id) {
        const [inquiry] = await db.delete(inquiries)
            .where(eq(inquiries.id, id))
            .returning();
        return inquiry;
    }
}
