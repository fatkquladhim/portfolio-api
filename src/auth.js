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

    // ✅ NAMA PROPERTY YANG BENAR
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false
    },

    trustedOrigins: [
        "http://localhost:5173",
        "https://portfolio-iota-pink-35.vercel.app"
    ],

    session: {
        cookie: {
            secure: true,
            sameSite: "none"
        }
    }
});
