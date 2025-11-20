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
  "update monthly report",
  "40 18 * * *", // every day at 00:10 AM, IST
  api.monthly_report.updateMonthlyReportCron,
);

crons.cron(
  "check for ongoing sessions",
  "29 18 * * *", // every day at 11:59 PM, IST
  api.time_log.checkForOngoingSessions,
);

crons.cron(
  "update weekend holidays for this month",
  "0 0 1 * *", // every month at 5:30 AM, IST
  api.holiday.updateWeekendHolidaysForThisMonth,
  { monthNumber: dayjs().tz("Asia/Kolkata").month() },
);

export default crons;