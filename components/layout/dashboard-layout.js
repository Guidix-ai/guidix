// components/layout/dashboard-layout.js
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { logout as authLogout } from "@/utils/auth";

const sidebarItems = [
  {
    title: "Home",
    icon: <Image src="/home.svg" alt="Home" width={16} height={16} />,
    href: "/dashboard",
  },
  {
    title: "AI Resume Builder",
    icon: (
      <Image
        src="/resumebuilder.svg"
        alt="Resume Builder"
        width={16}
        height={16}
      />
    ),
    href: "/resume-builder",
  },
  {
    title: "AI Job Search",
    icon: (
      <Image src="/jobsearch.svg" alt="Job Search" width={16} height={16} />
    ),
    href: "/job-search",
  },
  {
    title: "AI Job Apply",
    icon: <Image src="/jobapply.svg" alt="Job Apply" width={16} height={16} />,
    href: "/apply-job",
  },
  {
    title: "AI Job Tracker",
    icon: (
      <Image src="/jobtracker.svg" alt="Job Tracker" width={16} height={16} />
    ),
    href: "/job-tracker",
  },
  {
    title: "AI Mock Interview",
    icon: (
      <Image
        src="/mockinterview.svg"
        alt="Mock Interview"
        width={16}
        height={16}
      />
    ),
    href: "/mock-interview",
  },
  {
    title: "LinkedIn Optimizer",
    icon: (
      <Image
        src="/linkedinoptimiser.svg"
        alt="LinkedIn Optimizer"
        width={16}
        height={16}
      />
    ),
    href: "/linkedin-optimizer",
  },
];

// const footerItems = [
//   {
//     title: "Suggest a Feature",
//     icon: (
//       <svg
//         className="w-4 h-4"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
//         />
//       </svg>
//     ),
//     href: "/suggest-feature",
//   },
//   {
//     title: "Report a Bug",
//     icon: (
//       <svg
//         className="w-4 h-4"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.644-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
//         />
//       </svg>
//     ),
//     href: "/report-bug",
//   },
// ];

const footerItems = [];

