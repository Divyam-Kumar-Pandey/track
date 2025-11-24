import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc);
dayjs.extend(timezone);

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("time_log").order("desc").collect();
  },
});

export const getToday = query({
  args: {},
  handler: async (ctx) => {
    const date = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD");
    return await ctx.db.query("time_log").filter((q) => q.eq(q.field("date"), date)).order("desc").collect();
  },
});

export const create = mutation({
  args: {
    timestamp: v.string(),
    type: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("time_log", args);
  },
});

export const checkForOngoingSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const date = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD");
    const timeLogs = await ctx.db.query("time_log").filter((q) => q.eq(q.field("date"), date)).order("desc").collect();
    timeLogs.sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf());
    if(timeLogs.length > 0 && timeLogs[0].type === "IN") {
      const outTime = await ctx.db.insert("time_log", {
        timestamp: dayjs().tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss"),
        type: "OUT",
        date: date,
      });
      // let nextTimestamp = dayjs(dayjs(date).add(1, "day").format("YYYY-MM-DD")+"00:00:01").format("YYYY-MM-DDTHH:mm:ss");
      // let nextDate = dayjs(date).add(1, "day").format("YYYY-MM-DD");
      // const inTime = await ctx.db.insert("time_log", {
      //   timestamp: nextTimestamp,
      //   type: "IN",
      //   date: nextDate,
      // });
      // return { outTime, inTime };
      return { outTime };
    }
  },
});