"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import dayjs from "dayjs";
import { IoMdSettings } from "react-icons/io";
import { MdCheckCircle, MdIncompleteCircle } from "react-icons/md";
import TimeDisplay from "@/components/TimeDisplay";
import TimeDisplayStatic from "@/components/TimeDisplayStatic";

export default function DailyReportPage() {
    const reports = useQuery(api.daily_report.getDailyReport);

    return (
        <main className="flex min-h-[60vh] items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-semibold text-center">Daily Reports</h1>
                <div className="mt-4 h-[60vh] overflow-y-auto rounded-lg ">
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
                                       {r.hours < 8 ? <MdIncompleteCircle className="size-6 text-orange-500" /> : <MdCheckCircle className="size-6 text-green-500" />}
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
                        </ul>
                    )}
                </div>
            </div>
        </main>
    );
}


