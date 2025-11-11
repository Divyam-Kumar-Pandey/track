'use client';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'

const TimeDisplay = ({
    lastCheckInTime,
    fixed
}: {
    lastCheckInTime: string;
    fixed: boolean;
}) => {
    const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
        const target = dayjs(lastCheckInTime);
        return dayjs().diff(target, "seconds");
    });

    useEffect(() => {
        if(fixed) return;
        const target = dayjs(lastCheckInTime);
        // Sync immediately in case prop changed
        setElapsedSeconds(dayjs().diff(target, "seconds"));
        const intervalId = setInterval(() => {
            setElapsedSeconds(dayjs().diff(target, "seconds"));
        }, 1000);
        return () => clearInterval(intervalId);
    }, [lastCheckInTime, fixed]);

    const hours = fixed ? 0 : Math.floor(elapsedSeconds / 3600);
    const minutes = fixed ? 0 : Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = fixed ? 0 : elapsedSeconds % 60;
    return (
        <>
            <div className="grid auto-cols-max grid-flow-col gap-5 text-center">
                <div className="flex flex-col items-center w-16">
                    <span className="countdown font-mono text-5xl">
                        <span style={{ "--value": hours } as React.CSSProperties} aria-live="polite" aria-label={`${hours} hours`}>{hours}</span>
                    </span>
                    hours
                </div>
                <div className="flex flex-col items-center w-16">
                    <span className="countdown font-mono text-5xl">
                        <span style={{ "--value": minutes } as React.CSSProperties} aria-live="polite" aria-label={`${minutes} minutes`}>{minutes}</span>
                    </span>
                    minutes
                </div>
                <div className="flex flex-col items-center w-16">
                    <span className="countdown font-mono text-5xl">
                        <span style={{ "--value": seconds } as React.CSSProperties} aria-live="polite" aria-label={`${seconds} seconds`}>{seconds}</span>
                    </span>
                    seconds
                </div>
            </div>
        </>
    )
}

export default TimeDisplay