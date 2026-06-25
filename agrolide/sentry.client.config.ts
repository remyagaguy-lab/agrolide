import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://f7a57305fc42a1136af8a33287d7e38b@o4511627318984704.ingest.us.sentry.io/4511627385176065",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filtrage RGPD : on masque les emails et les informations sensibles avant l'envoi
  beforeSend(event) {
    if (event.user) {
      if (event.user.email) {
        event.user.email = "[FILTERED]";
      }
    }
    
    // Check request data
    if (event.request && event.request.data) {
      let dataStr = typeof event.request.data === 'string' 
        ? event.request.data 
        : JSON.stringify(event.request.data);
      
      // Regex basique pour trouver les emails et les remplacer
      dataStr = dataStr.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[FILTERED_EMAIL]");
      
      try {
        event.request.data = JSON.parse(dataStr);
      } catch (e) {
        event.request.data = dataStr;
      }
    }

    return event;
  },
});
