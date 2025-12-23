import { db } from '../db/index.js';
import { techStacks } from '../schema/index.js';
import { eq } from 'drizzle-orm';

export class TechStackRepository {
    async findAll() {
        return await db.query.techStacks.findMany();
    }

    async create(data) {
        const [tech] = await db.insert(techStacks)
            .values(data)
            .onConflictDoUpdate({
                target: techStacks.name,
                set: data
            })
            .returning();
        return tech;
    }

    async update(id, data) {
        const [tech] = await db.update(techStacks)
            .set(data)
            .where(eq(techStacks.id, id))
            .returning();
        return tech;
    }

    async delete(id) {
        const [tech] = await db.delete(techStacks)
            .where(eq(techStacks.id, id))
            .returning();
        return tech;
    }
}
