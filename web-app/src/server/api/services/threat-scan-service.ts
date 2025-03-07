import { ThreatScanRepository } from "../repositories/threat-scan-repository";

export class ThreatScanService {
    constructor(private readonly threatScanRepository: ThreatScanRepository) {}

    public async getCountByUserId(userId: string) : Promise<number>{
        return await this.threatScanRepository.getCountByUserId(userId);
    }
}