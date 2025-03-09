import { threatRepository, threatResponseRepository, threatScanRepository, userRepository } from "../repositories";
import { ResponseGeneratorService } from "./response-generator-service";
import { ThreatResponseService } from "./threat-response-service";
import { ThreatScanService } from "./threat-scan-service";
import { ThreatService } from "./threat-service";
import { UserService } from "./user-service";

export const userService = new UserService(userRepository);
export const threatService = new ThreatService(threatRepository,threatScanRepository);
export const threatScanService = new ThreatScanService(threatScanRepository);
export const responseGeneratorService = new ResponseGeneratorService();
export const threatResponseService = new ThreatResponseService(threatRepository,threatResponseRepository)