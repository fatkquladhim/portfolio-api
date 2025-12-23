export class ProjectService {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }

    async getAllProjects() {
        const projects = await this.projectRepository.findAll();
        // Business logic: Transform data if needed for UI
        return projects.map(p => ({
            ...p,
            primaryImage: p.projectImages.find(img => img.isPrimary)?.url || p.projectImages[0]?.url,
            techStacks: p.projectTechStacks.map(pts => pts.techStack)
        }));
    }

    async createProject(projectData) {
        const { images, techStack, ...pureProjectData } = projectData;

        // Ensure completionDate is a Date object if provided
        if (pureProjectData.completionDate && typeof pureProjectData.completionDate === 'string') {
            pureProjectData.completionDate = new Date(pureProjectData.completionDate);
        }

        return await this.projectRepository.create(pureProjectData, images, techStack);
    }

    async getProjectById(id) {
        const project = await this.projectRepository.findById(id);
        if (!project) return null;

        return {
            ...project,
            primaryImage: project.projectImages?.find(img => img.isPrimary)?.url || project.projectImages?.[0]?.url,
            techStacks: project.projectTechStacks?.map(pts => pts.techStack) || []
        };
    }

    async updateProject(id, projectData) {
        const { images, techStack, ...pureProjectData } = projectData;

        // Ensure completionDate is a Date object if provided
        if (pureProjectData.completionDate && typeof pureProjectData.completionDate === 'string') {
            pureProjectData.completionDate = new Date(pureProjectData.completionDate);
        }

        return await this.projectRepository.update(id, pureProjectData, images, techStack);
    }

    async deleteProject(id) {
        return await this.projectRepository.delete(id);
    }
}
