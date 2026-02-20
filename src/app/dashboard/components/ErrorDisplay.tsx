// "use client";

// import React from 'react';

// interface ErrorDisplayProps {
//   error: string;
//   onRetry: () => void;
//   onLogout: () => void;
// }

// export const ErrorDisplay = ({ error, onRetry, onLogout }: ErrorDisplayProps) => {
//   return (
//     <div style={{
//       minHeight: "100vh",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: "#f9fafb"
//     }}>
//       <div style={{ textAlign: "center", maxWidth: "400px", padding: "2rem" }}>
//         <div style={{
//           width: "4rem",
//           height: "4rem",
//           backgroundColor: "#fee2e2",
//           borderRadius: "50%",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           margin: "0 auto 1rem"
//         }}>
//           <span style={{ color: "#dc2626", fontSize: "2rem" }}>!</span>
//         </div>
//         <h2 style={{
//           fontSize: "1.5rem",
//           fontWeight: "bold",
//           color: "#111827",
//           marginBottom: "0.5rem"
//         }}>
//           Oops! Something went wrong
//         </h2>
//         <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>{error}</p>
//         <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
//           <button
//             onClick={onRetry}
//             style={{
//               padding: "0.75rem 1.5rem",
//               backgroundColor: "#10b981",
//               color: "white",
//               border: "none",
//               borderRadius: "0.5rem",
//               fontSize: "0.875rem",
//               fontWeight: 500,
//               cursor: "pointer"
//             }}
//           >
//             Try Again
//           </button>
//           <button
//             onClick={onLogout}
//             style={{
//               padding: "0.75rem 1.5rem",
//               backgroundColor: "transparent",
//               color: "#6b7280",
//               border: "1px solid #d1d5db",
//               borderRadius: "0.5rem",
//               fontSize: "0.875rem",
//               fontWeight: 500,
//               cursor: "pointer"
//             }}
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };