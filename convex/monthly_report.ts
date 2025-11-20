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

export const getMonthlyReport = query({
  args: {},
  handler: async (ctx) => {
    const data = await ctx.db.query("monthly_report").collect();
    return data.sort((a, b) => dayjs(b.month_number).valueOf() - dayjs(a.month_number).valueOf());
  },
});

export const updateMonthlyReport = mutation({
  args: {
    monthNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const monthStartDate = dayjs().month(args.monthNumber).startOf("month");
    const monthEndDate = dayjs().month(args.monthNumber).endOf("month");
    const data = await ctx.db.query("daily_report").filter((q) => q.and(q.gte(q.field("date"), monthStartDate.format("YYYY-MM-DD")), q.lte(q.field("date"), monthEndDate.format("YYYY-MM-DD")))).collect();
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
    const existingMonthlyReport = await ctx.db.query("monthly_report").filter((q) => q.eq(q.field("month_number"), args.monthNumber)).collect();
    if (existingMonthlyReport.length > 0) {
      const updatedMonthlyReport = await ctx.db.patch(existingMonthlyReport[0]._id, {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      });
      return updatedMonthlyReport;
    } else {
      const monthlyReport = await ctx.db.insert("monthly_report", {
        month_number: args.monthNumber,
        start_date: monthStartDate.format("YYYY-MM-DD"),
        end_date: monthEndDate.format("YYYY-MM-DD"),
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      });
      return monthlyReport;
    }
  },
});

export const updateMonthlyReportCron = mutation({
  args: {},
  handler: async (ctx) => {
    const lastDay = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD");
    const lastDayDailyReport = await ctx.db.query("daily_report").filter((q) => q.eq(q.field("date"), lastDay)).order("desc").first();
    if (lastDayDailyReport) {
      const monthNumber = dayjs(lastDayDailyReport.date).month();
      const existingMonthlyReport = await ctx.db.query("monthly_report").filter((q) => q.eq(q.field("month_number"), monthNumber)).collect();
      if (existingMonthlyReport.length > 0) {
        await ctx.db.patch(existingMonthlyReport[0]._id, {
          hours: existingMonthlyReport[0].hours + lastDayDailyReport.hours,
          minutes: existingMonthlyReport[0].minutes + lastDayDailyReport.minutes,
          seconds: existingMonthlyReport[0].seconds + lastDayDailyReport.seconds,
        });
      } else {
        await ctx.db.insert("monthly_report", {
          month_number: monthNumber,
          start_date: dayjs(lastDayDailyReport.date).startOf("month").format("YYYY-MM-DD"),
          end_date: dayjs(lastDayDailyReport.date).endOf("month").format("YYYY-MM-DD"),
          hours: lastDayDailyReport.hours,
          minutes: lastDayDailyReport.minutes,
          seconds: lastDayDailyReport.seconds,
        });
      }
    }
  },
});
