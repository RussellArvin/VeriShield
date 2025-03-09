import { z } from "zod";
import { threatResponseService, threatService } from "../services";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { RESPONSE_FORMATS } from "../services/response-generator";

export const threatRouter = createTRPCRouter({
    getCriticalAndMedThreats: protectedProcedure
    .query(async({ctx})=>{
        const threats = await threatService.getCriticalAndMedThreatsByUserIdOrNull(ctx.auth.userId);
        return threats.map((threat) => threat.getValue());
    }),
    getOne: protectedProcedure
    .input(z.object({
        threatId: z.string()
    }))
    .query(async ({ctx,input})=>{
        return await threatService.getOneByThreatIdAndUserId(input.threatId,ctx.auth.userId); 
    }),
    getOneResolved: protectedProcedure
    .input(z.object({
        threatId: z.string()
    }))
    .query(async ({ctx,input}) => {
        const threat = await threatService.getOneResolvedByThreatIdAndUserId(input.threatId,ctx.auth.userId)
        return threat;
    }),
    getAll: protectedProcedure
    .query(async ({ctx}) => {
        const threats = await threatService.getAllByUserId(ctx.auth.userId);
        return threats.map((threat) => threat.getValue());
    }),
    saveResponse: protectedProcedure
    .input(z.object({
        threatId: z.string(),
        threatResponseId: z.string()
    }))
    .mutation(async ({ctx,input}) => {
        console.log(input)
        const { threatId, threatResponseId } = input;
        await threatResponseService.saveResponse(threatId,threatResponseId,ctx.auth.userId)
    }),
    getQuickResponses: protectedProcedure
    .input(z.object({
        threatId: z.string(),
        threatType: z.enum(["social-media", "disclaimer", "email", "press-statement"])
    }))
    .mutation(async ({ctx,input}) => {
        const { threatId, threatType } = input;

       const response =  await threatResponseService.checkAndGenerateQuickResponses(threatId,ctx.auth.userId,threatType)
       return response.getValue()
    }),
    
    getRegularResponses: protectedProcedure
    .input(z.object({
        threatId: z.string(),
        format: z.enum(RESPONSE_FORMATS)
    }))
    .mutation(async ({ctx, input}) => {
        const { threatId, format } = input;

        const responses = await threatResponseService.generateRegularResponses(threatId, ctx.auth.userId, format);
        return responses.map(response => response.getValue());
    })
});