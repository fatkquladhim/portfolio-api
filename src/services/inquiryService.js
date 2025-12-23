export class InquiryService {
    constructor(inquiryRepository) {
        this.inquiryRepository = inquiryRepository;
    }

    async getAllInquiries() {
        return await this.inquiryRepository.findAll();
    }

    async createInquiry(data) {
        return await this.inquiryRepository.create(data);
    }

    async markAsRead(id, isRead = true) {
        return await this.inquiryRepository.updateReadStatus(id, isRead);
    }

    async deleteInquiry(id) {
        return await this.inquiryRepository.delete(id);
    }
}
