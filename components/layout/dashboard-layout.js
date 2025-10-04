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
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    href: "/",
  },
  {
    title: "AI Resume Builder",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    href: "/resume-builder",
  },
  {
    title: "AI Job Search",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    href: "/job-search",
  },
  {
    title: "AI Job Apply",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
    ),
    href: "/apply-job",
  },
  {
    title: "AI Job Tracker",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
    href: "/job-tracker",
  },
  {
    title: "AI Mock Interview",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    href: "/mock-interview",
  },
  {
    title: "LinkedIn Optimiser",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
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
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // TEMPORARILY COMMENTED OUT FOR DEVELOPMENT
    // Uncomment when backend is ready

    // // Check authentication
    // const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    // if (!isAuthenticated) {
    //   router.push('/login');
    // } else {
    //   setUserEmail(localStorage.getItem('userEmail') || 'User');
    // }

    // For development - set default user
    setUserEmail(localStorage.getItem('userEmail') || 'Developer');
  }, [router]);

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
    <div className="min-h-screen" style={{ backgroundColor: '#E9F1FF' }}>
      {/* Header - Full Width */}
      <header className="border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-30 h-16 w-full" style={{ backgroundColor: '#E9F1FF' }}>
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

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Image src="/guidix.ai logo.svg" alt="Guidix Logo" width={120} height={40} className="h-8 w-auto" />
            </div>
          </div>

          {/* Right: Upgrade Button and User */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Upgrade Button - Responsive text */}
            <button style={{
              display: 'inline-flex',
              padding: '8px 12px',
              alignItems: 'center',
              borderRadius: '8px',
              border: '1px solid rgba(35, 112, 255, 0.30)',
              background: 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
              boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
              color: '#FFFFFF',
              textAlign: 'center',
              textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '125%'
            }}>
              <svg
                className="w-3 h-3 inline mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 14l5-5 5 5z" />
              </svg>
              <span className="hidden sm:inline">Upgrade Now</span>
              <span className="sm:hidden">Upgrade</span>
            </button>

            {/* User Profile */}
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
                <p className="text-sm font-medium text-gray-900">{userEmail.split('@')[0] || 'User'}</p>
                <p className="text-xs text-gray-500">Premium Member</p>
              </div>
            </div>
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
        className={`fixed z-50 border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${collapsed ? "lg:w-16" : "lg:w-60"} ${
          // Mobile: full height and width
          "top-0 left-0 h-screen w-60 lg:top-16 lg:h-[calc(100vh-4rem)]"
        }`}
        style={{ backgroundColor: '#E9F1FF' }}
      >
        {/* Mobile Header with Logo - Only visible on mobile when sidebar is open */}
        <div className="px-4 py-4 border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image src="/guidix.ai logo.svg" alt="Guidix Logo" width={120} height={40} className="h-8 w-auto" />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
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
        </div>

        {/* Navigation */}
        <nav className="px-4 sm:px-6 pt-4 overflow-y-auto flex-1">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-2 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-white"
                      : "text-gray-700 hover:bg-white hover:text-gray-900"
                  }`}
                  style={isActive(item.href) ? { background: 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)' } : {}}
                  title={collapsed ? item.title : undefined}
                >
                  <div className={`flex items-center w-full ${
                    collapsed ? "justify-center" : "justify-between"
                  }`}>
                    <div className={`flex items-center ${
                      collapsed ? "" : "space-x-3"
                    }`}>
                      <span
                        className={`flex-shrink-0 ${
                          isActive(item.href) ? "text-white" : "text-black"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span
                          className={`font-medium text-xs ml-3 ${
                            isActive(item.href) ? "text-white" : ""
                          }`}
                        >
                          {item.title}
                        </span>
                      )}
                    </div>
                    {!collapsed && (
                      <svg
                        className={`w-4 h-4 flex-shrink-0 ${
                          isActive(item.href) ? "text-white" : "text-gray-400"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Items */}
        <div className="mt-auto px-4 sm:px-6 pt-4 border-t border-gray-200">
          <ul className="space-y-1 mb-3">
            {footerItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center px-2 py-1.5 rounded-lg text-gray-700 hover:bg-white hover:text-gray-900 transition-all duration-200"
                  title={collapsed ? item.title : undefined}
                >
                  <div className={`flex items-center w-full ${
                    collapsed ? "justify-center" : "justify-between"
                  }`}>
                    <div className={`flex items-center ${
                      collapsed ? "" : "space-x-3"
                    }`}>
                      <span className={`text-gray-600 flex-shrink-0 ${
                        collapsed ? "" : ""
                      }`}>{item.icon}</span>
                      {!collapsed && (
                        <span className="font-medium text-xs ml-3">
                          {item.title}
                        </span>
                      )}
                    </div>
                    {!collapsed && (
                      <svg
                        className="w-4 h-4 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center px-2 py-2 rounded-lg text-gray-700 hover:bg-white hover:text-red-600 transition-all duration-200 w-full mb-3"
          >
            <div className={`flex items-center w-full ${
              collapsed ? "justify-center" : "justify-between"
            }`}>
              <div className={`flex items-center ${
                collapsed ? "" : "space-x-3"
              }`}>
                <svg
                  className="w-4 h-4 flex-shrink-0 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                {!collapsed && (
                  <span className="font-medium text-xs ml-3">Logout</span>
                )}
              </div>
            </div>
          </button>

          {/* Collapse Button */}
          {!collapsed ? (
            <button
              onClick={() => setCollapsed(true)}
              className="hidden lg:flex items-center space-x-3 w-full px-2 py-2.5 text-gray-700 hover:bg-white rounded-lg transition-colors mb-4"
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
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
              <span className="text-xs font-medium">Collapse</span>
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(false)}
              className="hidden lg:flex items-center justify-center w-full px-2 py-2.5 text-gray-700 hover:bg-white rounded-lg transition-colors mb-4"
              title="Expand sidebar"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
        className={`transition-all duration-300 lg:pt-0 ${
          collapsed ? "lg:ml-16" : "lg:ml-60"
        }`}
      >
        {/* Page Content */}
        <main className="p-4 sm:p-6 min-h-[calc(100vh-4rem)] lg:min-h-screen">{children}</main>
      </div>
    </div>
  );
}
