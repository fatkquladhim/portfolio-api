import { successResponse, errorResponse } from '../utils/responseHelper.js';

export class InquiryController {
    constructor(inquiryService) {
        this.inquiryService = inquiryService;
    }

    getAll = async (req, res) => {
        try {
            const inquiries = await this.inquiryService.getAllInquiries();
            return successResponse(res, inquiries);
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    create = async (req, res) => {
        try {
            const inquiry = await this.inquiryService.createInquiry(req.body);
            return successResponse(res, inquiry, 201);
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    markAsRead = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const { isRead } = req.body;
            const inquiry = await this.inquiryService.markAsRead(id, isRead !== undefined ? isRead : true);
            return successResponse(res, inquiry);
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    delete = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await this.inquiryService.deleteInquiry(id);
            return successResponse(res, null, 204);
        } catch (error) {
            return errorResponse(res, error);
        }
    }
}
