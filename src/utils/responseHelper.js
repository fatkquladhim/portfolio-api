export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const errorResponse = (res, error, statusCode = 500) => {
    const message = error instanceof Error ? error.message : error;
    return res.status(statusCode).json({
        success: false,
        error: message,
    });
};
