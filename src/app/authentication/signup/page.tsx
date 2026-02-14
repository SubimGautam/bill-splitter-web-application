"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const API_BASE_URL = "http://localhost:5000/api";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
  };
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the terms and conditions");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const text = await response.text();
      console.log("Signup response:", response.status, text);

      let data: ApiResponse;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok || !data.success) {
        throw new Error(data?.message || `Registration failed (${response.status})`);
      }

      if (!data.data?.token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      console.log("Signup successful! Token stored.");
      console.log("User:", data.data.user);

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);

    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      {/* HEADER */}
      <header style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.5rem 2.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "2.25rem",
            height: "2.25rem",
            backgroundColor: "#10b981",
            borderRadius: "0.375rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "1.125rem" }}>$</span>
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827" }}>Splito</span>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Link 
            href="/authentication/signup" 
            style={{
              padding: "0.5rem 1.25rem",
              backgroundColor: "#10b981",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 500,
              borderRadius: "0.375rem",
              textDecoration: "none"
            }}
          >
            Sign Up
          </Link>
          <Link 
            href="/authentication/login" 
            style={{
              padding: "0.5rem 1.25rem",
              backgroundColor: "#10b981",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 500,
              borderRadius: "0.375rem",
              textDecoration: "none"
            }}
          >
            Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ 
        display: "flex", 
        minHeight: "100vh", 
        paddingTop: "5rem",
        flexDirection: "column"
      }} className="main-container">
        
        {/* Left Image - Hidden on mobile */}
        <div style={{
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb"
        }} className="desktop-left-image">
          <Image
            src="/images/bill.png"
            alt="Split Bills Illustration"
            width={600}
            height={600}
            style={{ maxWidth: "80%", height: "auto", objectFit: "contain" }}
            priority
          />
        </div>

        {/* Right Form Section */}
        <div style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem"
        }} className="desktop-right-form">
          <div style={{ width: "100%", maxWidth: "28rem" }}>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "0.5rem" }}>
                Create account
              </h1>
              <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>Start splitting expenses today</p>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: "0.75rem",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                fontSize: "0.875rem",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c"
              }}>
                {error}
              </div>
            )}

            {/* Google Sign Up */}
            <button style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              backgroundColor: "white",
              cursor: "pointer",
              fontSize: "0.875rem",
              marginBottom: "1.5rem"
            }}>
              <FcGoogle style={{ width: "1.25rem", height: "1.25rem" }} />
              <span>Sign up with Google</span>
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0" }}>
              <div style={{ flex: 1, borderTop: "1px solid #d1d5db" }}></div>
              <span style={{ padding: "0 1rem", color: "#6b7280", fontSize: "0.875rem" }}>OR</span>
              <div style={{ flex: 1, borderTop: "1px solid #d1d5db" }}></div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem"
                }}
                required
                minLength={3}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem"
                }}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem"
                }}
                required
                minLength={6}
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem"
                }}
                required
                minLength={6}
              />

              {/* Terms Checkbox */}
              <div style={{ display: "flex", alignItems: "flex-start", marginTop: "0.5rem" }}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ width: "1rem", height: "1rem", marginTop: "0.125rem" }}
                  required
                />
                <label htmlFor="terms" style={{ marginLeft: "0.75rem", fontSize: "0.875rem", color: "#4b5563" }}>
                  I agree to Terms & Privacy Policy
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: loading ? "#9ca3af" : "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: "0.5rem"
                }}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            {/* Login Link */}
            <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#4b5563", marginTop: "2rem" }}>
              Already have an account?{" "}
              <Link href="/authentication/login" style={{
                color: "#059669",
                fontWeight: 500,
                textDecoration: "none"
              }}>
                Log in
              </Link>
            </p> 
          </div>
        </div>
      </div>
    </div>
  );
}