import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import updateLocale from 'dayjs/plugin/updateLocale'
import { api } from "./_generated/api";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekOfYear);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
    weekStart: 1
  })

export const getWeeklyReport = query({
  args: {},
  handler: async (ctx) => {
    const data = await ctx.db.query("weekly_report").collect();
    return data.sort((a, b) => dayjs(b.week_number).valueOf() - dayjs(a.week_number).valueOf());
  },
});

export const updateWeeklyReport = mutation({
  args: {
    weekNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const weekStartDate = dayjs().week(args.weekNumber).startOf("week");
    const weekEndDate = dayjs().week(args.weekNumber).endOf("week");
    const data = await ctx.db.query("daily_report").filter((q) => q.and(q.gte(q.field("date"), weekStartDate.format("YYYY-MM-DD")), q.lte(q.field("date"), weekEndDate.format("YYYY-MM-DD")))).collect();
    let totalSecondsAccum = 0;
    for (const log of data) {
      totalSecondsAccum += log.seconds;
      totalSecondsAccum += log.minutes * 60;
      totalSecondsAccum += log.hours * 3600;
    }
    const hours = Math.floor(totalSecondsAccum / 3600);
    const minutes = Math.floor((totalSecondsAccum % 3600) / 60);
    const seconds = totalSecondsAccum % 60;
    // check if the weekly report already exists, then update it, otherwise create a new one
    const existingWeeklyReport = await ctx.db.query("weekly_report").filter((q) => q.eq(q.field("week_number"), args.weekNumber)).collect();
    if (existingWeeklyReport.length > 0) {
      const updatedWeeklyReport = await ctx.db.patch(existingWeeklyReport[0]._id, {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      });
      return updatedWeeklyReport;
    } else {
      const weeklyReport = await ctx.db.insert("weekly_report", {
        week_number: args.weekNumber,
        start_date: weekStartDate.format("YYYY-MM-DD"),
        end_date: weekEndDate.format("YYYY-MM-DD"),
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      });
      return weeklyReport;
    }
  },
});

export const updateWeeklyReportCron = mutation({
  args: {},
  handler: async (ctx) => {
    const weekNumber = dayjs().week();
    const previousWeekNumber = weekNumber - 1;
    if (previousWeekNumber > 0) {
      await ctx.runMutation(api.weekly_report.updateWeeklyReport, { weekNumber: previousWeekNumber });
    }
    await ctx.runMutation(api.weekly_report.updateWeeklyReport, { weekNumber: weekNumber });
  },
});
