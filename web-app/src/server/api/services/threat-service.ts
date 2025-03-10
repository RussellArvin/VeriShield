import { TRPCError } from "@trpc/server";
import { Threat } from "../models/threat";
import { ThreatRepository } from "../repositories/threat-repository";
import { ThreatScanRepository } from "../repositories/threat-scan-repository";
import { ThreatResponseRepository } from "../repositories/threat-response-repository";
import { analysisService } from ".";
import { ThreatMediaRepository } from "../repositories/threat-media-repository";

export class ThreatService {
    constructor(
        private readonly threatRepository: ThreatRepository,
        private readonly threatScanRepositroy: ThreatScanRepository,
        private readonly threatResponseRepository: ThreatResponseRepository,
        private readonly threatMediaRepository: ThreatMediaRepository,
    ) {}

    public async getActiveThreatCountByUserId(userId: string) : Promise<number> {
        return this.threatRepository.findActiveThreatCountByUserId(userId);
    }
    public async getOneByThreatIdAndUserId(threatId: string, userId: string){
        const threat = await this.threatRepository.findOneByIdAndUserId(threatId, userId);
        const threatMedia = await this.threatMediaRepository.findManyByThreatId(threatId)
        if(threat.getValue().analysis != null) return {threat: threat.getValue(), media: threatMedia.map((media) => media.getValue())};
        else{
            const analysis = await analysisService.generate(
                threat.getValue().description,
                threat.getValue().factCheckerDescription,
                threat.getValue().status
            );
            const updatedThreat = threat.setAnalysis(analysis);
            await this.threatRepository.update(updatedThreat);
            return {threat: updatedThreat.getValue(), media: threatMedia.map((media) => media.getValue())};
        }
    }

    public async findAllResolvedByUserId(userId:string){
        const threats = await this.threatRepository.findAllResolvedByUserId(userId)
        return threats.map((result)=> result.getValue())
    }

    public async findThreatsByDay(userId: string) {
        return await this.threatRepository.findManyByDay(userId);
    }

    public async getOneResolvedByThreatIdAndUserId(
        threatId: string,
        userId: string
    ) {
        const threat = (await this.threatRepository.findOneById(threatId)).getValue()
        if(!threat.responseId) throw new TRPCError({code:"NOT_FOUND"})
        const threatResponse = (await this.threatResponseRepository.findOneByIdAndUserId(threatId,threat.responseId)).getValue()


        return {...threat, response: threatResponse}
    }

    public async getCriticalAndMedThreatsByUserIdOrNull(userId: string) : Promise<Threat[]> {
        return this.threatRepository.findAllCriticalAndMedByUserIdOrNull(userId);
    }

    public getAllByUserId(userId:string): Promise<Threat[]> {
        return this.threatRepository.findAllByUserIdOrNull(userId);
    }

    public async getMisinformationSentiment(userId: string): Promise<number> {
        const [critical, medium, low, scans] = await Promise.all([
            this.threatRepository.findCriticalThreatCountByUserId(userId),
            this.threatRepository.findMediumThreatCountByUserId(userId),
            this.threatRepository.findLowThreatCountByUserId(userId),
            this.threatScanRepositroy.getCountByUserId(userId)
        ]);
    
        const sentiment = (((low * 0.3) + (medium * 0.7) + critical) / scans) * 100;
        
        // Check if result is NaN and return 0 in that case
        return isNaN(sentiment) ? 0 : Math.ceil(sentiment);
    }
    
    public async getRiskThreatByUserId(userId: string): Promise<number> {
        const [critical, total] = await Promise.all([
            this.threatRepository.findCriticalThreatCountByUserId(userId),
            this.threatRepository.findActiveThreatCountByUserId(userId)
        ]);
    
        const riskScore = (critical / total) * 100;
        
        // Check if result is NaN and return 0 in that case
        return isNaN(riskScore) ? 0 : Math.ceil(riskScore);
    }
}