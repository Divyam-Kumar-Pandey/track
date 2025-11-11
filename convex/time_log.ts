import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("time_log").filter((q) => q.eq(q.field("date"), new Date().toISOString().split("T")[0])).collect();
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