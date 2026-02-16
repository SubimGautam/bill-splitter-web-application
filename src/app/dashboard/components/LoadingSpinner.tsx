"use client";

import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f9fafb"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "4rem",
          height: "4rem",
          border: "4px solid #10b981",
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto"
        }} />
        <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading dashboard...</p>
      </div>
    </div>
  );
};