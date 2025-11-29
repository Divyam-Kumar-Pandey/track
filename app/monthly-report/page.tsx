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
import { RedirectToSignIn, useUser } from "@clerk/nextjs";

dayjs.extend(weekOfYear);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1
})

export default function WeeklyReportPage() {
  const { user } = useUser();
  if (!user) {
    return <RedirectToSignIn />;
  }
  const reports = useQuery(api.monthly_report.getMonthlyReport);
  const workingDaysInMonth = useQuery(api.holiday.getWorkingDaysInMonth, { monthNumber: dayjs().month() });
  // const HOURS_IN_WORKMONTH = 50; 
  const thisMonthNumber = dayjs().month();

  const currentMonth =
    reports && reports.find((m: any) => m.month_number === thisMonthNumber);
  const otherMonths =
    reports?.filter((m: any) => m.month_number !== thisMonthNumber) ?? [];

  return (
    <main className="flex min-h-[70vh] p-6 justify-center items-center">
      <div className="w-full max-w-2xl h-full">
        <h1 className="text-3xl font-semibold text-center">Monthly Reports</h1>

        <section className="mt-6 rounded-lg border p-4 bg-base-100 shadow-md">

          {!reports && (
            <p className="text-gray-500 text-center">Loading...</p>
          )}
          {reports && !currentMonth && (
            <p className="text-gray-500 text-center">
              No data for the current month yet.
            </p>
          )}
          {currentMonth && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-2xl font-bold">
                {dayjs(currentMonth.start_date).format("MMMM YYYY")}
              </div>
              <div className="opacity-60">
                {dayjs(currentMonth.start_date).format("ddd, MMM D, YYYY")} –{" "}
                {dayjs(currentMonth.end_date).format("ddd, MMM D, YYYY")}
              </div>
              <TimeDisplayStatic
                totalHours={currentMonth.hours}
                totalMinutes={currentMonth.minutes}
                totalSeconds={currentMonth.seconds}
                fontSize="text-5xl"
              />
              {workingDaysInMonth && <div className="text-sm opacity-60">
                Avg: {((currentMonth.hours*60*60 + currentMonth.minutes*60 + currentMonth.seconds) / (workingDaysInMonth*3600)).toFixed(2)} hours/day
              </div>}
            </div>
          )}
        </section>

        <div className="mt-6">
          {!reports && (
            <p className="text-gray-500 text-center">Loading...</p>
          )}
          {reports && reports.length === 0 && (
            <p className="text-gray-500 text-center">No monthly reports yet</p>
          )}
          {reports && otherMonths.length > 0 && (
            <ul className="list bg-base-100 rounded-box shadow-md">
              {otherMonths.map(
                (m: {
                  _id: string;
                  month_number: number;
                  start_date: string;
                  end_date: string;
                  hours: number;
                  minutes: number;
                  seconds: number;
                }) => (
                  <li
                    key={m._id}
                    className="list-row flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {/* <div>
                        {m.hours < HOURS_IN_WORKMONTH ? (
                          <MdIncompleteCircle className="size-6 text-orange-500" />
                        ) : (
                          <MdCheckCircle className="size-6 text-green-500" />
                        )}
                      </div> */}
                      <div className="flex flex-col items-start">
                        <div className="text-sm opacity-60">
                          Month {m.month_number} •{" "}
                          {dayjs(m.start_date).format("MMM D")} –{" "}
                          {dayjs(m.end_date).format("MMM D, YYYY")}
                        </div>
                        <div>
                          <TimeDisplayStatic
                            totalHours={m.hours}
                            totalMinutes={m.minutes}
                            totalSeconds={m.seconds}
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

