import { cronJobs } from "convex/server";
import { api, internal } from "./_generated/api";
import dayjs from "dayjs";

const crons = cronJobs();

crons.cron(
  "create daily report",
  "35 18 * * *", // every day at 00:05 AM, IST
  api.daily_report.createDailyReport,
  { date: dayjs().format("YYYY-MM-DD") },
);

crons.cron(
  "update weekly report",
  "40 18 * * *", // every day at 00:10 AM, IST
  api.weekly_report.updateWeeklyReportCron,
);

crons.cron(
  "check for ongoing sessions",
  "29 18 * * *", // every day at 11:59 PM, IST
  api.time_log.checkForOngoingSessions,
);

export default crons;