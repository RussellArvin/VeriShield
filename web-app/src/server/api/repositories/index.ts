import { db } from "~/server/db";
import { UserRepository } from "./user-repository";

export const userRepository = new UserRepository(db)