import { Threat } from "../models/threat";
import { ThreatRepository } from "../repositories/threat-repository";
import { ThreatScanRepository } from "../repositories/threat-scan-repository";

export class ThreatService {
    constructor(
        private readonly threatRepository: ThreatRepository,
        private readonly threatScanRepositroy: ThreatScanRepository
    ) {}

    public async getActiveThreatCountByUserId(userId: string) : Promise<number> {
        return this.threatRepository.findActiveThreatCountByUserId(userId);
    }

    public async getCriticalAndMedThreatsByUserIdOrNull(userId: string) : Promise<Threat[]> {
        return this.threatRepository.findAllCriticalAndMedByUserIdOrNull(userId);
    }

    public async getMisinformationSentiment(userId: string): Promise<number>{
        const[critical,medium,low, scans] = await Promise.all([
            this.threatRepository.findCriticalThreatCountByUserId(userId),
            this.threatRepository.findMediumThreatCountByUserId(userId),
            this.threatRepository.findLowThreatCountByUserId(userId),
            this.threatScanRepositroy.getCountByUserId(userId)
        ])

        const sentiment = (((low * 0.3)+ (medium * 0.7) + critical) / scans) * 100
        return Math.ceil(sentiment)
    }

    public async getRiskThreatByUserId(userId: string) : Promise<number> {
        const[critical, total] = await Promise.all([
            this.threatRepository.findCriticalThreatCountByUserId(userId),
            this.threatRepository.findActiveThreatCountByUserId(userId)
        ]);

        return Math.ceil((critical / total) * 100);
    }
}