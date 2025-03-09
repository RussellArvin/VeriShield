import { quickResponseGeneratorService, responseGenerator } from ".";
import { ThreatResponse } from "../models/threat-response";
import { threatResponseRepository } from "../repositories";
import { ThreatRepository } from "../repositories/threat-repository";
import { ThreatResponseRepository } from "../repositories/threat-response-repository";
import { ResponseFormat } from "./response-generator";
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
        
        // Map status to appropriate ThreatLevel for quick response
        let threatLevel: ThreatLevel;
        switch(threat.status) {
            case "CRITICAL":
                threatLevel = "CRITICAL";
                break;
            case "MED":
                threatLevel = "MED";
                break;
            case "LOW":
                threatLevel = "LOW";
                break;
            default:
                threatLevel = "MED"; // Default to medium if unknown
        }

        const newResponse = await quickResponseGeneratorService.generateResponse({
            content: threat.description,
            threatLevel,
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

    public async generateRegularResponses(
        threatId: string,
        userId: string,
        format: ResponseFormat
    ): Promise<ThreatResponse[]> {
        const threat = (await this.threatRepository.findOneByIdAndUserId(threatId, userId)).getValue();
        
        // Check if responses already exist for this format
        const existingResponses = await this.threatResponseRepository.findByThreatIdAndResponseTypeOrNull(
            threatId,
            format
        );

        if (existingResponses && existingResponses.length === 3) {
            return existingResponses;
        }

        // Map status to appropriate ThreatLevel
        let threatLevel: ThreatLevel;
        switch(threat.status) {
            case "CRITICAL":
            case "CRITICAL":
                threatLevel = "CRITICAL";
            case "MED":
                threatLevel = "MED";
                break;
            case "LOW":
                threatLevel = "LOW";
                break;
            default:
                threatLevel = "MED"; // Default to medium if unknown
        }
        
        // Generate regular responses
        const responses = await responseGenerator.generateResponses({
            content: threat.description,
            threatLevel,
            source: threat.source,
            format: format
        });

        // Create ThreatResponse objects for each style
        const formattedResponses = [
            new ThreatResponse({
                id: uuidv4(),
                threatId,
                type: format,
                length: "concise",
                response: responses.responses.concise,
                createdAt: new Date(),
                updatedAt: new Date()
            }),
            new ThreatResponse({
                id: uuidv4(),
                threatId,
                type: format,
                length: "detailed",
                response: responses.responses.detailed,
                createdAt: new Date(),
                updatedAt: new Date()
            }),
            new ThreatResponse({
                id: uuidv4(),
                threatId,
                type: format,
                length: "collaborative",
                response: responses.responses.collaborative,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        ];

        await this.threatResponseRepository.saveMany(formattedResponses);
        return formattedResponses;
    }
}