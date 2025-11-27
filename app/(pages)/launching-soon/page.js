"use client";

import { useState } from "react";
import CountdownTimer from "@/components/CountdownTimer";

export default function LaunchingSoon() {
  const [email, setEmail] = useState("");

  // Set your target launch date here
  const launchDate = new Date("2025-12-31T23:59:59").toISOString();

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Add your subscription logic here
    console.log("Subscribed with email:", email);
    alert("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#F5F7FB",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
        }}
      >
        {/* Countdown Timer */}
        <CountdownTimer targetDate={launchDate} />

        {/* Launching Soon Content */}
        <div
          style={{
            textAlign: "center",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <h1
            style={{
              color: "#1F2937",
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: "700",
              marginBottom: "4px",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            Launching soon
          </h1>

          <p
            style={{
              color: "#6B7280",
              fontSize: "clamp(12px, 2vw, 14px)",
              lineHeight: "1.6",
              marginBottom: "12px",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            We're working hard to bring you something amazing. Subscribe to get
            notified when we launch!
          </p>

          {/* Email Subscription Form */}
          <form
            onSubmit={handleSubscribe}
            style={{
              display: "flex",
              gap: "8px",
              width: "100%",
              maxWidth: "400px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                flex: "1 1 200px",
                minWidth: "150px",
                padding: "10px 14px",
                fontSize: "14px",
                borderRadius: "6px",
                border: "1px solid #E5E7EB",
                outline: "none",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#6366F1";
                e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E5E7EB";
                e.target.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 24px",
                fontSize: "14px",
                fontWeight: "600",
                color: "white",
                backgroundColor: "#6366F1",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                transition: "all 0.2s ease",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#4F46E5";
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#6366F1";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
