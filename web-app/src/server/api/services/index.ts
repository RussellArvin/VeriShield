import { userRepository } from "../repositories";
import { UserService } from "./user-service";

export const userService = new UserService(userRepository);