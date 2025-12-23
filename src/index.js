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
const PORT = process.env.PORT || 3001;

/* =========================
   GLOBAL ERROR HANDLER
========================= */
process.on("unhandledRejection", err => {
    console.error("❌ Unhandled Rejection:", err);
});

process.on("uncaughtException", err => {
    console.error("❌ Uncaught Exception:", err);
});

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            "http://localhost:5173",
            "https://portfolio-iota-pink-35.vercel.app"
        ];

        // ✅ Izinkan request tanpa origin
        // (health check, server-to-server, preflight, better-auth internal)
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // ❌ JANGAN throw error
        // cukup tolak secara halus
        return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ WAJIB: handle preflight
app.options("*", cors());


app.use(express.json());
app.use(morgan('dev'));

/* =========================
   STATIC FILES
========================= */
app.use('/uploads', express.static('uploads'));

/* =========================
   HEALTH CHECK
========================= */
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

/* =========================
   AUTH ROUTES
========================= */
app.all("/api/auth/*", toNodeHandler(auth));

/* =========================
   API ROUTES
========================= */
app.use('/api/projects', projectRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/tech-stacks', techStackRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
    return errorResponse(res, 'Route not found', 404);
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
    console.error(err.stack);
    return errorResponse(res, 'Internal Server Error', 500);
});

/* =========================
   SERVER START
========================= */
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

/* =========================
   GRACEFUL SHUTDOWN
========================= */
process.on("SIGTERM", () => {
    console.log("🛑 SIGTERM received, shutting down gracefully");
    process.exit(0);
});
