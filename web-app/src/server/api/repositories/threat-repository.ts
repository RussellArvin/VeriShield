import { threatSchema } from "~/server/db/schema";
import { Threat } from "../models/threat";
import { TRPCError } from "@trpc/server";
import { and, count, eq, getTableColumns ,isNull,ne, sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export class ThreatRepository {
    constructor(private readonly db: PostgresJsDatabase) {}

    public async save(entity: Threat){
         try{
              await this.db
              .insert(threatSchema)
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

    public async findCriticalThreatCountByUserId(userId: string) : Promise<number>{
        try{
            const results = await this.db
            .select({
                count: count()
            })
            .from(threatSchema)
            .where(and(
                eq(threatSchema.userId, userId),
                eq(threatSchema.status,"CRITICAL"),
                isNull(threatSchema.responseId)
            ))
            return results[0]?.count ?? 0;
        } catch(err){
            const e = err as Error;
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:e.message
            })
        }
    }

    public async findMediumThreatCountByUserId(userId: string) : Promise<number>{
        try{
            const results = await this.db
            .select({
                count: count()
            })
            .from(threatSchema)
            .where(and(
                eq(threatSchema.userId, userId),
                eq(threatSchema.status,"MED"),
                isNull(threatSchema.responseId)
            ))
            return results[0]?.count ?? 0;
        } catch(err){
            const e = err as Error;
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:e.message
            })
        }
    }
    public async findLowThreatCountByUserId(userId: string) : Promise<number>{
        try{
            const results = await this.db
            .select({
                count: count()
            })
            .from(threatSchema)
            .where(and(
                eq(threatSchema.userId, userId),
                eq(threatSchema.status,"LOW"),
                isNull(threatSchema.responseId)
            ))
            return results[0]?.count ?? 0;
        } catch(err){
            const e = err as Error;
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:e.message
            })
        }
    }

    public async update(entity: Threat) {
        try{
            await this.db.update(threatSchema).set({...entity.getValue()})
                .where(eq(threatSchema.id,entity.getValue().id))
        } catch(err){
            const e = err as Error;
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:e.message
            })
        }
    }

    public async findActiveThreatCountByUserId(userId: string) : Promise<number>{
        try{
            const results = await this.db
            .select({
                count: count()
            })
            .from(threatSchema)
            .where(and(
                eq(threatSchema.userId, userId),
                isNull(threatSchema.responseId)
            ))
            return results[0]?.count ?? 0;
        } catch(err){
            const e = err as Error;
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:e.message
            })
        }
    }

    public async findAllCriticalAndMedByUserIdOrNull(userId: string) : Promise<Threat[]>{
        try{
            const results = await this.db
            .select(getTableColumns(threatSchema))
            .from(threatSchema)
            .where(and(
                eq(threatSchema.userId, userId),ne(threatSchema.status,"LOW"),
                isNull(threatSchema.responseId)
            ))

            if(results.length === 0){
                return []
            }
            else return results.map((result) => new Threat(result));
        } catch(err){
            const e = err as Error;
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:e.message
            })
        }
    }

    public async findOneById(threatId: string) : Promise<Threat>{
        try{
            const results = await this.db
            .select(getTableColumns(threatSchema))
            .from(threatSchema)
            .where(and(
                eq(threatSchema.id,threatId)
            ))
            .limit(1)

            if(results[0] == null) throw new TRPCError({
                code:"NOT_FOUND",
                message:"Unable to find threat"
            })
            return new Threat(results[0])
        } catch(err){
            if(err instanceof TRPCError) throw err;
            const e = err as Error;
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:e.message
            })
        }
    }


    public async findOneByIdAndUserId(threatId: string,userId: string) : Promise<Threat>{
        try{
            const results = await this.db
            .select(getTableColumns(threatSchema))
            .from(threatSchema)
            .where(and(
                eq(threatSchema.id,threatId),
                eq(threatSchema.userId,userId)
            ))
            .limit(1)

            if(results[0] == null) throw new TRPCError({
                code:"NOT_FOUND",
                message:"Unable to find threat"
            })
            return new Threat(results[0])
        } catch(err){
            if(err instanceof TRPCError) throw err;
            const e = err as Error;
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:e.message
            })
        }
    }
    

    public async findAllByUserIdOrNull(userId: string) : Promise<Threat[]>{
        try{
            const results = await this.db
            .select(getTableColumns(threatSchema))
            .from(threatSchema)
            .where(and(
                eq(threatSchema.userId, userId),
                isNull(threatSchema.responseId)
            ))

            if(results.length === 0){
                return []
            }
            else return results.map((result) => new Threat(result));
        } catch(err){
            const e = err as Error;
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:e.message
            })
        }
    }

    public async findManyByDay(userId: string): Promise<Array<{day: string, count: number, status: string}>> {
        try {
            // Extract day of week from createdAt timestamp and group counts by day and status
            // Only include threats from the current week
            const results = await this.db
                .select({
                    day: sql<string>`trim(to_char(${threatSchema.createdAt}, 'Day'))`,
                    status: threatSchema.status,
                    count: count()
                })
                .from(threatSchema)
                .where(and(
                    eq(threatSchema.userId, userId),
                    // Filter for threats created within the current week
                    sql`${threatSchema.createdAt} >= date_trunc('week', current_date)`,
                    sql`${threatSchema.createdAt} < date_trunc('week', current_date) + interval '1 week'`
                ))
                .groupBy(sql`to_char(${threatSchema.createdAt}, 'Day')`, threatSchema.status)
                .orderBy(
                    // Order by day of week (Sunday = 0, Monday = 1, etc.)
                    sql`CASE 
                        WHEN to_char(${threatSchema.createdAt}, 'Day') LIKE 'Sunday%' THEN 0
                        WHEN to_char(${threatSchema.createdAt}, 'Day') LIKE 'Monday%' THEN 1
                        WHEN to_char(${threatSchema.createdAt}, 'Day') LIKE 'Tuesday%' THEN 2
                        WHEN to_char(${threatSchema.createdAt}, 'Day') LIKE 'Wednesday%' THEN 3
                        WHEN to_char(${threatSchema.createdAt}, 'Day') LIKE 'Thursday%' THEN 4
                        WHEN to_char(${threatSchema.createdAt}, 'Day') LIKE 'Friday%' THEN 5
                        WHEN to_char(${threatSchema.createdAt}, 'Day') LIKE 'Saturday%' THEN 6
                    END`
                );

            return results;
        } catch(err) {
            const e = err as Error;
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: e.message
            });
        }
    }
}