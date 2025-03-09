import { responseGeneratorService } from ".";
import { ThreatResponse } from "../models/threat-response";
import { threatResponseRepository } from "../repositories";
import { ThreatRepository } from "../repositories/threat-repository";
import { ThreatResponseRepository } from "../repositories/threat-response-repository";
import { RESPONSE_TYPES, ResponseType, ThreatLevel } from "./response-generator-service";

export class ThreatResponseService {
    constructor(
        private readonly threatRepository: ThreatRepository,
        private readonly threatResponseRepository: ThreatResponseRepository
    ) {}

    public async checkAndGenerateResponses(
        threatId: string,
        userId: string
    ) {
        const threat = (await this.threatRepository.findOneByIdAndUserId(threatId,userId)).getValue()
        const existingResponses = await this.threatResponseRepository.findManyByThreatId(threatId);

        // Get the response types that already exist
        const existingResponseTypes = existingResponses.map(response => response.getValue().type as ResponseType);
        
        // Find which response types are missing
        const missingResponseTypes = RESPONSE_TYPES.filter(
            responseType => !existingResponseTypes.includes(responseType)
        );

        if(missingResponseTypes.length == 0) return existingResponses.map((r) => r.getValue());

        const newlyGeneratedResponses: ThreatResponse[] = []

        for (const responseType of missingResponseTypes) {
            // Generate the response content
            const responseContent = await responseGeneratorService.generateResponse({
                content: threat.description,
                threatLevel: threat.status as ThreatLevel,
                truth: threat.factCheckerDescription,
                source: threat.source,
                responseType: responseType
            });
            
            if(responseContent != null){
                newlyGeneratedResponses.push(new ThreatResponse({
                    id: uuidv4(),
                    threatId,
                    type:responseType,
                    response: responseContent,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }));
            }
        }
        if(newlyGeneratedResponses.length !== 0){
            await threatResponseRepository.saveMany(newlyGeneratedResponses);
        }

        const updatedResponses = await this.threatResponseRepository.findManyByThreatId(threatId);
        return updatedResponses.map((r) => r.getValue());
    }
}

function uuidv4(): string {
    throw new Error("Function not implemented.");
}
