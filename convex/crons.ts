import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Run every Monday at 09:00 UTC
crons.weekly(
  "sendWeeklyPendingRequestEmails", // Name shown in dashboard/logs
  { dayOfWeek: "monday", hourUTC: 9, minuteUTC: 0 },
  api.buddyRequests.sendWeeklyPendingRequestEmails, // The action you wrote
  {} // Pass empty args object since your action takes no parameters
);

export default crons;
