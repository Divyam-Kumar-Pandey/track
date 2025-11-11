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
    console.log(date);
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