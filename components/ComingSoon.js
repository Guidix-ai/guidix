'use client'

import { useState, useEffect } from 'react'

const colorTokens = {
  title: "#002A79",
  paragraph: "#6D7586",
  bgLight: "#F8F9FF",
  secondary100: "#E6F0FF",
  secondary200: "rgba(103,156,255,0.1)",
  secondary300: "#4F87FF",
  secondary400: "#2370FF",
  secondary600: "#2370FF",
  secondary700: "#1B54CA",
  accent40: "rgba(35,112,255,0.4)",
  border100: "#C7D6ED",
  border200: "#E1E4EB",
  border300: "#F1F3F7",
  titleLight: "#FFFFFF",
};

const ComingSoon = ({ title = "Coming Soon" }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 23,
    minutes: 10,
    seconds: 56
  });

  const [email, setEmail] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: colorTokens.bgLight,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
      overflow: 'auto'
    }}>
      {/* Main Content */}
      <div style={{
        width: '100%',
        padding: '80px 0',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingTop: 0
      }}>
        {/* Background Card */}
        <div style={{
          width: 'calc(100% - 48px)',
          maxWidth: '1392px',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: 0,
          backgroundImage: 'url(/header-banner.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100px',
          boxShadow: '0 4px 20px 0 #2370FF66',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
        </div>

        {/* Content Container */}
        <div style={{
          width: '100%',
          maxWidth: 1320,
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Countdown Timer */}
          <div style={{
            padding: 24,
            backgroundColor: colorTokens.bgLight,
            borderRadius: 24,
            boxShadow: '0px 0px 2px 0px rgba(0,19,88,0.15), 0px 4px 4px 0px rgba(0,19,88,0.04), 0px 4px 16px 0px rgba(0,19,88,0.04), inset 0px -4px 4px 0px rgba(0,19,88,0.10)',
            outline: '1px solid',
            outlineColor: colorTokens.border200,
            outlineOffset: '-1px',
            display: 'flex',
            gap: 24,
            marginBottom: 32,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {[
              { value: String(timeLeft.days).padStart(2, '0'), label: 'Days' },
              { value: String(timeLeft.hours).padStart(2, '0'), label: 'Hours' },
              { value: String(timeLeft.minutes).padStart(2, '0'), label: 'Minutes' },
              { value: String(timeLeft.seconds).padStart(2, '0'), label: 'Seconds' }
            ].map((item, index) => (
              <div key={index} style={{
                width: 144,
                height: 144,
                background: `linear-gradient(to bottom, ${colorTokens.secondary200}, ${colorTokens.secondary100})`,
                borderRadius: 16,
                boxShadow: '0px 4px 8px -2px rgba(35,112,255,0.15)',
                outline: '1px solid',
                outlineColor: colorTokens.secondary200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{
                  textAlign: 'center',
                  color: colorTokens.title,
                  fontSize: 72,
                  fontWeight: 500,
                  lineHeight: '79.2px'
                }}>
                  {item.value}
                </div>
                <div style={{
                  textAlign: 'center',
                  color: colorTokens.paragraph,
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: '22px'
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Text Content */}
          <div style={{
            paddingTop: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h1 style={{
              maxWidth: 578,
              textAlign: 'center',
              color: colorTokens.title,
              fontSize: 48,
              fontWeight: 500,
              lineHeight: '56px',
              margin: 0
            }}>
              Launching soon
            </h1>
            <p style={{
              paddingTop: 16,
              maxWidth: 478,
              textAlign: 'center',
              color: colorTokens.paragraph,
              fontSize: 18,
              fontWeight: 400,
              lineHeight: '28.8px',
              margin: 0
            }}>
              Get ready for an amazing experience with {title}. We&apos;re building something special just for you.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 'auto',
        padding: '32px 64px',
        borderTop: `1px solid ${colorTokens.border300}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
      </div>
    </div>
  );
};

export default ComingSoon;
