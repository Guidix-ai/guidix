"use client";
import React, { useState } from "react";
import styled from "styled-components";

const JobCardEnhanced = ({
  job = {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Mogo",
    companyType: "Apps · Finance · Public Company",
    location: "United States",
    remote: true,
    type: "Full-time",
    level: "New Grad, Entry Level",
    posted: "6 hours ago",
    applicants: 130,
    matchScore: 83,
    h1bSponsor: true,
    experienceMatch: 100,
    skillsMatch: 75,
    industryMatch: 41
  },
  onApply,
  onSave,
  onBlock,
  onAskOrion,
  isApplied = false,
  isSaved = false
}) => {
  const [showMatchDetails, setShowMatchDetails] = useState(false);

  const getMatchLevel = (score) => {
    if (score >= 80) return 'good';
    if (score >= 60) return 'fair';
    return 'poor';
  };

  const matchLevel = getMatchLevel(job.matchScore);

  return (
    <CardContainer
      onMouseEnter={() => setShowMatchDetails(true)}
      onMouseLeave={() => setShowMatchDetails(false)}
    >
      {showMatchDetails ? (
        // Match Details View
        <MatchDetailsContent>
          <DetailsHeader>Why This Job Is A Match</DetailsHeader>
          <DetailsDescription>
            This role aligns well with your experience level and core technical skills.
            The industry experience gap can be bridged through your strong foundation
            in related technologies and your proven ability to adapt quickly.
          </DetailsDescription>

          <CompatibilityGrid>
            <CompatibilityItem>
              <CompatibilityCircle $score={job.experienceMatch}>
                {job.experienceMatch}%
              </CompatibilityCircle>
              <CompatibilityLabel>Experience Level</CompatibilityLabel>
            </CompatibilityItem>
            <CompatibilityItem>
              <CompatibilityCircle $score={job.skillsMatch}>
                {job.skillsMatch}%
              </CompatibilityCircle>
              <CompatibilityLabel>Skills</CompatibilityLabel>
            </CompatibilityItem>
            <CompatibilityItem>
              <CompatibilityCircle $score={job.industryMatch}>
                {job.industryMatch}%
              </CompatibilityCircle>
              <CompatibilityLabel>Industry Experience</CompatibilityLabel>
            </CompatibilityItem>
          </CompatibilityGrid>
        </MatchDetailsContent>
      ) : (
        // Normal Job Card View
        <>
          <LeftSection>
            <CompanyLogo>
              {job.company.charAt(0)}
            </CompanyLogo>

            <JobInfo>
              <TimeBadge>{job.posted}</TimeBadge>
              <JobTitle>
                {job.title} <RemoteTag>(Remote)</RemoteTag>
              </JobTitle>
              <CompanyLine>
                {job.company} / {job.companyType}
              </CompanyLine>

              <IconRow>
                <IconItem>
                  📍 {job.location}
                </IconItem>
                <IconItem>
                  🌐 Remote
                </IconItem>
                <IconItem>
                  🕒 {job.type}
                </IconItem>
                <IconItem>
                  🎓 {job.level}
                </IconItem>
              </IconRow>

              <ApplicantCount>
                {job.applicants} applicants
              </ApplicantCount>
            </JobInfo>
          </LeftSection>

          <CenterSection>
            <AskOrionButton onClick={() => onAskOrion?.(job.id)}>
              <span>🤖</span>
              ASK ORION
            </AskOrionButton>

            <ActionButtons>
              <IconButton
                onClick={() => onSave?.(job.id)}
                $active={isSaved}
                aria-label="Save job"
              >
                {isSaved ? '❤️' : '🤍'}
              </IconButton>
              <IconButton
                onClick={() => onBlock?.(job.id)}
                aria-label="Block job"
              >
                🚫
              </IconButton>
            </ActionButtons>

            <ApplyButton
              onClick={() => onApply?.(job.id)}
              disabled={isApplied}
            >
              {isApplied ? 'APPLIED ✓' : 'APPLY NOW'}
            </ApplyButton>
          </CenterSection>

          <RightSection>
            <MatchScorePanel $matchLevel={matchLevel}>
              <MatchScoreCircle $matchLevel={matchLevel}>
                {job.matchScore}%
              </MatchScoreCircle>
              <MatchLabel>GOOD MATCH</MatchLabel>
              {job.h1bSponsor && (
                <SponsorInfo>
                  ✅ H1B Sponsor Likely
                </SponsorInfo>
              )}
            </MatchScorePanel>
          </RightSection>
        </>
      )}
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  min-height: 120px;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  width: 100%;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: 140px;
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
    gap: 16px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 2;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: row;
    width: 100%;
    flex: none;
  }
`;

const CompanyLogo = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 24px;
  flex-shrink: 0;
`;

const JobInfo = styled.div`
  flex: 1;
  min-width: 0;
  position: relative;
`;

const TimeBadge = styled.div`
  background: #E6F7F0;
  color: #047857;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 8px;
`;

const JobTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #000;
  margin: 0 0 4px 0;
  line-height: 1.2;
`;

const RemoteTag = styled.span`
  font-weight: 400;
  color: #6B7280;
`;

const CompanyLine = styled.div`
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 8px;
`;

const IconRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 6px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const IconItem = styled.div`
  font-size: 14px;
  color: #6B7280;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ApplicantCount = styled.div`
  font-size: 12px;
  color: #6B7280;
`;

const CenterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 0 16px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin: 0;
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const AskOrionButton = styled.button`
  border: 1px solid #D1D5DB;
  background: white;
  color: #374151;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: #9CA3AF;
    background: #F9FAFB;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #E5E7EB;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: #D1D5DB;
    background: #F9FAFB;
  }

  ${props => props.$active && `
    background: #FEE2E2;
    border-color: #FCA5A5;
  `}
`;

const ApplyButton = styled.button`
  background: #10B981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: #059669;
  }

  &:disabled {
    background: #9CA3AF;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    flex: 1;
    padding: 10px 16px;
    font-size: 14px;
  }
`;

const RightSection = styled.div`
  position: relative;
  flex-shrink: 0;

  @media (max-width: 768px) {
    align-self: center;
    margin-top: 12px;
  }
`;

const MatchScorePanel = styled.div`
  background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  min-width: 120px;
  max-width: 140px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
  }
`;

const MatchScoreCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: conic-gradient(
    ${props => {
      const score = parseInt(props.children) || 0;
      return `#10B981 0% ${score}%, #374151 ${score}% 100%`;
    }}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  color: white;
  font-weight: bold;
  font-size: 16px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: 50%;
    background: #1F2937;
  }

  &::after {
    content: '${props => props.children}';
    position: relative;
    z-index: 1;
  }
`;

const MatchLabel = styled.div`
  color: white;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
`;

const SponsorInfo = styled.div`
  color: white;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const MatchDetailsContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  text-align: center;
`;

const DetailsHeader = styled.h4`
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin: 0 0 12px 0;
`;

const DetailsDescription = styled.p`
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  margin: 0 0 20px 0;
  max-width: 600px;
`;

const CompatibilityGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 24px;
  }
`;

const CompatibilityItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const CompatibilityCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: conic-gradient(
    ${props => {
      const score = parseInt(props.$score) || 0;
      const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';
      return `${color} 0% ${score}%, #E5E7EB ${score}% 100%`;
    }}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    background: white;
  }

  &::after {
    content: '${props => props.$score}%';
    position: relative;
    z-index: 1;
    color: #374151;
  }
`;

const CompatibilityLabel = styled.div`
  font-size: 12px;
  color: #6B7280;
  font-weight: 500;
`;

export default JobCardEnhanced;