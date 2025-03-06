import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { User } from "../models/user";
import { userSchema } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

export class UserRepository {
    constructor(private readonly db: PostgresJsDatabase) {}


    public async save(entity: User){
       try{
        await this.db
        .insert(userSchema)
        .values(entity.getValue())

        return;
       } catch(err){
        const e = err as Error;
        throw new TRPCError({
            code:"INTERNAL_SERVER_ERROR",
            message:e.message
        })
       }
    }
}