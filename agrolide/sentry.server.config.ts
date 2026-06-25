import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://f7a57305fc42a1136af8a33287d7e38b@o4511627318984704.ingest.us.sentry.io/4511627385176065",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Filtrage RGPD
  beforeSend(event) {
    if (event.user && event.user.email) {
      event.user.email = "[FILTERED]";
    }
    return event;
  },
});
