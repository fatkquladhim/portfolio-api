import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects.js';
import transactionRoutes from './routes/transactions.js';
import categoryRoutes from './routes/categories.js';
import inquiryRoutes from './routes/inquiries.js';
import techStackRoutes from './routes/techStacks.js';
import uploadRoutes from './routes/upload.js';
import chatRoutes from './routes/chat.js';
import { auth } from './auth.js';
import { toNodeHandler } from "better-auth/node";
import { errorResponse } from './utils/responseHelper.js';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/health', (req, res) => {
    res.json({ success: true, timestamp: new Date().toISOString() });
});

app.all("/api/auth/*", toNodeHandler(auth));

app.use('/api/projects', projectRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/tech-stacks', techStackRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);


// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    return errorResponse(res, 'Something went wrong!', 500);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

