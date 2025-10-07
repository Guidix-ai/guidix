'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
const colorTokens = {
  title: "#002A79",
  paragraph: "#6477B4",
  bgLight: "#F8F9FF",
  secondary600: "#2370FF",
  secondary700: "#1B54CA",
  accent30: "rgba(35,112,255,0.3)",
};

const ContactInfo = ({ title, details }) => (
  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: "linear-gradient(to bottom, #6ba0ff, #235bff)",
        boxShadow: "0 1px 6px rgba(66,112,255,0.06)",
        flexShrink: 0,
      }}
    />
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontWeight: 600, fontSize: 20, color: "#cbd5ef" }}>{title}</div>
      <div style={{ fontWeight: 500, fontSize: 18, color: "#dbe2ff" }}>{details}</div>
    </div>
  </div>
);

const FormField = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  styleProps,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8, ...styleProps }}>
    <label
      htmlFor={name}
      style={{
        color: colorTokens.title,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: "Inter, sans-serif",
        lineHeight: "20px",
      }}
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%",
        height: 56,
        minHeight: 56,
        paddingLeft: 16,
        paddingRight: 6,
        paddingTop: 6,
        paddingBottom: 6,
        backgroundColor: colorTokens.bgLight,
        borderRadius: 16,
        boxShadow:
          "0px 0px 2px 0px rgba(0,19,88,0.15), 0px 4px 4px 0px rgba(0,19,88,0.04), 0px 4px 16px 0px rgba(0,19,88,0.04), inset 0px -4px 4px 0px rgba(0,19,88,0.10)",
        outline: "1px solid #C7D6ED",
        fontSize: 16,
        color: colorTokens.paragraph,
        fontFamily: "Inter, sans-serif",
        fontWeight: 400,
        lineHeight: "125%",
        letterSpacing: "-0.32px",
      }}
    />
  </div>
);

const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    universityDomain: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://api.guidix.ai/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          universityDomain: formData.universityDomain,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Store token if API returns it
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        input::placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
        input::-webkit-input-placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
        input::-moz-placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
        input:-ms-input-placeholder {
          color: #6477B4;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 125%;
          letter-spacing: -0.32px;
        }
      `}</style>
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
      <div
        style={{
          display: "flex",
          gap: 100,
          maxWidth: "1400px",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
      {/* Image Container on left */}
      <div
        style={{
          flex: "1",
          maxWidth: "600px",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0px 12px 32px -4px rgba(35,112,255,0.4), 0px 2px 2px 0 rgba(0,19,88,0.1), 0px 4px 8px -2px rgba(0,19,88,0.4)",
          minHeight: "600px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/Card.svg"
          alt="Join Guidix Today"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "-30px center",
          }}
        />
        <div style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          zIndex: 1,
        }}>
          <Image
            src="/white guidix.ai logo .svg"
            alt="Guidix.ai"
            width={120}
            height={40}
            style={{
              height: "40px",
              width: "auto",
              mixBlendMode: "screen",
            }}
          />
        </div>
        <div style={{
          position: "relative",
          zIndex: 1,
          color: "#dbe2ff",
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          padding: "48px 40px",
        }}>
          <div style={{ fontWeight: 500, fontSize: 48, lineHeight: "56px" }}>
            Join Guidix Today
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 18,
              lineHeight: "28px",
              maxWidth: 384,
            }}
          >
            Create your account and start your placement journey
          </div>
        </div>
      </div>

      {/* Right Form Container */}
      <div
        style={{
          flex: "1",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          justifyContent: "center",
        }}
      >
        <div>
          <h1
            style={{
              width: 580,
              color: colorTokens.title,
              fontSize: 48,
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
              lineHeight: "60px",
              margin: 0,
            }}
          >
            Create Account
          </h1>
          <p
            style={{
              marginTop: 12,
              width: 580,
              color: colorTokens.paragraph,
              fontSize: 16,
              fontWeight: 400,
              fontFamily: "Inter, sans-serif",
              lineHeight: "24px",
            }}
          >
            Fill in your details to get started
          </p>
        </div>
        <form
          onSubmit={handleSignup}
          autoComplete="off"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: 580,
          }}
        >
          {/* Row 1 */}
          <div style={{ display: "flex", gap: 16 }}>
            <FormField
              name="fullName"
              label="Full name"
              placeholder="Rajesh Kumar"
              value={formData.fullName}
              onChange={handleInputChange}
              styleProps={{ flex: 1 }}
            />
            <FormField
              name="email"
              label="Email address"
              type="email"
              placeholder="rajesh.kumar@example.com"
              value={formData.email}
              onChange={handleInputChange}
              styleProps={{ flex: 1 }}
            />
          </div>
          {/* Row 2 */}
          <div style={{ display: "flex", gap: 16 }}>
            <FormField
              name="phoneNumber"
              label="Phone number"
              placeholder="+91 98765 43210"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              styleProps={{ flex: 1 }}
            />
            <FormField
              name="universityDomain"
              label="University Domain"
              placeholder="iitd.ac.in"
              value={formData.universityDomain}
              onChange={handleInputChange}
              styleProps={{ flex: 1 }}
            />
          </div>
          {/* Row 3 */}
          <div style={{ display: "flex", gap: 16 }}>
            <FormField
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              styleProps={{ flex: 1 }}
            />
            <FormField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              styleProps={{ flex: 1 }}
            />
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'inline-flex',
                width: '100%',
                padding: '12px 16px',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px',
                border: '1px solid rgba(35, 112, 255, 0.30)',
                background: 'linear-gradient(180deg, #679CFF 0%, #2370FF 100%)',
                boxShadow: '0 2px 4px 0 rgba(77, 145, 225, 0.10), 0 1px 0.3px 0 rgba(255, 255, 255, 0.25) inset, 0 -1px 0.3px 0 rgba(0, 19, 88, 0.25) inset',
                color: '#FFFFFF',
                textAlign: 'center',
                textShadow: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '125%',
                letterSpacing: '-0.32px',
                cursor: 'pointer'
              }}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
          {error && <div style={{ marginTop: 8, color: "red" }}>{error}</div>}
          {/* Terms and Sign In */}
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <p
              style={{
                fontSize: 14,
                color: colorTokens.paragraph,
                fontFamily: "Inter, sans-serif",
                lineHeight: "20px",
                margin: 0,
              }}
            >
              By signing up you agree to our{" "}
              <span style={{ color: colorTokens.secondary600, fontWeight: 500 }}>
                Terms of Services
              </span>{" "}
              and{" "}
              <span style={{ color: colorTokens.secondary600, fontWeight: 500 }}>
                Privacy Policy
              </span>
            </p>
            <p
              style={{
                fontSize: 14,
                color: colorTokens.paragraph,
                fontFamily: "Inter, sans-serif",
                lineHeight: "20px",
                marginTop: 8,
              }}
            >
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                style={{
                  color: colorTokens.secondary600,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Sign in
              </span>
            </p>
          </div>
        </form>
      </div>
      </div>
    </div>
    </>
  );
};

export default SignupPage;
