import React from 'react'

const TimeDisplayStatic = ({
  totalHours,
  totalMinutes,
  totalSeconds,
  fontSize = "text-4xl",
}: {
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  fontSize?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <span className={`countdown font-mono ${fontSize}`}>
        <span style={{ "--value": totalHours } as React.CSSProperties} aria-live="polite" aria-label="totalHours">{totalHours}</span>
        h
        <span style={{ "--value": totalMinutes } as React.CSSProperties} aria-live="polite" aria-label="totalMinutes">{totalMinutes}</span>
        m
        <span style={{ "--value": totalSeconds } as React.CSSProperties} aria-live="polite" aria-label="totalSeconds">{totalSeconds}</span>
        s
      </span>
      </div>
  )
}

export default TimeDisplayStatic