import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekOfYear);

// export const getWeeklyReport = query({
//   args: {},
//   handler: async (ctx) => {
//     const startOfWeek = dayjs().week();
//     const data = await ctx.db.query("weekly_report").collect();
//     return data.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
//   },
// });

export const updateWeeklyReport = mutation({
  args: {
    weekNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const weekStartDate = dayjs().week(args.weekNumber).startOf("week");
    const weekEndDate = dayjs().week(args.weekNumber).endOf("week");
    const data = await ctx.db.query("daily_report").filter((q) => q.and(q.gte(q.field("date"), weekStartDate.format("YYYY-MM-DD")), q.lte(q.field("date"), weekEndDate.format("YYYY-MM-DD")))).collect();
    console.log(data);
    return data;
  },
});
