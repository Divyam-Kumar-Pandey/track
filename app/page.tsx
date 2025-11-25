"use client";

import { useMutation, useQuery } from "convex/react";
import { Authenticated, Unauthenticated } from "convex/react";
import { api } from "../convex/_generated/api";
import TimeDisplay from "@/components/TimeDisplay";
import dayjs from 'dayjs'
import { useEffect, useState } from "react";
import { SignInButton, UserButton, useUser, RedirectToSignIn } from "@clerk/nextjs";
export default function Home() {
  const { user } = useUser();
  if (!user) {
    return <RedirectToSignIn />;
  }
  const createTimeLog = useMutation(api.time_log.create);
  const timeLogs = useQuery(api.time_log.getToday);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [totalHours, setTotalHours] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  useEffect(() => {
    if (timeLogs && timeLogs.length > 0) {
      setHasCheckedIn(timeLogs[0].type === "IN");
    }
  }, [timeLogs]);
  useEffect(() => {
    if (timeLogs && timeLogs.length > 0) {
      // timeLogs are in desc order; compute totals from earliest to latest
      const logsAsc = [...timeLogs].sort((a, b) => dayjs(a.timestamp).valueOf() - dayjs(b.timestamp).valueOf());
      let totalSecondsAccum = 0;
      let currentIn: string | null = null;
      for (const log of logsAsc) {
        if (log.type === "IN") {
          currentIn = log.timestamp;
        } else if (log.type === "OUT" && currentIn) {
          const inTime = dayjs(currentIn);
          const outTime = dayjs(log.timestamp);
          const diffSec = Math.max(0, outTime.diff(inTime, "seconds"));
          totalSecondsAccum += diffSec;
          currentIn = null;
        }
      }
      // Only completed IN→OUT pairs are counted. Ongoing session not added here.
      const hours = Math.floor(totalSecondsAccum / 3600);
      const minutes = Math.floor((totalSecondsAccum % 3600) / 60);
      const seconds = totalSecondsAccum % 60;
      setTotalHours(hours);
      setTotalMinutes(minutes);
      setTotalSeconds(seconds);
    } else {
      setTotalHours(0);
      setTotalMinutes(0);
      setTotalSeconds(0);
    }
  }, [timeLogs]);
  console.log(totalHours);
  return (
    <>
      <Authenticated>
        <main className="flex min-h-screen flex-col items-center justify-between py-24 px-4">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">{dayjs().format("dddd, MMMM D, YYYY")}</h1>

            {timeLogs && timeLogs.length > 0 ? (
              <>
                {hasCheckedIn ? (
                  <TimeDisplay lastCheckInTime={timeLogs[0].timestamp} fixed={false} />
                ) : (
                  <TimeDisplay lastCheckInTime={dayjs().format("YYYY-MM-DDTHH:mm:ss")} fixed={true} />
                )}</>
            ) : (
              <p className="text-gray-500">No time logs for today</p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="countdown font-mono text-4xl">
              <span style={{ "--value": totalHours } as React.CSSProperties} aria-live="polite" aria-label="totalHours">{totalHours}</span>
              h
              <span style={{ "--value": totalMinutes } as React.CSSProperties} aria-live="polite" aria-label="totalMinutes">{totalMinutes}</span>
              m
              <span style={{ "--value": totalSeconds } as React.CSSProperties} aria-live="polite" aria-label="totalSeconds">{totalSeconds}</span>
              s
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <button className="btn btn-success btn-lg" onClick={async () => {
              await createTimeLog({
                timestamp: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
                type: hasCheckedIn ? "OUT" : "IN",
                date: dayjs().format("YYYY-MM-DD"),
              });
              setHasCheckedIn(!hasCheckedIn);
            }}>{hasCheckedIn ? "Check Out" : "Check In"}</button>
          </div>
        </main>
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
    </>
  );
}