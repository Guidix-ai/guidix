'use client'
import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import ComingSoon from "@/components/ComingSoon";
import { JobTracker } from "@/components/JobTracker";
import styles from "@/app/styles/pages/job-tracker.module.css";

export default function JobTrackerPage() {
  return (
    <DashboardLayout>
      <ComingSoon title="AI Job Tracker" />

      {/* TEMPORARILY HIDDEN - Uncomment when ready */}
      {false && (
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Minimal Header */}
        <div className="relative overflow-hidden rounded-2xl shadow-sm border border-gray-100"
             style={{background: 'linear-gradient(135deg, var(--brand-secondary-lightest) 0%, var(--brand-secondary-light) 100%)'}}>
          <div className="relative p-8 lg:p-10">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
                 style={{background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)'}}></div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                       style={{background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))'}}>
                    <span className="text-white text-lg">🎯</span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold" style={{color: 'var(--brand-primary)'}}>
                    Job Tracker
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">
                  Track and manage your job applications with style
                </p>
              </div>

              {/* Clean stats preview */}
              <div className="mt-6 lg:mt-0 flex gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 text-center border border-white/40">
                  <div className="text-lg font-bold" style={{color: 'var(--brand-primary)'}}>3</div>
                  <div className="text-xs text-gray-600">Active</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 text-center border border-white/40">
                  <div className="text-lg font-bold text-green-600">1</div>
                  <div className="text-xs text-gray-600">Interview</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <JobTracker />
      </div>
      )}
    </DashboardLayout>
  );
}