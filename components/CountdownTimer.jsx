"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeCard = ({ value, label }) => (
    <div
style={{
  flex: "1 1 0",
  maxWidth: "140px",
  minWidth: "90px",
  height: "95px",

  /* Background gradient */
  background: "linear-gradient(180deg, #EDF3FF 0%, #F6F9FF 100%)",

  /* Rounded corners */
  borderRadius: "20px",

  /* Very light outer outline */
  outline: "1px solid rgba(180, 200, 255, 0.35)",

  /* Slight bottom border highlight */
  borderBottom: "2px solid rgba(130, 160, 255, 0.45)",

  /* Soft inner-ish shadow */
  boxShadow: "0px 4px 14px rgba(35, 112, 255, 0.18)",

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",

  boxSizing: "border-box",
}}

    >
      <div
        style={{
          fontSize: "64px",
          fontWeight: "700",
          color: "#1e293b",
          lineHeight: "1",
          marginBottom: "8px",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <div
        style={{
          fontSize: "16px",
          color: "#64748b",
          fontWeight: "500",
        }}
      >
        {label}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        width: "fit-content",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <TimeCard value={timeLeft.days} label="Days" />
      <TimeCard value={timeLeft.hours} label="Hours" />
      <TimeCard value={timeLeft.minutes} label="Minutes" />
      <TimeCard value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}
