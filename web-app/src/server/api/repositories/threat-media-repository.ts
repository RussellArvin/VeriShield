import { eq, getTableColumns } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { threatMediaSchema } from "~/server/db/schema";
import {ThreatMedia} from "../models/threat-media";

export class ThreatMediaRepository {
    constructor(private readonly db: PostgresJsDatabase) {}

    public async findManyByThreatId(threatId: string): Promise<ThreatMedia[]>{
        const results = await this.db
        .select(getTableColumns(threatMediaSchema))
        .from(threatMediaSchema)
        .where(eq(threatMediaSchema.threatId,threatId))

        if(results.length ==0) return []
        else return results.map((result) => new ThreatMedia(result));
    }
}