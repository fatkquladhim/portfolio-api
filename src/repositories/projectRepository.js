import { db } from '../db/index.js';
import { projects, projectImages, projectTechStacks, techStacks } from '../schema/index.js';
import { eq, desc } from 'drizzle-orm';

export class ProjectRepository {
    async findAll() {
        return await db.query.projects.findMany({
            with: {
                projectImages: {
                    orderBy: [projectImages.order]
                },
                projectTechStacks: {
                    with: {
                        techStack: true
                    }
                }
            },
            orderBy: [desc(projects.createdAt)]
        });
    }

    async create(projectData, images = [], techStackNames = []) {
        return await db.transaction(async (tx) => {
            const [newProject] = await tx.insert(projects).values(projectData).returning();

            if (images.length > 0) {
                await tx.insert(projectImages).values(
                    images.map(img => ({ ...img, projectId: newProject.id }))
                );
            }

            if (techStackNames.length > 0) {
                for (const name of techStackNames) {
                    let [tech] = await tx.select().from(techStacks).where(eq(techStacks.name, name));
                    if (!tech) {
                        [tech] = await tx.insert(techStacks).values({ name }).returning();
                    }
                    await tx.insert(projectTechStacks).values({
                        projectId: newProject.id,
                        techStackId: tech.id
                    });
                }
            }

            return newProject;
        });
    }

    async findById(id) {
        return await db.query.projects.findFirst({
            where: eq(projects.id, id),
            with: {
                projectImages: {
                    orderBy: [projectImages.order]
                },
                projectTechStacks: {
                    with: {
                        techStack: true
                    }
                }
            }
        });
    }

    async update(id, projectData, images = [], techStackNames = []) {
        return await db.transaction(async (tx) => {
            const [updatedProject] = await tx.update(projects)
                .set({ ...projectData, updatedAt: new Date() })
                .where(eq(projects.id, id))
                .returning();

            if (!updatedProject) return null;

            // Handle images: always sync if images array is provided
            if (images) {
                await tx.delete(projectImages).where(eq(projectImages.projectId, id));
                if (images.length > 0) {
                    await tx.insert(projectImages).values(
                        images.map(img => ({
                            url: img.url,
                            isPrimary: img.isPrimary,
                            order: img.order,
                            projectId: id
                        }))
                    );
                }
            }

            if (techStackNames.length > 0) {
                await tx.delete(projectTechStacks).where(eq(projectTechStacks.projectId, id));
                for (const name of techStackNames) {
                    let [tech] = await tx.select().from(techStacks).where(eq(techStacks.name, name));
                    if (!tech) {
                        [tech] = await tx.insert(techStacks).values({ name }).returning();
                    }
                    await tx.insert(projectTechStacks).values({
                        projectId: id,
                        techStackId: tech.id
                    });
                }
            }

            return updatedProject;
        });
    }

    async delete(id) {
        const [deletedProject] = await db.delete(projects).where(eq(projects.id, id)).returning();
        return deletedProject;
    }
}
