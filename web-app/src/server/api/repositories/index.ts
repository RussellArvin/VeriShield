import { db } from "~/server/db";
import { UserRepository } from "./user-repository";
import { ThreatRepository } from "./threat-repository";

export const userRepository = new UserRepository(db)
export const threatRepository = new ThreatRepository(db)