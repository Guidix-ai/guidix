"use client";

import { useState, useEffect } from "react";

const colorTokens = {
  title: "#002A79",
  paragraph: "#6477B4",
  bgLight: "#F8F9FF",
  secondary100: "#E6F0FF",
  secondary200: "rgba(103,156,255,0.1)",
  secondary300: "#4F87FF",
  secondary400: "#2370FF",
  accent40: "rgba(35,112,255,0.4)",
  border200: "#E1E4EB",
  border300: "#F1F3F7",
};

export default function ComingSoon({ title = "Coming Soon" }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 23,
    minutes: 10,
    seconds: 56,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timerItems = [
    { value: String(timeLeft.days).padStart(2, "0"), label: "Days" },
    { value: String(timeLeft.hours).padStart(2, "0"), label: "Hours" },
    { value: String(timeLeft.minutes).padStart(2, "0"), label: "Minutes" },
    { value: String(timeLeft.seconds).padStart(2, "0"), label: "Seconds" },
  ];

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        backgroundColor: colorTokens.bgLight,
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* Background banner (absolute) */}
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 48px)",
            // maxWidth: 1392,
            minHeight: 100,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 4px 20px 0 #2370FF66",
            backgroundImage: "url('/header-banner.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
            width: "100%",
          }}
        />
      </div>

      {/* Content - placed after banner but visually on top via z-index */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1320,
          margin: "0 auto",
          padding: "120px 16px 60px", // top padding to clear the banner area visually
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Timer Row */}
        <div
          className="px-[16px] py-[20px]"
          style={{
            width: "100%",
            maxWidth: 900,
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "clamp(8px, 2vw, 24px)",
            backgroundColor: colorTokens.bgLight,
            borderRadius: 16,
            // padding: "clamp(8px, 2vw, 24px)",
            boxShadow:
              "0px 0px 2px rgba(0,19,88,0.15), 0px 4px 4px rgba(0,19,88,0.04), 0px 4px 16px rgba(0,19,88,0.04), inset 0px -4px 4px rgba(0,19,88,0.10)",
            outline: `1px solid ${colorTokens.border200}`,
            boxSizing: "border-box",
          }}
        >
          {timerItems.map((item, i) => (
            <div
              key={i}
              style={{
                flex: "1 1 0",
                maxWidth: 160,
                minWidth: 56,
                aspectRatio: "1 / 1",
                background: `linear-gradient(to bottom, ${colorTokens.secondary200}, ${colorTokens.secondary100})`,
                borderRadius: 14,
                boxShadow: "0px 4px 8px -2px rgba(35,112,255,0.15)",
                outline: `1px solid ${colorTokens.secondary200}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box",
                padding: 8,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: colorTokens.title,
                  fontSize: "clamp(28px, 6vw, 72px)",
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  color: colorTokens.paragraph,
                  fontSize: "clamp(12px, 2vw, 18px)",
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Text */}
        <div style={{ textAlign: "center", maxWidth: 520 }}>
          <h1
            style={{
              color: colorTokens.title,
              fontSize: "clamp(28px, 6vw, 48px)",
              fontWeight: 500,
              margin: 0,
            }}
          >
            Launching soon
          </h1>
          <p
            style={{
              color: colorTokens.paragraph,
              fontSize: "clamp(14px, 2vw, 18px)",
              lineHeight: 1.6,
              marginTop: 12,
            }}
          >
            Get ready for an amazing experience with {title}. We&apos;re
            building something special just for you.
          </p>
        </div>
      </div>
    </div>
  );
}
