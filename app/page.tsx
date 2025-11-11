"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import TimeDisplay from "@/components/TimeDisplay";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-24 px-4">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">{new Date().toLocaleDateString(
          "en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )}</h1>
      <TimeDisplay hours={0} minutes={0} seconds={0}/>
      </div>
      <div className="flex flex-col items-center justify-center">
      <button className="btn btn-success btn-lg" onClick={() => {
        api.time_log.create({
          timestamp: new Date().toISOString(),
          type: "IN",
          date: new Date().toISOString(),
        });
      }}>Check In</button>
      </div>
    </main>
  );
}