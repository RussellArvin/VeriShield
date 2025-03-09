import { Threat } from "../models/threat";
import { ThreatRepository } from "../repositories/threat-repository";

export class ThreatService {
    constructor(private readonly threatRepository: ThreatRepository) {}

    public async getActiveThreatCountByUserId(userId: string) : Promise<number> {
        return this.threatRepository.findActiveThreatCountByUserId(userId);
    }

    public async getCriticalAndMedThreatsByUserIdOrNull(userId: string) : Promise<Threat[]> {
        return this.threatRepository.findAllCriticalAndMedByUserIdOrNull(userId);
    }
}