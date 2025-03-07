import { TRPCError } from "@trpc/server";
import { and, count, eq, sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { threatScanSchema } from "~/server/db/schema";

export class ThreatScanRepository {
    constructor(private readonly db: PostgresJsDatabase) {}

    public async getCountByUserId(userId: string) : Promise<number>{
        try{
            const results = await this.db
            .select({
                totalThreat: sql<number>`SUM(${threatScanSchema.scannedThreats})`
            })
            .from(threatScanSchema)
            .where(and(
                eq(threatScanSchema.userId, userId),
            ))
            return results[0]?.totalThreat ?? 0;
        } catch(err){
            const e = err as Error;
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:e.message
            })
        }
    }
}