"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { setToken } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const passwordValue = passwordRef.current?.value || "";
    const confirmValue = confirmRef.current?.value || "";

    console.log("Password:", passwordValue);
    console.log("Confirm:", confirmValue);

    if (passwordValue !== confirmValue) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordValue.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: passwordValue,
          confirmPassword: confirmValue
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setToken(data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (min-width: 1024px) {
          .main-container { flex-direction: row !important; }
          .desktop-left-image { display: flex !important; width: 60% !important; }
          .desktop-right-form { width: 40% !important; }
        }
      `}</style>

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
        {/* Clickable logo → landing page */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <div style={{
            width: "2.25rem",
            height: "2.25rem",
            backgroundColor: "#10b981",
            borderRadius: "0.375rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.15s"
          }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "1.125rem" }}>$</span>
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827" }}>Splito</span>
        </Link>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/authentication/signup" style={{
            padding: "0.5rem 1.25rem",
            backgroundColor: "#10b981",
            color: "white",
            fontSize: "0.875rem",
            fontWeight: 500,
            borderRadius: "0.375rem",
            textDecoration: "none"
          }}>
            Sign Up
          </Link>
          <Link href="/authentication/login" style={{
            padding: "0.5rem 1.25rem",
            backgroundColor: "#10b981",
            color: "white",
            fontSize: "0.875rem",
            fontWeight: 500,
            borderRadius: "0.375rem",
            textDecoration: "none"
          }}>
            Login
          </Link>
        </div>
      </header>

      <div style={{
        display: "flex",
        minHeight: "100vh",
        paddingTop: "5rem",
        flexDirection: "column"
      }} className="main-container">

        <div style={{
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb"
        }} className="desktop-left-image">
          <Image
            src="/images/bill.png"
            alt="Bills"
            width={600}
            height={600}
            style={{ maxWidth: "80%", height: "auto", objectFit: "contain" }}
            priority
          />
        </div>

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
                Create an account
              </h1>
              <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>Sign up to start splitting expenses</p>
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

            <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0" }}>
              <div style={{ flex: 1, borderTop: "1px solid #d1d5db" }}></div>
              <span style={{ padding: "0 1rem", color: "#6b7280", fontSize: "0.875rem" }}>OR</span>
              <div style={{ flex: 1, borderTop: "1px solid #d1d5db" }}></div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

              <input
                ref={passwordRef}
                type="password"
                placeholder="Password"
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
                autoComplete="new-password"
              />

              <input
                ref={confirmRef}
                type="password"
                placeholder="Confirm Password"
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
                autoComplete="new-password"
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
                  transition: "background-color 0.2s",
                  marginTop: "1rem"
                }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <div style={{
                      width: "1rem",
                      height: "1rem",
                      border: "2px solid white",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite"
                    }}></div>
                    Creating account...
                  </span>
                ) : "Sign Up"}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#4b5563", marginTop: "2rem" }}>
              Already have an account?{" "}
              <Link href="/authentication/login" style={{ color: "#059669", fontWeight: 500, textDecoration: "none" }}>
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}