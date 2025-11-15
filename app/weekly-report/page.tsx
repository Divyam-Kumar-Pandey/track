/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import updateLocale from "dayjs/plugin/updateLocale";
import { IoMdSettings } from "react-icons/io";
import { MdCheckCircle, MdIncompleteCircle } from "react-icons/md";
import TimeDisplayStatic from "@/components/TimeDisplayStatic";

dayjs.extend(weekOfYear);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1
})

export default function WeeklyReportPage() {
  const reports = useQuery(api.weekly_report.getWeeklyReport);
  const HOURS_IN_WORKWEEK = 50; 
  const thisWeekNumber = dayjs().week();

  const currentWeek =
    reports && reports.find((w: any) => w.week_number === thisWeekNumber);
  const otherWeeks =
    reports?.filter((w: any) => w.week_number !== thisWeekNumber) ?? [];

  return (
    <main className="flex min-h-[70vh] p-6 justify-center items-center">
      <div className="w-full max-w-2xl h-full">
        <h1 className="text-3xl font-semibold text-center">Weekly Reports</h1>

        <section className="mt-6 rounded-lg border p-4 bg-base-100 shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Current Week
          </h2>
          {!reports && (
            <p className="text-gray-500 text-center">Loading...</p>
          )}
          {reports && !currentWeek && (
            <p className="text-gray-500 text-center">
              No data for the current week yet.
            </p>
          )}
          {currentWeek && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-2xl font-bold">
                Week {currentWeek.week_number}
              </div>
              <div className="opacity-60">
                {dayjs(currentWeek.start_date).format("ddd, MMM D, YYYY")} –{" "}
                {dayjs(currentWeek.end_date).format("ddd, MMM D, YYYY")}
              </div>
              <TimeDisplayStatic
                totalHours={currentWeek.hours}
                totalMinutes={currentWeek.minutes}
                totalSeconds={currentWeek.seconds}
                fontSize="text-5xl"
              />
            </div>
          )}
        </section>

        <div className="mt-6">
          {!reports && (
            <p className="text-gray-500 text-center">Loading...</p>
          )}
          {reports && reports.length === 0 && (
            <p className="text-gray-500 text-center">No weekly reports yet</p>
          )}
          {reports && otherWeeks.length > 0 && (
            <ul className="list bg-base-100 rounded-box shadow-md">
              {otherWeeks.map(
                (w: {
                  _id: string;
                  week_number: number;
                  start_date: string;
                  end_date: string;
                  hours: number;
                  minutes: number;
                  seconds: number;
                }) => (
                  <li
                    key={w._id}
                    className="list-row flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        {w.hours < HOURS_IN_WORKWEEK ? (
                          <MdIncompleteCircle className="size-6 text-orange-500" />
                        ) : (
                          <MdCheckCircle className="size-6 text-green-500" />
                        )}
                      </div>
                      <div className="flex flex-col items-start">
                        <div className="text-sm opacity-60">
                          Week {w.week_number} •{" "}
                          {dayjs(w.start_date).format("MMM D")} –{" "}
                          {dayjs(w.end_date).format("MMM D, YYYY")}
                        </div>
                        <div>
                          <TimeDisplayStatic
                            totalHours={w.hours}
                            totalMinutes={w.minutes}
                            totalSeconds={w.seconds}
                            fontSize="text-2xl"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-square btn-ghost"
                      aria-label="Settings"
                    >
                      <IoMdSettings className="size-6 text-gray-500" />
                    </button>
                  </li>
                )
              )}
            </ul>
          )}
          <div className="divider">That's all</div>
        </div>
      </div>
    </main>
  );
}

