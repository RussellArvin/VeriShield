import { z } from "zod";
import { threatResponseService, threatService } from "../services";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const threatRouter = createTRPCRouter({
    getCriticalAndMedThreats: protectedProcedure
    .query(async({ctx})=>{
        const threats = await threatService.getCriticalAndMedThreatsByUserIdOrNull(ctx.auth.userId);
        return threats.map((threat) => threat.getValue());
    }),
    getAll: protectedProcedure
    .query(async ({ctx}) => {
        const threats = await threatService.getAllByUserId(ctx.auth.userId);
        return threats.map((threat) => threat.getValue());
    }),
    getResponses: protectedProcedure
    .input(z.object({
        threatId: z.string()
    }))
    .mutation(async ({ctx,input}) => {
        const { threatId } = input;

       return await threatResponseService.checkAndGenerateResponses(threatId,ctx.auth.userId)
    })
});