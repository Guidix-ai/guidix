import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Briefcase, Target, Clock } from "lucide-react";
import styles from "@/app/styles/components/InsightsCard.module.css";

export function InsightsCard() {
  // Mock data - replace with real user data
  const insights = {
    recommendedJobs: 12,
    applicationsThisWeek: 5,
    upcomingInterviews: 2,
    profileViews: 34
  };

  return (
    <Card className={styles.insightsCard}>
      <CardContent className={styles.cardContent}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <TrendingUp className={styles.headerIcon} />
          </div>
          <h3 className={styles.title}>Your Insights</h3>
        </div>

        <div className={styles.insightsGrid}>
          <div className={styles.insightItem}>
            <div className={styles.insightIconContainer}>
              <Briefcase className={styles.insightIcon} />
            </div>
            <div className={styles.insightContent}>
              <p className={styles.insightValue}>{insights.recommendedJobs}</p>
              <p className={styles.insightLabel}>Recommended Jobs</p>
            </div>
          </div>

          <div className={styles.insightItem}>
            <div className={styles.insightIconContainer}>
              <Target className={styles.insightIcon} />
            </div>
            <div className={styles.insightContent}>
              <p className={styles.insightValue}>{insights.applicationsThisWeek}</p>
              <p className={styles.insightLabel}>Applications This Week</p>
            </div>
          </div>

          <div className={styles.insightItem}>
            <div className={styles.insightIconContainer}>
              <Clock className={styles.insightIcon} />
            </div>
            <div className={styles.insightContent}>
              <p className={styles.insightValue}>{insights.upcomingInterviews}</p>
              <p className={styles.insightLabel}>Upcoming Interviews</p>
            </div>
          </div>

          <div className={styles.insightItem}>
            <div className={styles.insightIconContainer}>
              <TrendingUp className={styles.insightIcon} />
            </div>
            <div className={styles.insightContent}>
              <p className={styles.insightValue}>{insights.profileViews}</p>
              <p className={styles.insightLabel}>Profile Views</p>
            </div>
          </div>
        </div>

        <div className={styles.recommendation}>
          <p className={styles.recommendationText}>
            Based on your profile, we found <span className={styles.highlight}>{insights.recommendedJobs} new jobs</span> that match your skills and preferences.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
