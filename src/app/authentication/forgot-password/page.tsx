"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.forgotPassword(email);
      setSuccess("A 6-digit code has been sent to your email.");
      // Redirect to verify code page with email
      setTimeout(() => {
        router.push(`/authentication/verify-code?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      {/* Header */}
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

      {/* Main Content */}
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
              Forgot password?
            </h1>
            <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>
              Enter your email and we'll send you a 6-digit code to reset your password.
            </p>
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

          {/* Success Message */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Sending..." : "Send reset code"}
            </button>
          </form>

          {/* Back to Login Link */}
          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#4b5563", marginTop: "2rem" }}>
            Remember your password?{" "}
            <Link href="/authentication/login" style={{ color: "#059669", fontWeight: 500, textDecoration: "none" }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}