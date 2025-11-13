import { cronJobs } from "convex/server";
import { api, internal } from "./_generated/api";
import dayjs from "dayjs";

const crons = cronJobs();

// An alternative way to create the same schedule as above with cron syntax
crons.cron(
  "create daily report",
  "0 5 0 * *",
  api.daily_report.createDailyReport,
  { date: dayjs().format("YYYY-MM-DD") },
);

export default crons;