import { successResponse, errorResponse } from '../utils/responseHelper.js';

export class TechStackController {
    constructor(techStackService) {
        this.techStackService = techStackService;
    }

    getAll = async (req, res) => {
        try {
            const techStacks = await this.techStackService.getAllTechStacks();
            return successResponse(res, techStacks);
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    create = async (req, res) => {
        try {
            const techStack = await this.techStackService.createTechStack(req.body);
            return successResponse(res, techStack, 201);
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    update = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const techStack = await this.techStackService.updateTechStack(id, req.body);
            return successResponse(res, techStack);
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    delete = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await this.techStackService.deleteTechStack(id);
            return successResponse(res, null, 204);
        } catch (error) {
            return errorResponse(res, error);
        }
    }
}
