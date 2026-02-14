"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:5000/api";

export default function SignupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // If user is already logged in, redirect to dashboard
  if (user) {
    router.push("/dashboard");
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }

      // Auto-login after successful registration
      const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const loginData = await loginRes.json();

      if (loginRes.ok && loginData.success && loginData.data) {
        // Store authentication data
        document.cookie = `token=${loginData.data.token}; path=/; max-age=86400; samesite=lax`;
        localStorage.setItem("user", JSON.stringify(loginData.data.user));
        
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setSuccess("Registration successful! Please login.");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      {/* Similar structure to login page but for signup */}
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

      <div style={{ 
        display: "flex", 
        minHeight: "100vh", 
        paddingTop: "5rem",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ width: "100%", maxWidth: "28rem", padding: "2rem 1rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "0.5rem" }}>
              Create an account
            </h1>
            <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>Join Splito to start splitting expenses</p>
          </div>

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

          {success && (
            <div style={{
              padding: "0.75rem",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              fontSize: "0.875rem",
              backgroundColor: "#d1fae5",
              border: "1px solid #bbf7d0",
              color: "#065f46"
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                fontSize: "0.875rem"
              }}
              required
              disabled={loading}
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                fontSize: "0.875rem"
              }}
              required
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                fontSize: "0.875rem"
              }}
              required
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                fontSize: "0.875rem"
              }}
              required
              disabled={loading}
            />

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
                marginTop: "1rem"
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#4b5563", marginTop: "2rem" }}>
            Already have an account?{" "}
            <Link href="/authentication/login" style={{
              color: "#059669",
              fontWeight: 500,
              textDecoration: "none"
            }}>
              Log in here
            </Link>
          </p> 
        </div>
      </div>
    </div>
  );
}