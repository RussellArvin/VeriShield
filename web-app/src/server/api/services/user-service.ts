import { User } from "../models/user";
import { UserRepository } from "../repositories/user-repository";
import { clerkClient } from "@clerk/nextjs/server";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async register(
    id: string,
    firstName: string,
    lastName: string,
    email: string
  ): Promise<void> {
    const user = new User({
      id,
      firstName,
      lastName,
      email,
      keywords:[],
      persona: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      canScan: false,
    });

    await this.userRepository.save(user);
  }

  public async getUserDetails(userId: string) {
    const user = await this.userRepository.findOneByUserId(userId);
    return {
      firstName: user.getValue().firstName,
      lastName: user.getValue().lastName,
      email: user.getValue().email,
      keywords: user.getValue().keywords,
      persona: user.getValue().persona,
    }
  }

  public async saveUserDetails(
    userId: string,
    firstName: string,
    lastName: string,
    keywords: string[],
    persona: string
  ){
    const user = await this.userRepository.findOneByUserId(userId);
    const updatedUser = user.updateDetails(firstName, lastName, keywords, persona);

    await Promise.all([
      clerkClient.users.updateUser(userId,{
        firstName,
        lastName
      }),
      this.userRepository.update(updatedUser)
    ])
    return;
  }
}