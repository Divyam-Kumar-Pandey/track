import { cronJobs } from "convex/server";
import { api, internal } from "./_generated/api";
import dayjs from "dayjs";

const crons = cronJobs();

crons.cron(
  "create daily report",
  "35 18 * * *",
  api.daily_report.createDailyReport,
  { date: dayjs().format("YYYY-MM-DD") },
);

crons.cron(
  "update weekly report",
  "35 18 * * *",
  api.weekly_report.updateWeeklyReportCron,
);

crons.cron(
  "check for ongoing sessions",
  "29 18 * * *",
  api.time_log.checkForOngoingSessions,
);

export default crons;