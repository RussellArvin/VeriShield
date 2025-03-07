import { threatRepository, threatScanRepository, userRepository } from "../repositories";
import { ThreatScanService } from "./threat-scan-service";
import { ThreatService } from "./threat-service";
import { UserService } from "./user-service";

export const userService = new UserService(userRepository);
export const threatService = new ThreatService(threatRepository);
export const threatScanService = new ThreatScanService(threatScanRepository);