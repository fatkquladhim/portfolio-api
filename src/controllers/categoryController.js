import { successResponse, errorResponse } from '../utils/responseHelper.js';

export class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    getAll = async (req, res) => {
        try {
            const categories = await this.categoryService.getAllCategories();
            return successResponse(res, categories);
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    create = async (req, res) => {
        try {
            const category = await this.categoryService.createCategory(req.body);
            return successResponse(res, category, 201);
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    update = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const category = await this.categoryService.updateCategory(id, req.body);
            return successResponse(res, category);
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    delete = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await this.categoryService.deleteCategory(id);
            return successResponse(res, null, 204);
        } catch (error) {
            return errorResponse(res, error);
        }
    }
}
