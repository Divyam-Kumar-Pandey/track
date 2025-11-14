"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import dayjs from "dayjs";

export default function AdminPage() {
  const createDailyReport = useMutation(api.daily_report.createDailyReport);
  // Casting to any because generated types may not yet include `weekly_report`
  const updateWeeklyReport = useMutation((api as any).weekly_report.updateWeeklyReport);
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [isSubmittingWeekly, setIsSubmittingWeekly] = useState(false);
  const [weeklyFeedback, setWeeklyFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await createDailyReport({ date: dayjs(date).format("YYYY-MM-DD") });
      setFeedback({ type: "success", text: "Daily report created successfully." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create daily report.";
      setFeedback({ type: "error", text: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitWeekly = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weekNumber || weekNumber < 1 || weekNumber > 53) {
      setWeeklyFeedback({ type: "error", text: "Please enter a valid week number (1-53)." });
      return;
    }
    setIsSubmittingWeekly(true);
    setWeeklyFeedback(null);
    try {
      const result = await updateWeeklyReport({ weekNumber: Number(weekNumber) });
      const count = Array.isArray(result) ? result.length : 0;
      setWeeklyFeedback({ type: "success", text: `Fetched ${count} daily report(s) for week ${weekNumber}.` });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update weekly report.";
      setWeeklyFeedback({ type: "error", text: message });
    } finally {
      setIsSubmittingWeekly(false);
    }
  };

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-semibold text-center">Admin: Create Daily Report</h1>
        <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4 rounded-lg border p-4">
          <label className="form-control">
            <span className="label-text mb-2">Select date</span>
            <input
              type="date"
              className="input input-bordered"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={dayjs().format("YYYY-MM-DD")}
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Report"}
          </button>
          {feedback && (
            <div className={feedback.type === "success" ? "text-green-600" : "text-red-600"} role="status" aria-live="polite">
              {feedback.text}
            </div>
          )}
        </form>
        <h2 className="text-2xl font-semibold text-center mt-10">Admin: Update Weekly Report</h2>
        <form onSubmit={onSubmitWeekly} className="mt-4 grid grid-cols-1 gap-4 rounded-lg border p-4">
          <label className="form-control">
            <span className="label-text mb-2">Enter week number (1-53)</span>
            <input
              type="number"
              className="input input-bordered"
              min={1}
              max={53}
              value={weekNumber}
              onChange={(e) => setWeekNumber(Number(e.target.value))}
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={isSubmittingWeekly}>
            {isSubmittingWeekly ? "Updating..." : "Update Weekly Report"}
          </button>
          {weeklyFeedback && (
            <div className={weeklyFeedback.type === "success" ? "text-green-600" : "text-red-600"} role="status" aria-live="polite">
              {weeklyFeedback.text}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}


