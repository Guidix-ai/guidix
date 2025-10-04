import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import ComingSoon from "@/components/ComingSoon";
import styles from "@/app/styles/pages/dashboard.module.css";

export default function DashboardPage() {
  const quickStats = [
    { label: "Active Applications", value: "12", change: "+3", trend: "up" },
    { label: "Profile Views", value: "156", change: "+24", trend: "up" },
    { label: "Interview Requests", value: "3", change: "+1", trend: "up" },
    { label: "Response Rate", value: "68%", change: "+5%", trend: "up" },
  ];

  const recentActivity = [
    {
      action: "Applied to Software Engineer at TechCorp",
      time: "2 hours ago",
      type: "application",
    },
    {
      action: "Completed mock interview session",
      time: "1 day ago",
      type: "interview",
    },
    {
      action: "Updated resume with new skills",
      time: "3 days ago",
      type: "resume",
    },
    {
      action: "LinkedIn profile optimized",
      time: "1 week ago",
      type: "linkedin",
    },
  ];

  return (
    <DashboardLayout>
      <ComingSoon title="Dashboard" />
      
      {/* TEMPORARILY HIDDEN - Uncomment when ready */}
      {false && (
        <div className={styles.dashboardContainer}>
          <div className={styles.dashboardHeader}>
            <div className={styles.dashboardHeaderContent}>
              <div>
                <h1 className={styles.dashboardTitle}>
                  Welcome back!
                </h1>
                <p className={styles.dashboardSubtitle}>
                  Here&apos;s what&apos;s happening with your job search today
                </p>
              </div>
              <div className={styles.dashboardIcon}>📊</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className={styles.quickStatsGrid}>
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className={styles.statCard}
              >
                <div className={styles.statHeader}>
                  <div className={styles.statValue}>
                    {stat.value}
                  </div>
                  <div
                    className={`${styles.statChange} ${
                      stat.trend === "up"
                        ? styles.statChangeUp
                        : styles.statChangeDown
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>
                <div className={styles.statLabel}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {activity.type === "application" && "📤"}
                      {activity.type === "interview" && "👥"}
                      {activity.type === "resume" && "📄"}
                      {activity.type === "linkedin" && "💼"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <a
                  href="/resume-builder"
                  className="block w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📄</span>
                    <span className="text-sm font-medium">Create Resume</span>
                  </div>
                </a>
                <a
                  href="/job-search"
                  className="block w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🔍</span>
                    <span className="text-sm font-medium">Search Jobs</span>
                  </div>
                </a>
                <a
                  href="/mock-interview"
                  className="block w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">👥</span>
                    <span className="text-sm font-medium">
                      Practice Interview
                    </span>
                  </div>
                </a>
                <a
                  href="/linkedin-optimizer"
                  className="block w-full p-3 text-left bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">💼</span>
                    <span className="text-sm font-medium">Optimize LinkedIn</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Progress Chart Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">
              Weekly Progress
            </h2>
            <div className="h-32 lg:h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm lg:text-base">
                Progress chart will be displayed here
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
