import { threatRepository, userRepository } from "../repositories";
import { ThreatService } from "./threat-service";
import { UserService } from "./user-service";

export const userService = new UserService(userRepository);
export const threatService = new ThreatService(threatRepository);