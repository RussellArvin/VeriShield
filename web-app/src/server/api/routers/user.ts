import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { userSchema } from "~/server/db/schema";
import { threatScanService, threatService, userService } from "../services";

export const userRouter = createTRPCRouter({
    // get: protectedProcedure
    // .query(async({ctx})=>{
    //     const userData = await db
    //     .select({
    //         id:userSchema.id,
    //         email:userSchema.email
    //     })
    //     .from(userSchema)
    //     .where(eq(userSchema.id,ctx.auth.userId))

    //     if(!userData[0]) throw new TRPCError({code:"NOT_FOUND"})

    //     return userData[0]
    // }),
    getActiveThreatCount: protectedProcedure
    .query(async({ctx})=>{
        const threatCount = await threatService.getActiveThreatCountByUserId(ctx.auth.userId);
        return threatCount;
    }),
    getScanCount: protectedProcedure
    .query(async({ctx})=>{
        const scanCount = await threatScanService.getCountByUserId(ctx.auth.userId);
        return scanCount;
    }),
    getUserDetails: protectedProcedure
    .query(async({ctx})=>{
        const user = await userService.getUserDetails(ctx.auth.userId);
        return user;
    }),
    updateUserDetails: protectedProcedure
    .input(z.object({
        firstName: z.string(),
        lastName: z.string(),
        keywords: z.array(z.string()),
        persona: z.string()
    }))
    .mutation(async({input,ctx})=>{
        await userService.saveUserDetails(
            ctx.auth.userId,
            input.firstName,
            input.lastName,
            input.keywords,
            input.persona
        )
        return;
    }) 
});
