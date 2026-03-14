import { baseProcedure, createTRPCRouter } from '../init';
// public API
export const appRouter = createTRPCRouter({
  health: baseProcedure.query(async()=>{
    return { status: 'ok' , code:123 }
  })
});

// export type definition of API
export type AppRouter = typeof appRouter;