import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    time_log: defineTable({
        date: v.string(),
        timestamp: v.string(),
        type: v.string(),
    }).index("by_date", ["date"]),
    daily_report: defineTable({
        date: v.string(),
        hours: v.float64(),
        minutes: v.float64(),
        seconds: v.float64(),
    }).index("by_date", ["date"]),
    monthly_report: defineTable({
        month_number: v.number(),
        start_date: v.string(),
        end_date: v.string(),
        hours: v.float64(),
        minutes: v.float64(),
        seconds: v.float64(),
    }).index("by_month_number", ["month_number"]),
    holiday: defineTable({
        month_number: v.number(),
        date: v.string(),
        name: v.string(),
    }).index("by_month_number", ["month_number"]),
});