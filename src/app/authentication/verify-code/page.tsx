"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api-client";

export default function VerifyCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push("/authentication/forgot-password");
    }
  }, [email, router]);

  useEffect(() => {
    if (resendDisabled) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setResendDisabled(false);
            clearInterval(timer);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendDisabled]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newCode.every((c) => c !== "") && index === 5) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (fullCode: string) => {
    setLoading(true);
    setError("");
    try {
      const result = await api.verifyCode(email, fullCode);
      router.push(`/authentication/reset-password?token=${result.resetToken}&email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || "Invalid code");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    setCountdown(60);
    setError("");
    try {
      await api.forgotPassword(email);
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
      setResendDisabled(false);
    }
  };

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
              Verify code
            </h1>
            <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>
              Enter the 6-digit code sent to <strong>{email}</strong>
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

          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "2rem" }}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  width: "3rem",
                  height: "3rem",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  outline: "none",
                }}
                disabled={loading}
              />
            ))}
          </div>

          <button
            onClick={() => handleVerify(code.join(""))}
            disabled={loading || code.some((c) => c === "")}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: loading || code.some((c) => c === "") ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: 500,
              cursor: loading || code.some((c) => c === "") ? "not-allowed" : "pointer",
              marginBottom: "1rem",
            }}
          >
            {loading ? "Verifying..." : "Verify code"}
          </button>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleResend}
              disabled={resendDisabled}
              style={{
                background: "none",
                border: "none",
                color: resendDisabled ? "#9ca3af" : "#059669",
                fontSize: "0.875rem",
                cursor: resendDisabled ? "default" : "pointer",
                textDecoration: "underline",
              }}
            >
              {resendDisabled ? `Resend code in ${countdown}s` : "Resend code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}