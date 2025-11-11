import React from 'react'

const TimeDisplay = ({
    hours,
    minutes,
    seconds,
}: {
    hours: number;
    minutes: number;
    seconds: number;
}) => {

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