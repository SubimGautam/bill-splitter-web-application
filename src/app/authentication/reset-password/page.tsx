"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api-client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      router.push("/authentication/forgot-password");
    }
  }, [token, email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await api.resetPassword(token, password, confirmPassword);
      setSuccess(true);
      setTimeout(() => {
        router.push("/authentication/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            width: "3rem", 
            height: "3rem", 
            backgroundColor: "#10b981", 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 1rem" 
          }}>
            <svg style={{ width: "1.5rem", height: "1.5rem", color: "white" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>Password reset!</h2>
          <p style={{ color: "#4b5563", marginTop: "0.5rem" }}>You can now login with your new password.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
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
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
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
        </Link>
        <div style={{ display: "flex", gap: "1rem" }}>
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
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <div style={{ width: "100%", maxWidth: "28rem", padding: "2rem 1rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "0.5rem" }}>
              Set new password
            </h1>
            <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>
              Create a new password for your account.
            </p>
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

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "0.75rem 1rem", 
                border: "1px solid #d1d5db", 
                borderRadius: "0.5rem", 
                fontSize: "0.875rem" 
              }}
              required
              disabled={loading}
              minLength={6}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "0.75rem 1rem", 
                border: "1px solid #d1d5db", 
                borderRadius: "0.5rem", 
                fontSize: "0.875rem" 
              }}
              required
              disabled={loading}
              minLength={6}
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
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}