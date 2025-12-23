import { successResponse, errorResponse } from '../utils/responseHelper.js';

export class ProjectController {
    constructor(projectService) {
        this.projectService = projectService;
    }

    getAll = async (req, res) => {
        try {
            const projects = await this.projectService.getAllProjects();
            return successResponse(res, projects);
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    create = async (req, res) => {
        try {
            const project = await this.projectService.createProject({
                ...req.body,
                userId: req.user.id
            });
            return successResponse(res, project, 'Project created successfully', 201);
        } catch (error) {
            console.error('Project Creation Error:', error);
            return errorResponse(res, error);
        }
    }

    getById = async (req, res) => {
        try {
            const project = await this.projectService.getProjectById(parseInt(req.params.id));
            if (!project) return errorResponse(res, 'Project not found', 404);
            return successResponse(res, project);
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    update = async (req, res) => {
        try {
            const project = await this.projectService.updateProject(parseInt(req.params.id), req.body);
            if (!project) return errorResponse(res, 'Project not found', 404);
            return successResponse(res, project, 'Project updated successfully');
        } catch (error) {
            return errorResponse(res, error);
        }
    }

    delete = async (req, res) => {
        try {
            const project = await this.projectService.deleteProject(parseInt(req.params.id));
            if (!project) return errorResponse(res, 'Project not found', 404);
            return successResponse(res, null, 'Project deleted successfully');
        } catch (error) {
            return errorResponse(res, error);
        }
    }
}
