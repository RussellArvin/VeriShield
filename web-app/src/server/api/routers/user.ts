import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { userSchema } from "~/server/db/schema";
import { threatService } from "../services";

export const userRouter = createTRPCRouter({
    get: protectedProcedure
    .query(async({ctx})=>{
        const userData = await db
        .select({
            id:userSchema.id,
            email:userSchema.email
        })
        .from(userSchema)
        .where(eq(userSchema.id,ctx.auth.userId))

        if(!userData[0]) throw new TRPCError({code:"NOT_FOUND"})

        return userData[0]
    }),
    getActiveThreatCount: protectedProcedure
    .query(async({ctx})=>{
        const threatCount = await threatService.getActiveThreatCountByUserId(ctx.auth.userId);
        return threatCount;
    }),
    // register: protectedProcedure
    // .mutation(async ({ctx})=>{
    //     try{
    //     //     const email = await getEmailFromClerk(ctx.auth.userId)
    //     //     const userData = await db
    //     //     .insert(userSchema)
    //     //     .values({
    //     //         id:ctx.auth.userId,
    //     //         email
    //     //     })
    //     //     .returning();

    //     //     if(!userData[0]) throw Error();
    //     // }
    //     // catch (e){
    //     //     return new TRPCError({
    //     //         code:"INTERNAL_SERVER_ERROR",
    //     //         message:"Error when registering user"
    //     //     })
    //     // }
    // })
});
