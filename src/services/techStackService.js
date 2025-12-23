export class TechStackService {
    constructor(techStackRepository) {
        this.techStackRepository = techStackRepository;
    }

    async getAllTechStacks() {
        return await this.techStackRepository.findAll();
    }

    async createTechStack(data) {
        return await this.techStackRepository.create(data);
    }

    async updateTechStack(id, data) {
        return await this.techStackRepository.update(id, data);
    }

    async deleteTechStack(id) {
        return await this.techStackRepository.delete(id);
    }
}
