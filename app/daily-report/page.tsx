"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import dayjs from "dayjs";
import { IoMdSettings } from "react-icons/io";
import { MdCheckCircle, MdIncompleteCircle } from "react-icons/md";
import TimeDisplay from "@/components/TimeDisplay";
import TimeDisplayStatic from "@/components/TimeDisplayStatic";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";

export default function DailyReportPage() {
    const { user } = useUser();
    if (!user) {
        return <RedirectToSignIn />;
    }
    const reports = useQuery(api.daily_report.getDailyReport);
    const HOURS_IN_WORKDAY = 7;
    return (
        <main className="flex min-h-[70vh] items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-semibold text-center">Daily Reports</h1>
                <div className="mt-4 h-full mb-20 overflow-y-auto rounded-lg ">
                    {!reports && (
                        <p className="text-gray-500 text-center">Loading...</p>
                    )}
                    {reports && reports.length === 0 && (
                        <p className="text-gray-500 text-center">No reports yet</p>
                    )}
                    {reports && reports.length > 0 && (
                        <ul className="list bg-base-100 rounded-box shadow-md">
                            {reports.map((r: { _id: any; date: string; hours: number; minutes: number; seconds: number }) => (
                                <li key={r._id} className="list-row flex items-center justify-between" >
                                    <div className="flex items-center gap-4">
                                    <div>
                                    <div
                                        className="radial-progress bg-primary text-primary-content border-primary border-4"
                                        style={{ "--value": r.hours/HOURS_IN_WORKDAY*100 } as React.CSSProperties } aria-valuenow={r.hours/HOURS_IN_WORKDAY*100} role="progressbar">
                                        {r.hours/HOURS_IN_WORKDAY*100}%
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <div className="text-sm opacity-60">{dayjs(r.date).format("ddd, MMM D, YYYY")}</div>
                                        <div className=" ">
                                            <TimeDisplayStatic totalHours={r.hours} totalMinutes={r.minutes} totalSeconds={r.seconds} fontSize="text-2xl " />
                                        </div>
                                    </div>
                                    </div>
                                    <button className="btn btn-square btn-ghost" aria-label="Settings">
                                        <IoMdSettings className="size-6 text-gray-500" />
                                    </button>
                                </li>
                            ))}
                            <div className="divider">That's all</div>
                        </ul>
                    )}
                </div>
            </div>
        </main>
    );
}


