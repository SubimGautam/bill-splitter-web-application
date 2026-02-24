// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [trustWorkstation, setTrustWorkstation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await api.login(email, password);

      if (data.user.role !== "admin") {
        throw new Error("Admin privileges required");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      document.cookie = `token=${data.token}; path=/; max-age=604800`;

      router.push("/admin");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

      {/* Header (same as signup) */}
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
            <span style={{ color: "white", fontWeight: "bold" }}>$</span>
          </div>

          <span style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            color: "#111827"
          }}>
            Splito Admin
          </span>
        </div>

        <Link href="/authentication/login" style={{
          padding: "0.5rem 1.25rem",
          backgroundColor: "#10b981",
          color: "white",
          borderRadius: "0.375rem",
          textDecoration: "none",
          fontSize: "0.875rem"
        }}>
          User Login
        </Link>

      </header>

      {/* Main container */}
      <div style={{
        display: "flex",
        minHeight: "100vh",
        paddingTop: "5rem"
      }}>

        {/* LEFT IMAGE (same as signup) */}
        <div style={{
          width: "60%",
          backgroundColor: "#f9fafb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>

          <Image
            src="/images/bill.png"
            alt="Admin"
            width={600}
            height={600}
            style={{
              maxWidth: "80%",
              height: "auto"
            }}
            priority
          />

        </div>


        {/* RIGHT LOGIN */}
        <div style={{
          width: "40%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem"
        }}>

          {/* Admin Terminal Card */}
          <div style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
          }}>

            {/* Icon */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem"
            }}>
              <div style={{
                backgroundColor: "#ecfdf5",
                padding: "12px",
                borderRadius: "8px"
              }}>
                🔐
              </div>
            </div>

            {/* Title */}
            <h2 style={{
              textAlign: "center",
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#111827"
            }}>
              Admin Terminal
            </h2>

            <p style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#6b7280",
              marginBottom: "1.5rem"
            }}>
              SECURE AUTHENTICATION REQUIRED
            </p>


            {error && (
              <div style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "1rem",
                fontSize: "14px"
              }}>
                {error}
              </div>
            )}


            <form onSubmit={handleSubmit}>

              {/* Email */}
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px"
                }}
              />

              {/* Password */}
              <input
                type="password"
                placeholder="Security Token"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px"
                }}
              />

              {/* Checkbox */}
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
                fontSize: "14px",
                color: "#374151"
              }}>
                <input
                  type="checkbox"
                  checked={trustWorkstation}
                  onChange={(e) => setTrustWorkstation(e.target.checked)}
                />
                Trust this workstation
              </label>


              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "500",
                  cursor: "pointer"
                }}
              >
                {loading ? "Authorizing..." : "Authorize Access"}
              </button>

            </form>


            {/* Footer */}
            <div style={{
              textAlign: "center",
              marginTop: "16px",
              fontSize: "12px",
              color: "#9ca3af"
            }}>
              AES-256 ENCRYPTED • SYSTEM OPERATIONAL
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}