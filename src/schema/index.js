import { pgTable, serial, text, timestamp, boolean, doublePrecision, pgEnum, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const projectStatusEnum = pgEnum('project_status', ['draft', 'published', 'archived']);
export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);

// --- Auth Tables (Better Auth compatible) ---
export const users = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('emailVerified').notNull(),
    image: text('image'),
    createdAt: timestamp('createdAt').notNull(),
    updatedAt: timestamp('updatedAt').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    accounts: many(accounts),
    projects: many(projects),
    transactions: many(transactions),
}));

export const sessions = pgTable('session', {
    id: text('id').primaryKey(),
    userId: text('userId').notNull().references(() => users.id),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expiresAt').notNull(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    createdAt: timestamp('createdAt').notNull(),
    updatedAt: timestamp('updatedAt').notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const accounts = pgTable('account', {
    id: text('id').primaryKey(),
    userId: text('userId').notNull().references(() => users.id),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    expiresAt: timestamp('expiresAt'),
    password: text('password'),
    createdAt: timestamp('createdAt').notNull(),
    updatedAt: timestamp('updatedAt').notNull(),
});

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const verifications = pgTable('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
    createdAt: timestamp('createdAt'),
    updatedAt: timestamp('updatedAt'),
});

// --- Portfolio Tables ---
export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    userId: text('userId').references(() => users.id),
    name: text('name').notNull(),
    description: text('description'), // HTML/Rich-text content
    completionDate: timestamp('completion_date'),
    status: projectStatusEnum('status').default('draft'),
    liveUrl: text('live_url'),
    githubUrl: text('github_url'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
    user: one(users, {
        fields: [projects.userId],
        references: [users.id],
    }),
    projectImages: many(projectImages),
    projectTechStacks: many(projectTechStacks),
}));

export const projectImages = pgTable('project_images', {
    id: serial('id').primaryKey(),
    projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    isPrimary: boolean('is_primary').default(false),
    order: integer('order').default(0),
});

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
    project: one(projects, {
        fields: [projectImages.projectId],
        references: [projects.id],
    }),
}));

export const techStacks = pgTable('tech_stacks', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    color: text('color'), // e.g., 'primary', 'blue', 'purple'
});

export const techStacksRelations = relations(techStacks, ({ many }) => ({
    projectTechStacks: many(projectTechStacks),
}));

export const projectTechStacks = pgTable('project_tech_stacks', {
    projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    techStackId: integer('tech_stack_id').references(() => techStacks.id, { onDelete: 'cascade' }),
}, (t) => ({
    pk: [t.projectId, t.techStackId],
}));

export const projectTechStacksRelations = relations(projectTechStacks, ({ one }) => ({
    project: one(projects, {
        fields: [projectTechStacks.projectId],
        references: [projects.id],
    }),
    techStack: one(techStacks, {
        fields: [projectTechStacks.techStackId],
        references: [techStacks.id],
    }),
}));

// --- Financial Tables ---
export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    icon: text('icon'), // Material Icon name
});

export const categoriesRelations = relations(categories, ({ many }) => ({
    transactions: many(transactions),
}));

export const transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    userId: text('userId').references(() => users.id),
    name: text('name').notNull(),
    amount: doublePrecision('amount').notNull(),
    type: transactionTypeEnum('type').notNull(), // income or expense
    date: timestamp('date').defaultNow(),
    categoryId: integer('category_id').references(() => categories.id),
    description: text('description'),
    receiptUrl: text('receipt_url'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
    user: one(users, {
        fields: [transactions.userId],
        references: [users.id],
    }),
    category: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    }),
}));

// --- Communication ---
export const inquiries = pgTable('inquiries', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    message: text('message').notNull(),
    isRead: boolean('is_read').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

