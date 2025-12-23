import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index.js";
import * as schema from "./schema/index.js";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.users,
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verifications,
        }
    }),
    // PERBAIKAN 1: Nama property yang benar
    emailPassword: {
        enabled: true
    },
    // PERBAIKAN 2: Tambahkan domain Vercel Anda agar session bisa terbaca
    trustedOrigins: [
        "http://localhost:5173",
        "https://portfolio-iota-pink-35.vercel.app"
    ]
});
