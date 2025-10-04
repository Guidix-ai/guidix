// app/mock-interview/page.js
import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import ComingSoon from "@/components/ComingSoon";

import styles from "@/app/styles/pages/mock-interview.module.css";
export default function MockInterviewPage() {
  const interviewTypes = [
    {
      type: "Technical",
      description: "Coding challenges and technical questions",
      icon: "💻",
      duration: "45-60 min",
    },
    {
      type: "Behavioral",
      description: "Situational and behavioral questions",
      icon: "💬",
      duration: "30-45 min",
    },
    {
      type: "System Design",
      description: "Architecture and design problems",
      icon: "🏢",
      duration: "60-90 min",
    },
    {
      type: "Leadership",
      description: "Management and leadership scenarios",
      icon: "👔",
      duration: "30-45 min",
    },
  ];

  const recentSessions = [
    {
      type: "Technical",
      score: 85,
      date: "2024-01-15",
      feedback: "Strong problem-solving skills",
    },
    {
      type: "Behavioral",
      score: 78,
      date: "2024-01-12",
      feedback: "Good communication, work on examples",
    },
    {
      type: "System Design",
      score: 72,
      date: "2024-01-10",
      feedback: "Consider scalability factors",
    },
  ];

  return (
    <DashboardLayout>
      <ComingSoon title="AI Mock Interview" />

      {/* TEMPORARILY HIDDEN - Uncomment when ready */}
      {false && (
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl shadow-sm text-white p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                AI Mock Interview
              </h1>
              <p className="text-orange-100 text-sm lg:text-base">
                Practice and improve your interview skills with AI
              </p>
            </div>
            <div className="mt-4 lg:mt-0 text-4xl lg:text-6xl">👥</div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Start New Interview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {interviewTypes.map((interview, index) => (
              <button
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-left"
              >
                <div className="text-2xl mb-3">{interview.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 hover:text-orange-700">
                  {interview.type}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {interview.description}
                </p>
                <span className="text-xs text-gray-500">
                  {interview.duration}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Practice Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Custom Interview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Custom Interview
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Role
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Frontend Developer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="e.g., Google, Microsoft"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option>Entry Level (0-2 years)</option>
                  <option>Mid Level (3-5 years)</option>
                  <option>Senior Level (6-10 years)</option>
                  <option>Lead/Principal (10+ years)</option>
                </select>
              </div>
              <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                Start Custom Interview
              </button>
            </div>
          </div>

          {/* Quick Practice */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Practice
            </h2>
            <div className="space-y-4">
              <button className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">⚡</span>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Random Questions
                    </h3>
                    <p className="text-sm text-gray-600">
                      Practice with random interview questions
                    </p>
                  </div>
                </div>
              </button>

              <button className="w-full p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🔄</span>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Retry Failed Questions
                    </h3>
                    <p className="text-sm text-gray-600">
                      Practice questions you struggled with
                    </p>
                  </div>
                </div>
              </button>

              <button className="w-full p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🏆</span>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Timed Challenge
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quick 15-minute practice session
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Practice Sessions
          </h2>
          <div className="space-y-4">
            {recentSessions.map((session, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {session.type} Interview
                    </h3>
                    <p className="text-gray-600 mb-2">{session.feedback}</p>
                    <span className="text-sm text-gray-500">
                      {session.date}
                    </span>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:text-right">
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        session.score >= 80
                          ? "bg-green-100 text-green-800"
                          : session.score >= 70
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      Score: {session.score}%
                    </div>
                    <div className="mt-2">
                      <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        Review Session
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Stats */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Your Progress
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">12</div>
              <div className="text-sm text-gray-600">Sessions Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">78%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">95</div>
              <div className="text-sm text-gray-600">Questions Practiced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">5h</div>
              <div className="text-sm text-gray-600">Total Practice Time</div>
            </div>
          </div>
        </div>
      </div>
      )}
    </DashboardLayout>
  );
}
