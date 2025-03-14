import { authMiddleware } from "@clerk/nextjs";
import APP_ROUTES from "~/server/constants/APP_ROUTES";
 
export default authMiddleware(({
      publicRoutes:[
            APP_ROUTES.CLERK_WEBHOOK,
            APP_ROUTES.LANDING
      ]
}));
 
export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};