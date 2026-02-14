"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

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

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      const token = document.cookie.includes('token=');
      
      if (user && token) {
        console.log("User already logged in, redirecting to dashboard");
        router.push("/dashboard");
      } else {
        // Clear any stale data
        localStorage.removeItem("user");
        document.cookie = 'token=; path=/; max-age=0';
      }
      setIsCheckingAuth(false);
      setMounted(true);
    };

    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include" // Important for cookies
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      if (data.data) {
        // Store authentication data
        // Set cookie with secure options
        document.cookie = `token=${data.data.token}; path=/; max-age=86400; samesite=strict`;
        localStorage.setItem("user", JSON.stringify(data.data.user));
        
        console.log("Login successful, redirecting to dashboard");
        
        // Clear form
        setFormData({ email: "", password: "" });
        
        // Redirect to dashboard
        router.push("/dashboard");
        
        // Refresh to ensure proper state update
        setTimeout(() => {
          router.refresh();
        }, 100);
      } else {
        throw new Error("No user data received");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      console.error("Login error:", err);
      
      // Clear any partial auth data on error
      localStorage.removeItem("user");
      document.cookie = 'token=; path=/; max-age=0';
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything until mounted and auth check is complete
  if (!mounted || isCheckingAuth) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "#fff" 
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "3rem",
            height: "3rem",
            border: "4px solid #10b981",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto"
          }}></div>
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (min-width: 1024px) {
          .desktop-left-image {
            display: flex !important;
            width: 60% !important;
          }
          
          .desktop-right-form {
            width: 40% !important;
          }
          
          .main-container {
            flex-direction: row !important;
          }
        }
      `}</style>
      
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
            alt="Bills"
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
                Welcome back
              </h1>
              <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>Log in to your account</p>
            </div>

            {/* Error/Success Messages */}
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

            {/* Google Sign In */}
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
              <span>Sign in with Google</span>
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0" }}>
              <div style={{ flex: 1, borderTop: "1px solid #d1d5db" }}></div>
              <span style={{ padding: "0 1rem", color: "#6b7280", fontSize: "0.875rem" }}>OR</span>
              <div style={{ flex: 1, borderTop: "1px solid #d1d5db" }}></div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="email"
                placeholder="Enter Email"
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
                placeholder="Enter Password"
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

              <div style={{ textAlign: "right" }}>
                <Link href="/forgot-password" style={{
                  fontSize: "0.875rem",
                  color: "#059669",
                  textDecoration: "none"
                }}>
                  Forgot password?
                </Link>
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
                  transition: "background-color 0.2s"
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
                    Logging in...
                  </span>
                ) : "Login"}
              </button>
            </form>

            {/* Sign Up Link */}
            <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#4b5563", marginTop: "2rem" }}>
              Don't have an account?{" "}
              <Link href="/authentication/signup" style={{
                color: "#059669",
                fontWeight: 500,
                textDecoration: "none"
              }}>
                Sign up for free
              </Link>
            </p>
          </div>
        </div> 
      </div>
    </div>
  );
}