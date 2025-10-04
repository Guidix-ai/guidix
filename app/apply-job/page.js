// app/apply-job/page.js
import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import ComingSoon from "@/components/ComingSoon";

import styles from "@/app/styles/pages/apply-job.module.css";
export default function ApplyJobPage() {
  const applicationMethods = [
    {
      title: "Bulk Apply",
      description: "Apply to multiple jobs that match your criteria",
      icon: "🚀",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    {
      title: "Smart Apply",
      description: "AI analyzes and applies to best-matching positions",
      icon: "🤖",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    },
    {
      title: "Custom Apply",
      description: "Personalized applications with tailored cover letters",
      icon: "✍️",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
    },
    {
      title: "One-Click Apply",
      description: "Quick applications using saved templates",
      icon: "⚡",
      color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
    },
  ];

  const recentApplications = [
    {
      company: "TechCorp",
      position: "Senior Developer",
      status: "Applied",
      date: "2024-01-15",
      method: "Smart Apply",
    },
    {
      company: "StartupXYZ",
      position: "Full Stack Engineer",
      status: "In Review",
      date: "2024-01-14",
      method: "Custom Apply",
    },
    {
      company: "InnovateNow",
      position: "Frontend Developer",
      status: "Applied",
      date: "2024-01-13",
      method: "One-Click Apply",
    },
  ];

  return (
    <DashboardLayout>
      <ComingSoon title="AI Job Apply" />

      {/* TEMPORARILY HIDDEN - Uncomment when ready */}
      {false && (
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl shadow-sm text-white p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                AI Job Apply
              </h1>
              <p className="text-pink-100 text-sm lg:text-base">
                Automate your job applications with intelligent targeting
              </p>
            </div>
            <div className="mt-4 lg:mt-0 text-4xl lg:text-6xl">📤</div>
          </div>
        </div>

        {/* Application Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Choose Application Method
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {applicationMethods.map((method, index) => (
              <button
                key={index}
                className={`p-4 border-2 rounded-lg transition-all duration-200 text-left ${method.color}`}
              >
                <div className="text-2xl mb-3">{method.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Apply Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Criteria */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Application Criteria
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Titles
                </label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer, Frontend Developer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locations
                </label>
                <input
                  type="text"
                  placeholder="e.g., Remote, San Francisco, New York"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Salary
                  </label>
                  <input
                    type="text"
                    placeholder="$80,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Salary
                  </label>
                  <input
                    type="text"
                    placeholder="$120,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                  <option>Any Level</option>
                  <option>Entry Level</option>
                  <option>Mid Level</option>
                  <option>Senior Level</option>
                  <option>Executive Level</option>
                </select>
              </div>
            </div>
          </div>

          {/* Application Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Application Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applications per Day
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                  <option>5 applications</option>
                  <option>10 applications</option>
                  <option>20 applications</option>
                  <option>50 applications</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume Template
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                  <option>Default Resume</option>
                  <option>Technical Resume</option>
                  <option>Creative Resume</option>
                  <option>Executive Resume</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter Template
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                  <option>Standard Template</option>
                  <option>Technical Template</option>
                  <option>Creative Template</option>
                  <option>No Cover Letter</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="auto-follow" className="rounded" />
                <label htmlFor="auto-follow" className="text-sm text-gray-700">
                  Auto follow up after 1 week
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="smart-matching"
                  className="rounded"
                  defaultChecked
                />
                <label
                  htmlFor="smart-matching"
                  className="text-sm text-gray-700"
                >
                  Use AI smart matching
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Start Application Button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Ready to Start?
          </h2>
          <p className="text-gray-600 mb-6">
            AI will find and apply to jobs matching your criteria
          </p>
          <button className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-3 rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-200 font-medium text-lg shadow-sm">
            Start Auto-Apply Campaign
          </button>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Auto-Applications
          </h2>
          <div className="space-y-4">
            {recentApplications.map((app, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-pink-300 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {app.position}
                    </h3>
                    <p className="text-gray-600 mb-2">{app.company}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded ${
                          app.status === "In Review"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {app.status}
                      </span>
                      <span className="text-gray-500">{app.date}</span>
                      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                        {app.method}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                      View Application
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Campaign Performance
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600 mb-1">47</div>
              <div className="text-sm text-gray-600">Applications Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600 mb-1">12</div>
              <div className="text-sm text-gray-600">Responses Received</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600 mb-1">3</div>
              <div className="text-sm text-gray-600">Interview Invites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600 mb-1">25%</div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
          </div>
        </div>
      </div>
      )}
    </DashboardLayout>
  );
}
