"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import dayjs from "dayjs";

export default function AdminPage() {
  const createDailyReport = useMutation(api.daily_report.createDailyReport);
  // Casting to any because generated types may not yet include `weekly_report`
  const updateMonthlyReport = useMutation(api.monthly_report.updateMonthlyReport);
  const updateWeekendHolidaysForThisMonth = useMutation(api.holiday.updateWeekendHolidaysForThisMonth);
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [monthNumber, setMonthNumber] = useState<number>(1);
  const [isSubmittingMonthly, setIsSubmittingMonthly] = useState(false);
  const [monthlyFeedback, setMonthlyFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [weekendHolidaysFeedback, setWeekendHolidaysFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmittingWeekendHolidays, setIsSubmittingWeekendHolidays] = useState(false);

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

  const onSubmitMonthly = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monthNumber || monthNumber < 1 || monthNumber > 12) {
      setMonthlyFeedback({ type: "error", text: "Please enter a valid month number (1-12)." });
      return;
    }
    setIsSubmittingMonthly(true);
    setMonthlyFeedback(null);
    try {
      const result = await updateMonthlyReport({ monthNumber: Number(monthNumber) });
      const count = Array.isArray(result) ? result.length : 0;
      setMonthlyFeedback({ type: "success", text: `Fetched ${count} daily report(s) for month ${monthNumber}.` });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update monthly report.";
      setMonthlyFeedback({ type: "error", text: message });
    } finally {
      setIsSubmittingMonthly(false);
    }
  };

  const onSubmitWeekendHolidays = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monthNumber || monthNumber < 1 || monthNumber > 12) {
      setWeekendHolidaysFeedback({ type: "error", text: "Please enter a valid month number (1-12)." });
      return;
    }
    setIsSubmittingWeekendHolidays(true);
    setWeekendHolidaysFeedback(null);
    try {
      const result = await updateWeekendHolidaysForThisMonth({ monthNumber: Number(monthNumber) });
      setWeekendHolidaysFeedback({ type: "success", text: `Updated ${result} weekend holidays for month ${monthNumber}.` });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update weekend holidays.";
      setWeekendHolidaysFeedback({ type: "error", text: message });
    } finally {
      setIsSubmittingWeekendHolidays(false);
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
        <h2 className="text-2xl font-semibold text-center mt-10">Admin: Update Monthly Report</h2>
        <form onSubmit={onSubmitMonthly} className="mt-4 grid grid-cols-1 gap-4 rounded-lg border p-4">
          <label className="form-control">
            <span className="label-text mb-2">Enter month number (1-12)</span>
            <input
              type="number"
              className="input input-bordered"
              min={1}
              max={53}
              value={monthNumber}
              onChange={(e) => setMonthNumber(Number(e.target.value))}
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={isSubmittingMonthly}>
            {isSubmittingMonthly ? "Updating..." : "Update Monthly Report"}
          </button>
          {monthlyFeedback && (
            <div className={monthlyFeedback.type === "success" ? "text-green-600" : "text-red-600"} role="status" aria-live="polite">
              {monthlyFeedback.text}
            </div>
          )}
        </form>
        <h2 className="text-2xl font-semibold text-center mt-10">Admin: Update Weekend Holidays for This Month</h2>
        <form onSubmit={onSubmitWeekendHolidays} className="mt-4 grid grid-cols-1 gap-4 rounded-lg border p-4">
          <label className="form-control">
            <span className="label-text mb-2">Enter month number (1-12)</span>
            <input
              type="number"
              className="input input-bordered"
              min={1}
              max={12}
              value={monthNumber}
              onChange={(e) => setMonthNumber(Number(e.target.value))}
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={isSubmittingWeekendHolidays}>
            {isSubmittingWeekendHolidays ? "Updating..." : "Update Weekend Holidays"}
          </button>
          {weekendHolidaysFeedback && (
            <div className={weekendHolidaysFeedback.type === "success" ? "text-green-600" : "text-red-600"} role="status" aria-live="polite">
              {weekendHolidaysFeedback.text}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}


