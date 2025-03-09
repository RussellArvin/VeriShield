import { quickResponseGeneratorService } from ".";
import { ThreatResponse } from "../models/threat-response";
import { threatResponseRepository } from "../repositories";
import { ThreatRepository } from "../repositories/threat-repository";
import { ThreatResponseRepository } from "../repositories/threat-response-repository";
import { RESPONSE_TYPES, ResponseType, ThreatLevel } from "./quick-response-generator-service";
import { v4 as uuidv4 } from 'uuid';

export class ThreatResponseService {
    constructor(
        private readonly threatRepository: ThreatRepository,
        private readonly threatResponseRepository: ThreatResponseRepository
    ) {}

    public async saveResponse(
        threatId: string,
        threatResponseId: string,
        userId: string,
    ) {
        const threat = (await this.threatRepository.findOneByIdAndUserId(threatId,userId))
        const threatResponse = (await this.threatResponseRepository.findOneByIdAndUserId(threatId,threatResponseId)).getValue()

        const updatedThreat = threat.setResponseId(threatResponseId);
        await this.threatRepository.update(updatedThreat)
        return;
    }


    public async checkAndGenerateQuickResponses(
        threatId: string,
        userId: string,
        threatType: ResponseType
    ): Promise<ThreatResponse> {
        const threat = (await this.threatRepository.findOneByIdAndUserId(threatId,userId)).getValue()
        const existingResponse = (await this.threatResponseRepository.findOneByThreatIdAndLengthAndResponseTypeOrNull(
            threatId,
            "quick",
            threatType
        ))

        if(existingResponse) return existingResponse
        
        const newResponse = await quickResponseGeneratorService.generateResponse({
            content: threat.description,
                threatLevel: threat.status as ThreatLevel,
                truth: threat.factCheckerDescription,
                source: threat.source,
                responseType: threatType
        })

        const formattedResponse = new ThreatResponse({
            id: uuidv4(),
            threatId,
            type: threatType,
            length: "quick",
            response: newResponse!,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        await threatResponseRepository.saveMany([formattedResponse])
        return formattedResponse
    }
}