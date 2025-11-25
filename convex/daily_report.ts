import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc);
dayjs.extend(timezone);

export const getDailyReport = query({
    args: {},
    handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
      if (identity === null) {
        throw new Error("Not authenticated");
      }
      const data = await ctx.db.query("daily_report").filter((q) => q.eq(q.field("user_id"), identity.subject)).collect();
      return data.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
    },
});

// export const createDailyReport = mutation({
//     args: {
//         date: v.string(),
//     },
//     handler: async (ctx, args) => {
//       const timeLogs = await ctx.db.query("time_log").filter((q) => q.eq(q.field("date"), args.date)).order("desc").collect();

//       const logsAsc = [...timeLogs].sort((a, b) => dayjs(a.timestamp).valueOf() - dayjs(b.timestamp).valueOf());
//       let totalSecondsAccum = 0;
//       let currentIn: string | null = null;
//       for (const log of logsAsc) {
//         if (log.type === "IN") {
//           currentIn = log.timestamp;
//         } else if (log.type === "OUT" && currentIn) {
//           const inTime = dayjs(currentIn);
//           const outTime = dayjs(log.timestamp);
//           const diffSec = Math.max(0, outTime.diff(inTime, "seconds"));
//           totalSecondsAccum += diffSec;
//           currentIn = null;
//         }
//       }
//       // Only completed IN→OUT pairs are counted. Ongoing session not added here.
//       const hours = Math.floor(totalSecondsAccum / 3600);
//       const minutes = Math.floor((totalSecondsAccum % 3600) / 60);
//       const seconds = totalSecondsAccum % 60;
//       await ctx.db.insert("daily_report", {
//         date: args.date,
//         hours: hours,
//         minutes: minutes,
//         seconds: seconds,
//       });
//     },
//   });