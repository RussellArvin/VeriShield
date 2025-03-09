import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { ThreatResponse } from "../models/threat-response";
import { TRPCError } from "@trpc/server";
import { eq, getTableColumns, and } from "drizzle-orm";
import { threatResponseSchema } from "~/server/db/schema";

export class ThreatResponseRepository {
    constructor(private readonly db: PostgresJsDatabase) {}

    public async findManyQuickByThreatId(threatId: string): Promise<ThreatResponse[]>{
        try{
            const results = await this.db
                .select(getTableColumns(threatResponseSchema))
                .from(threatResponseSchema)
                .where(and(
                    eq(threatResponseSchema.threatId,threatId),
                    eq(threatResponseSchema.length,"quick")
                ))
            

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

    public async findOneByIdAndUserId(
        threatId: string,
        threatResponseId: string
    ): Promise<ThreatResponse> {
        try{
            const results = await this.db
                .select(getTableColumns(threatResponseSchema))
                .from(threatResponseSchema)
                .where(and(
                    eq(threatResponseSchema.id,threatResponseId),
                    eq(threatResponseSchema.threatId,threatId)
                ))

            if(!results[0]) throw new TRPCError({
                code:"NOT_FOUND",
                message: "Unable to find Threat Response"
            })

            return new ThreatResponse(results[0])
        } catch(err){
            if(err instanceof TRPCError) throw err;
            const e = err as Error;
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:e.message
            })
        }
    }

    public async findOneByThreatIdAndLengthAndResponseTypeOrNull(
        threatId: string,
        length: string,
        type: string
    ): Promise<ThreatResponse | null> {
        try{
            const results = await this.db
                .select(getTableColumns(threatResponseSchema))
                .from(threatResponseSchema)
                .where(and(
                    eq(threatResponseSchema.threatId,threatId),
                    eq(threatResponseSchema.length,length),
                    eq(threatResponseSchema.type,type)
                ))
                .limit(1)
            
            if(!results[0]) return null;
            else return new ThreatResponse(results[0])

            
        } catch(err){
            const e = err as Error;
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:e.message
            })
        }
    }

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