// app/linkedin-optimizer/page.js
import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import ComingSoon from "@/components/ComingSoon";

import styles from "@/app/styles/pages/linkedin-optimizer.module.css";
export default function LinkedInOptimizerPage() {
  const optimizationAreas = [
    { area: "Profile Photo", score: 85, status: "good", suggestion: "Consider a more professional background" },
    { area: "Headline", score: 65, status: "needs-work", suggestion: "Add specific skills and value proposition" },
    { area: "Summary", score: 40, status: "poor", suggestion: "Write a compelling professional summary" },
    { area: "Experience", score: 78, status: "good", suggestion: "Add more quantifiable achievements" },
    { area: "Skills", score: 92, status: "excellent", suggestion: "Great skill variety and endorsements" },
    { area: "Recommendations", score: 30, status: "poor", suggestion: "Request recommendations from colleagues" }
  ];

  const profileSections = [
    { title: "Headline Optimization", description: "Create a compelling professional headline", icon: "✏️" },
    { title: "Summary Enhancement", description: "Write an engaging professional summary", icon: "📄" },
    { title: "Experience Boost", description: "Optimize your work experience descriptions", icon: "💼" },
    { title: "Skills Analysis", description: "Optimize your skills and get endorsements", icon: "🔧" }
  ];

  return (
    <DashboardLayout>
      <ComingSoon title="LinkedIn Optimizer" />

      {/* TEMPORARILY HIDDEN - Uncomment when ready */}
      {false && (
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl shadow-sm text-white p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">LinkedIn Optimizer</h1>
              <p className="text-blue-100 text-sm lg:text-base">
                Boost your professional presence and visibility
              </p>
            </div>
            <div className="mt-4 lg:mt-0 text-4xl lg:text-6xl">💼</div>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Optimization Score</h2>
              <p className="text-gray-600">Overall profile strength and completeness</p>
            </div>
            <div className="mt-4 lg:mt-0 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-1">65%</div>
              <div className="text-sm text-gray-500">Room for improvement</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {optimizationAreas.map((area, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{area.area}</h3>
                  <div className={`w-3 h-3 rounded-full ${
                    area.status === 'excellent' ? 'bg-green-500' :
                    area.status === 'good' ? 'bg-yellow-500' :
                    area.status === 'needs-work' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}></div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{area.score}%</div>
                <p className="text-sm text-gray-600">{area.suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Optimization Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {profileSections.map((section, index) => (
              <button key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left">
                <div className="text-2xl mb-3">{section.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-700">{section.title}</h3>
                <p className="text-sm text-gray-600">{section.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Content Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Keyword Optimization */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Keyword Optimization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Marketing</option>
                  <option>Other</option>
                </select>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Analyze Keywords
              </button>
            </div>
          </div>

          {/* Connection Strategy */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Connection Strategy</h2>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-1">Current Network</h3>
                <p className="text-2xl font-bold text-blue-600">387</p>
                <p className="text-sm text-gray-600">connections</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Suggested Actions</h3>
                <div className="text-sm space-y-1">
                  <p className="text-gray-600">• Connect with 5 industry professionals weekly</p>
                  <p className="text-gray-600">• Engage with posts from your network</p>
                  <p className="text-gray-600">• Share industry insights regularly</p>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Find Connections
              </button>
            </div>
          </div>
        </div>

        {/* Content Calendar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Calendar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">This Week</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">• Share an industry article</p>
                <p className="text-gray-600">• Post about recent project</p>
                <p className="text-gray-600">• Comment on 3 posts</p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Next Week</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">• Write thought leadership post</p>
                <p className="text-gray-600">• Share team achievement</p>
                <p className="text-gray-600">• Engage with industry hashtags</p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Content Ideas</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">• Career journey story</p>
                <p className="text-gray-600">• Industry predictions</p>
                <p className="text-gray-600">• Learning experiences</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Preview */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Analytics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">156</div>
              <div className="text-sm text-gray-600">Profile Views (This Week)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">23</div>
              <div className="text-sm text-gray-600">Search Appearances</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">8</div>
              <div className="text-sm text-gray-600">New Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">45</div>
              <div className="text-sm text-gray-600">Post Engagements</div>
            </div>
          </div>
        </div>
      </div>
      )}
    </DashboardLayout>
  );
}
