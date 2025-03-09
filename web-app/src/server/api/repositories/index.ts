import { db } from "~/server/db";
import { UserRepository } from "./user-repository";
import { ThreatRepository } from "./threat-repository";
import { ThreatScanRepository } from "./threat-scan-repository";
import { ThreatResponseRepository } from "./threat-response-repository";
import { ThreatMediaRepository } from "./threat-media-repository";

export const userRepository = new UserRepository(db)
export const threatRepository = new ThreatRepository(db)
export const threatScanRepository = new ThreatScanRepository(db)
export const threatResponseRepository = new ThreatResponseRepository(db)
export const threatMediaRepository = new ThreatMediaRepository(db)