export function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if access token exists in localStorage
    const accessToken = localStorage.getItem("access_token");
    const authenticated = !!accessToken;
    setIsAuthenticated(authenticated);

    if (authenticated) {
      // Load user name and email from localStorage
      setUserName(localStorage.getItem("userName") || "User");
      setUserEmail(localStorage.getItem("userEmail") || "");
    }
  }, [router]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await authLogout();
  };

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E9F1FF" }}>
      {/* Header - Full Width */}
      <header
        className="px-4 sm:px-6 py-4 sticky top-0 z-30 h-16 w-full relative"
        style={{
          backgroundColor: "rgba(233, 241, 255, 0.8)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            backgroundColor: "#E1E4ED",
            marginLeft: isDesktop ? "272px" : "0",
          }}
        ></div>
        <div className="flex items-center justify-between w-full h-full">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Logo - Hidden on desktop, shown on mobile */}
            <div className="lg:hidden flex items-center space-x-2">
              <Image
                src="/guidix.ai logo.svg"
                alt="Guidix Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
          </div>

          {/* Right: Upgrade Button and User */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Upgrade Button - Responsive text */}

            <div
              className="px-[0.15rem] py-[0.15rem] rounded-xl"
              style={{ backgroundColor: "rgba(35, 112, 255, 0.3)" }}
            >
              <div
                className="px-[0.15rem] py-[0.15rem] rounded-xl"
                style={{ backgroundColor: "rgba(35, 112, 255, 0.3)" }}
              >
                <button
                  style={{
                    display: "inline-flex",
                    padding: "10px 16px",
                    alignItems: "center",
                    borderRadius: "10px",
                    // border: "1px solid rgba(35, 112, 255, 0.30)",
                    background:
                      "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
                    boxShadow:
                      "0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset",
                    color: "#FFFFFF",
                    textAlign: "center",
                    textShadow:
                      "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "125%",
                    gap: "0.3rem",
                  }}
                >
                  <Image
                    src="/upgrade-icon.svg"
                    alt="Upgrade"
                    width={14}
                    height={14}
                  />
                  <span className="hidden sm:inline text-md">Upgrade Now</span>
                  <span className="sm:hidden">Upgrade</span>
                </button>
              </div>
            </div>

            {/* User Profile */}
            {isAuthenticated && (
              <div className="relative flex items-center space-x-2 group">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-orange-500 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="hidden lg:block">
                  <p
                    className="text-sm font-medium text-gray-900"
                    style={{
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userName || "User"}
                  </p>
                  <p
                    className="text-xs text-gray-500"
                    style={{
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userEmail || ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Below Header on Desktop, Full Height on Mobile */}
      <div
        className={`fixed z-50 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${collapsed ? "lg:w-16" : ""} ${
          // Mobile: full height and width
          "top-0 h-screen"
        }`}
        style={{
          display: "flex",
          backgroundColor: "#FFFFFF",
          width: isDesktop ? (collapsed ? "64px" : "240px") : "240px",
          borderRadius: "12px",
          padding: collapsed ? "12px" : "16px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
          boxShadow: "0 4px 8px -2px rgba(0, 19, 88, 0.10)",
          overflow: "hidden",
          left: isDesktop ? "16px" : "0",
          top: isDesktop ? "16px" : "0",
          height: isDesktop ? "calc(100vh - 32px)" : "100vh",
        }}
      >
        {/* Logo Section */}
        {!collapsed && (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Image
                src="/guidix.ai logo.svg"
                alt="Guidix Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
              style={{
                padding: "6px",
                borderRadius: "8px",
                color: "#6477B4",
                backgroundColor: "transparent",
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Logo Section - Collapsed */}
        {collapsed && (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <Image
              src="/sidebar_collapse_icon.svg"
              alt="Guidix Logo"
              width={20}
              height={20}
              className="h-8 w-8"
            />
          </div>
        )}

        {/* Navigation */}
        <nav
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            flex: "1 1 auto",
            minHeight: 0,
            overflowY: "auto",
          }}
        >
          <ul style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center rounded-lg transition-none"
                  style={
                    isActive(item.href)
                      ? {
                          background:
                            "linear-gradient(180deg, #679CFF 0%, #2370FF 100%)",
                          padding: "8px 12px",
                          color: "#FFFFFF",
                          borderRadius: "8px",
                          border: "1px solid rgba(35, 112, 255, 0.30)",
                          boxShadow:
                            "0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset",
                          textShadow:
                            "0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)",
                          transition: "none",
                        }
                      : {
                          padding: "8px 12px",
                          color: "#6477B4",
                          backgroundColor: "transparent",
                          borderRadius: "8px",
                          border: "1px solid transparent",
                          transition: "none",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.backgroundColor = "#F0F4FA";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                  title={collapsed ? item.title : undefined}
                >
                  {!collapsed && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      <span
                        className="flex-shrink-0"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          filter: isActive(item.href) ? "brightness(0) invert(1)" : "none",
                          opacity: 1,
                          backgroundColor: "transparent",
                          mixBlendMode: "normal",
                        }}
                      >
                        {item.icon}
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          fontWeight: 400,
                          lineHeight: "125%",
                          letterSpacing: "-0.24px",
                          color: isActive(item.href) ? "#FFFFFF" : "#6477B4",
                        }}
                      >
                        {item.title}
                      </span>
                    </div>
                  )}
                  {collapsed && (
                    <span
                      className="flex-shrink-0"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        filter: isActive(item.href) ? "brightness(0) invert(1)" : "none",
                        opacity: 1,
                        backgroundColor: "transparent",
                        mixBlendMode: "normal",
                      }}
                    >
                      {item.icon}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Items */}
        <div
          className="mt-auto"
          style={{
            paddingTop: "8px",
            gap: "8px",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {footerItems.length > 0 && (
            <ul
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              {footerItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center rounded-lg"
                    style={{
                      padding: "8px 12px",
                      color: "#6477B4",
                      backgroundColor: "transparent",
                      borderRadius: "8px",
                      border: "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F0F4FA";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    title={collapsed ? item.title : undefined}
                  >
                    {!collapsed && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "100%",
                        }}
                      >
                        <span
                          className="flex-shrink-0"
                          style={{
                            color: "#2370FF",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "14px",
                          }}
                        >
                          {item.icon}
                        </span>
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
                            fontWeight: 400,
                            lineHeight: "125%",
                            letterSpacing: "-0.24px",
                            color: "#6477B4",
                          }}
                        >
                          {item.title}
                        </span>
                      </div>
                    )}
                    {collapsed && (
                      <span
                        className="flex-shrink-0"
                        style={{
                          color: "#2370FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Auth Buttons - Show Logout if authenticated, Login/Signup if not */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center rounded-lg w-full"
              style={{
                padding: "8px 12px",
                color: "#6477B4",
                backgroundColor: "transparent",
                borderRadius: "8px",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F0F4FA";
                e.currentTarget.style.color = "#EF4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#6477B4";
              }}
            >
              {!collapsed && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: "inherit", fontSize: "14px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 400,
                      lineHeight: "125%",
                      letterSpacing: "-0.24px",
                      color: "inherit",
                    }}
                  >
                    Logout
                  </span>
                </div>
              )}
              {collapsed && (
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: "inherit" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              )}
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                width: "100%",
              }}
            >
              <button
                onClick={() => router.push("/login")}
                className="flex items-center rounded-lg w-full"
                style={{
                  padding: "8px 12px",
                  color: "#6477B4",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F0F4FA";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {!collapsed && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                    }}
                  >
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        fontWeight: 400,
                        lineHeight: "125%",
                        letterSpacing: "-0.24px",
                        color: "#6477B4",
                      }}
                    >
                      Login
                    </span>
                  </div>
                )}
                {collapsed && (
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="flex items-center rounded-lg w-full"
                style={{
                  padding: "8px 12px",
                  color: "#6477B4",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F0F4FA";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {!collapsed && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                    }}
                  >
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        fontWeight: 400,
                        lineHeight: "125%",
                        letterSpacing: "-0.24px",
                        color: "#6477B4",
                      }}
                    >
                      Signup
                    </span>
                  </div>
                )}
                {collapsed && (
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Collapse Button */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="hidden lg:flex items-center w-full rounded-lg"
              style={{
                padding: "8px 12px",
                color: "#6477B4",
                backgroundColor: "transparent",
                borderRadius: "8px",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F0F4FA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                }}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: "inherit", fontSize: "14px" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "125%",
                    letterSpacing: "-0.24px",
                    color: "inherit",
                  }}
                >
                  Collapse
                </span>
              </div>
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="hidden lg:flex items-center justify-center w-full rounded-lg"
              style={{
                padding: "8px 12px",
                color: "#6477B4",
                backgroundColor: "transparent",
                borderRadius: "8px",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F0F4FA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              title="Expand sidebar"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "inherit" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          paddingTop: "16px",
          paddingRight: "16px",
          paddingBottom: "16px",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @media (min-width: 1024px) {
            .main-content-wrapper {
              margin-left: ${collapsed ? "96px" : "272px"} !important;
            }
          }
        `,
          }}
        />
        <div className="main-content-wrapper">
          {/* Page Content */}
          <main
            style={{
              display: "flex",
              padding: "24px",
              flexDirection: "column",
              alignItems: "stretch",
              gap: "24px",
              borderRadius: "12px",
              background: "#FFF",
              boxShadow: "0 4px 8px -2px rgba(0, 19, 88, 0.10)",
              width: "100%",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
