import { ThreatRepository } from "../repositories/threat-repository";

export class ThreatService {
    constructor(private readonly threatRepository: ThreatRepository) {}

    public async getActiveThreatCountByUserId(userId: string) : Promise<number> {
        return this.threatRepository.findActiveThreatCountByUserId(userId);
    }
}