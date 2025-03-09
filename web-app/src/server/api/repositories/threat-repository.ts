import { threatSchema } from "~/server/db/schema";
import { Threat } from "../models/threat";
import { TRPCError } from "@trpc/server";
import { and, count, eq, getTableColumns ,ne } from "drizzle-orm";
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
                eq(threatSchema.status,"CRITICAL")
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
                eq(threatSchema.status,"MED")
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
                eq(threatSchema.status,"LOW")
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

    public async findActiveThreatCountByUserId(userId: string) : Promise<number>{
        try{
            const results = await this.db
            .select({
                count: count()
            })
            .from(threatSchema)
            .where(and(
                eq(threatSchema.userId, userId),
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
            .where(and(eq(threatSchema.userId, userId),ne(threatSchema.status,"low")))

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
    

    public async findAllByUserIdOrNull(userId: string) : Promise<Threat[]>{
        try{
            const results = await this.db
            .select(getTableColumns(threatSchema))
            .from(threatSchema)
            .where(eq(threatSchema.userId, userId))

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
}