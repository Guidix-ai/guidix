"use client";
import React, { useState, useEffect } from "react";
import styles from "./JobCardNew.module.css";

const JobCardNew = ({ job, onApply, onSave, onShare, onDismiss, isApplied = false, isSaved = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Handle keyboard events for match score badge
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setShowTooltip(!showTooltip);
    } else if (e.key === 'Escape') {
      setShowTooltip(false);
    }
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowTooltip(false);
    };

    if (showTooltip) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showTooltip]);

  const getCompanyColor = (company) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    const hash = company.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getMatchLevel = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'great';
    if (score >= 70) return 'good';
    return 'fair';
  };

  const getMatchLabel = (score) => {
    if (score >= 95) return 'Perfect';
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Great';
    if (score >= 70) return 'Good';
    return 'Fair';
  };

  const handleApply = () => {
    window.open(`https://example.com/jobs/${job.id}`, '_blank');
    onApply?.(job.id);
  };

  const matchLevel = getMatchLevel(job.matchScore);

  return (
    <div
      className={`${styles.jobCard} ${job.isUrgent ? styles.urgent : ''}`}
      role="article"
      aria-label={`Job posting: ${job.title} at ${job.company}`}
    >
      <div className={styles.cardHeader}>
        <div className={styles.companySection}>
          <div
            className={styles.companyLogo}
            style={{ background: getCompanyColor(job.company) }}
          >
            {job.company.charAt(0)}
          </div>
          <div className={styles.jobInfo}>
            <h3 className={styles.jobTitle}>{job.title}</h3>
            <p className={styles.companyName}>{job.company}</p>
            <div className={styles.locationSalary}>
              <span className={styles.infoTag}>📍 {job.location}</span>
              <span className={styles.infoTag}>💰 {job.salary}</span>
              <span className={styles.infoTag}>⏰ {job.posted}</span>
            </div>
          </div>
        </div>

        <div className={styles.matchScoreContainer}>
          <div
            className={`${styles.matchScoreBadge} ${styles[`matchScoreBadge${matchLevel.charAt(0).toUpperCase() + matchLevel.slice(1)}`]}`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(!showTooltip);
            }}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`${job.matchScore}% match score. Press to see detailed compatibility breakdown`}
            aria-expanded={showTooltip}
            aria-describedby={`tooltip-${job.id}`}
          >
            {job.matchScore}%
          </div>
          <div className={`${styles.matchLabel} ${styles[`matchLabel${matchLevel.charAt(0).toUpperCase() + matchLevel.slice(1)}`]}`}>
            {getMatchLabel(job.matchScore)}
          </div>

          <div
            className={`${styles.matchScoreTooltip} ${showTooltip ? styles.matchScoreTooltipShow : ''}`}
            role="tooltip"
            id={`tooltip-${job.id}`}
            aria-live="polite"
          >
            <div className={styles.tooltipHeader}>Compatibility Breakdown</div>
            <div className={styles.compatibilityList}>
              <div className={styles.compatibilityItem}>
                <span className={styles.compatibilityLabel}>Experience Level</span>
                <span className={`${styles.compatibilityScore} ${styles[`compatibilityScore${getMatchLevel(job.skillsMatch).charAt(0).toUpperCase() + getMatchLevel(job.skillsMatch).slice(1)}`]}`}>
                  {job.skillsMatch}%
                </span>
              </div>
              <div className={styles.compatibilityItem}>
                <span className={styles.compatibilityLabel}>Skills Match</span>
                <span className={`${styles.compatibilityScore} ${styles[`compatibilityScore${getMatchLevel(job.skillsMatch).charAt(0).toUpperCase() + getMatchLevel(job.skillsMatch).slice(1)}`]}`}>
                  {job.skillsMatch}%
                </span>
              </div>
              <div className={styles.compatibilityItem}>
                <span className={styles.compatibilityLabel}>Culture Fit</span>
                <span className={`${styles.compatibilityScore} ${styles[`compatibilityScore${getMatchLevel(job.cultureMatch).charAt(0).toUpperCase() + getMatchLevel(job.cultureMatch).slice(1)}`]}`}>
                  {job.cultureMatch}%
                </span>
              </div>
              <div className={styles.compatibilityItem}>
                <span className={styles.compatibilityLabel}>Salary Alignment</span>
                <span className={`${styles.compatibilityScore} ${styles[`compatibilityScore${getMatchLevel(job.salaryMatch).charAt(0).toUpperCase() + getMatchLevel(job.salaryMatch).slice(1)}`]}`}>
                  {job.salaryMatch}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tagsContainer}>
        <span className={`${styles.tag} ${styles.tagJobType}`}>{job.type}</span>
        {job.location.toLowerCase().includes('remote') && (
          <span className={`${styles.tag} ${styles.tagRemote}`}>Remote</span>
        )}
        {job.isUrgent && (
          <span className={`${styles.tag} ${styles.tagUrgent}`}>Urgent Hiring</span>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div>
          <span className={styles.postedTime}>{job.posted}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className={styles.actionButtons}>
            <button
              className={`${styles.actionButton} ${isSaved ? styles.actionButtonSaved : ''}`}
              onClick={() => onSave?.(job.id)}
              title="Save job"
              aria-label="Save this job"
            >
              {isSaved ? '❤️' : '🤍'}
            </button>
            <button
              className={styles.actionButton}
              onClick={() => onShare?.(job)}
              title="Share job"
              aria-label="Share this job"
            >
              📤
            </button>
            <button
              className={styles.actionButton}
              onClick={() => onDismiss?.(job.id)}
              title="Dismiss job"
              aria-label="Dismiss this job"
            >
              ✕
            </button>
          </div>
          <button
            className={styles.applyButton}
            onClick={handleApply}
            disabled={isApplied}
            aria-label={isApplied ? 'Already applied to this job' : 'Apply to this job'}
          >
            {isApplied ? 'Applied ✓' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCardNew;