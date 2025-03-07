import { threatSchema } from "~/server/db/schema";
import { Threat } from "../models/threat";
import { TRPCError } from "@trpc/server";
import { and, count, eq, getTableColumns } from "drizzle-orm";

export class ThreatRepository {
    db: any;
    constructor(private readonly threatModel: any) {}

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

    public async findActiveThreatCountByUserId(userId: string) : Promise<number>{
        try{
            const results = await this.db
            .select({
                count: count()
            })
            .from(threatSchema)
            .where(and(
                eq(threatSchema.userId, userId),
                eq(threatSchema.status, "active")
            ))
            return results[0].count;
        } catch(err){
            const e = err as Error;
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:e.message
            })
        }
    }

    public async findAllByUserIdOrNull(userId: string) : Promise<Threat[] | null>{
        try{
            const results = await this.db
            .select(getTableColumns(threatSchema))
            .from(threatSchema)
            .where(eq(threatSchema.userId, userId))

            if(results.length === 0){
                return null;
            }
            else return results.map((result: any) => new Threat(result));
        } catch(err){
            const e = err as Error;
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:e.message
            })
        }
    }
}