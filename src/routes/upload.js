import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = 'uploads/projects';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpg, jpeg, png, webp) are allowed!'));
    }
});

router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return errorResponse(res, 'No file uploaded', 400);
        }

        const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 3001}`;
        const fileUrl = `${baseUrl}/uploads/projects/${req.file.filename}`;

        return successResponse(res, {
            url: fileUrl,
            filename: req.file.filename
        }, 'File uploaded successfully', 201);
    } catch (error) {
        return errorResponse(res, error);
    }
});

export default router;
