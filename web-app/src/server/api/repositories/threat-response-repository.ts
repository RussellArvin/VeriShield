import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { ThreatResponse } from "../models/threat-response";
import { TRPCError } from "@trpc/server";
import { eq, getTableColumns } from "drizzle-orm";
import { threatResponseSchema } from "~/server/db/schema";

export class ThreatResponseRepository {
    constructor(private readonly db: PostgresJsDatabase) {}

    public async findManyByThreatId(threatId: string): Promise<ThreatResponse[]>{
        try{
            const results = await this.db
                .select(getTableColumns(threatResponseSchema))
                .from(threatResponseSchema)
                .where(eq(threatResponseSchema.threatId,threatId))
            

            if(results.length == 0) return []
            else return results.map(result => new ThreatResponse(result))
        } catch(err){
            const e = err as Error;
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:e.message
            })
        }
    }

    public async saveMany(entities: ThreatResponse[]) {
        try{
            await this.db
            .insert(threatResponseSchema)
            .values(entities.map((entity) => entity.getValue()))

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