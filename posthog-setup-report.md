<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 16 App Router project. Here's a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes PostHog on the client side using the Next.js 15.3+ instrumentation pattern. Configured with a reverse proxy (`/ingest`), exception capture for error tracking, and debug mode in development.
- **`next.config.ts`** (updated): Added `/ingest` rewrites to proxy PostHog requests through the Next.js server, avoiding ad-blockers. Also enabled `skipTrailingSlashRedirect` as required.
- **`components/ExploreBtn.tsx`** (updated): Made into a proper client component with a `handleClick` handler that fires `explore_events_clicked` when the CTA is clicked.
- **`components/EventCard.tsx`** (updated): Added `'use client'` directive and a `handleClick` handler that fires `event_card_clicked` with the event's title, slug, location, and date as properties.
- **`.env.local`** (new): Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the "Explore Events" CTA button on the home page | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card (includes title, slug, location, date as properties) | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/454484/dashboard/1670003)
- [Explore Events button clicks](https://us.posthog.com/project/454484/insights/ydas1BNg)
- [Event card clicks](https://us.posthog.com/project/454484/insights/NrygNkRt)
- [Top clicked events by title](https://us.posthog.com/project/454484/insights/yl0tdsny)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
