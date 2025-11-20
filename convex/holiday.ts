import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc);
dayjs.extend(timezone);

export const getWorkingDaysInMonth = query({
  args: {
    monthNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const holidays = await ctx.db.query("holiday").filter((q) => q.eq(q.field("month_number"), args.monthNumber)).collect();
    const daysInMonth = dayjs().month(args.monthNumber).daysInMonth();
    const workingDays = daysInMonth - holidays.length;
    return workingDays;
  },
});

export const updateWeekendHolidaysForThisMonth = mutation({
  args: {
    monthNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const startDate = dayjs().month(args.monthNumber).startOf("month");
    const endDate = dayjs().month(args.monthNumber).endOf("month");
    const days = [];
    for (let date = startDate; date.isBefore(endDate); date = date.add(1, "day")) {
      if (date.day() === 0 || date.day() === 6) {
        days.push(date.format("YYYY-MM-DD"));
      }
    }
    
    const existingWeekendHolidays = await ctx.db.query("holiday").filter((q) => q.eq(q.field("month_number"), args.monthNumber)).collect();
    for (const date of days) {
      if (!existingWeekendHolidays.some((holiday) => holiday.date === date)) {
        await ctx.db.insert("holiday", {
          month_number: args.monthNumber,
          date: date,
          name: "Weekend",
        });
      }
    }
    return existingWeekendHolidays.length;
  },
});