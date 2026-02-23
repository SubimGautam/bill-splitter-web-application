"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:5000/api";

export default function SignupPage() {
  const { user } = useAuth(); // Keep this, but don't auto-redirect
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ❌ REMOVE THIS ENTIRE BLOCK
  // if (user) {
  //   router.replace("/dashboard");
  //   return null;
  // }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const registerUrl = `${API_BASE_URL}/auth/register`;
    console.log("[SIGNUP] Sending POST to:", registerUrl);
    console.log("[SIGNUP] Payload:", {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: "••••••",
    });

    try {
      const res = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      console.log("[SIGNUP REGISTER] Status:", res.status);

      const registerText = await res.text();

      if (!res.ok) {
        console.log("[SIGNUP REGISTER] Raw error (first 400 chars):", registerText.substring(0, 400));
        let msg = `Registration failed (HTTP ${res.status})`;
        try {
          const json = JSON.parse(registerText);
          msg = json.message || msg;
        } catch {}
        throw new Error(msg);
      }

      const registerData = JSON.parse(registerText);

      if (!registerData.success) {
        throw new Error(registerData.message || "Registration failed");
      }

      console.log("[SIGNUP] Registration successful → starting auto-login");

      const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      console.log("[SIGNUP LOGIN] Status:", loginRes.status);

      const loginText = await loginRes.text();

      if (!loginRes.ok) {
        console.log("[SIGNUP LOGIN] Raw error (first 400 chars):", loginText.substring(0, 400));
        throw new Error("Auto-login failed after registration");
      }

      const loginData = JSON.parse(loginText);

      if (loginData.success && loginData.data?.token && loginData.data?.user) {
        document.cookie = `token=${loginData.data.token}; path=/; max-age=86400; samesite=strict`;
        localStorage.setItem("user", JSON.stringify(loginData.data.user));

        console.log("[SIGNUP] SUCCESS — redirecting to dashboard");
        router.replace("/dashboard");

        setTimeout(() => router.refresh(), 300);
      } else {
        setSuccess("Account created! Please log in manually.");
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
      }
    } catch (err: any) {
      console.error("[SIGNUP] ERROR:", err.message, err.stack);
      setError(err.message || "Registration failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <header
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 2.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "2.25rem",
              height: "2.25rem",
              backgroundColor: "#10b981",
              borderRadius: "0.375rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
              textDecoration: "none",
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
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </div>
      </header>

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          paddingTop: "5rem",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: "28rem", padding: "2rem 1rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "0.5rem" }}>
              Create an account
            </h1>
            <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>Join Splito to start splitting expenses</p>
          </div>

          {error && (
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                fontSize: "0.875rem",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                fontSize: "0.875rem",
                backgroundColor: "#d1fae5",
                border: "1px solid #bbf7d0",
                color: "#065f46",
              }}
            >
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
                fontSize: "0.875rem",
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
                fontSize: "0.875rem",
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
                fontSize: "0.875rem",
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
                fontSize: "0.875rem",
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
                marginTop: "1rem",
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#4b5563", marginTop: "2rem" }}>
            Already have an account?{" "}
            <Link href="/authentication/login" style={{ color: "#059669", fontWeight: 500, textDecoration: "none" }}>
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}