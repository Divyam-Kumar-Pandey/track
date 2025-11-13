import { cronJobs } from "convex/server";
import { api, internal } from "./_generated/api";
import dayjs from "dayjs";

const crons = cronJobs();

crons.cron(
  "create daily report",
  "5 0 * * *",
  api.daily_report.createDailyReport,
  { date: dayjs().format("YYYY-MM-DD") },
);

export default crons;