import { auth } from "../auth.js";

export const authMiddleware = async (req, res, next) => {
    const session = await auth.api.getSession({
        headers: req.headers,
    });

    if (!session) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
        });
    }

    req.user = session.user;
    req.session = session.session;
    next();
};
