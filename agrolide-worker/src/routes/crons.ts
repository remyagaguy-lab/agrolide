import { checkRappels } from '../crons/rappels'

export const cronsRoute = {
  handler: async (event: any, env: any, ctx: any) => {
    console.log('Cron triggered', event.cron)
    // Dispatch to expiration, rappels or redis-reset based on event.cron
    await checkRappels(env)
  }
}
