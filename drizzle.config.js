import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    // 1. Ganti 'driver' menjadi 'dialect'
    dialect: 'postgresql',

    // 2. Sesuaikan path ke file skema Anda (pastikan folder src/schema ada)
    schema: './src/schema/index.js',

    // 3. Folder output untuk file migrasi
    out: './drizzle',

    // 4. Struktur dbCredentials berubah menjadi lebih sederhana
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },

    // 5. Tambahkan opsi ini untuk keamanan dan kejelasan log
    verbose: true,
    strict: true,
});