import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError, initTRPC } from "@trpc/server";
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
const isAuth = t.middleware(async (opts) => {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  if (!user.id || !user.email) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});
export const router = t.router;
export const publicProcedure = t.procedure;
// run middleware beforehand the api endpoint has been called
export const privateProcedure = t.procedure.use(isAuth);
