import { db } from '../db/index.js';
import { categories } from '../schema/index.js';
import { eq } from 'drizzle-orm';

export class CategoryRepository {
    async findAll() {
        return await db.query.categories.findMany();
    }

    async create(data) {
        const [category] = await db.insert(categories).values(data).returning();
        return category;
    }

    async update(id, data) {
        const [category] = await db.update(categories)
            .set(data)
            .where(eq(categories.id, id))
            .returning();
        return category;
    }

    async delete(id) {
        const [category] = await db.delete(categories)
            .where(eq(categories.id, id))
            .returning();
        return category;
    }
}
