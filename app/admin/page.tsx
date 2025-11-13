"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import dayjs from "dayjs";

export default function AdminPage() {
  const createDailyReport = useMutation(api.daily_report.createDailyReport);
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
      </div>
    </main>
  );
}


