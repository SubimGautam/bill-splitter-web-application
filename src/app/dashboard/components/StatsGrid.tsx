// "use client";

// import React from 'react';
// import { StatsCardProps } from '../types/dashboard.type';

// interface StatsGridProps {
//   stats: StatsCardProps[];
// }

// export const StatsGrid = ({ stats }: StatsGridProps) => {
//   return (
//     <div style={{
//       display: "grid",
//       gridTemplateColumns: "1fr",
//       gap: "1.5rem",
//       marginBottom: "2rem"
//     }} className="stats-grid">
//       {stats.map((stat, index) => (
//         <StatsCard key={index} {...stat} />
//       ))}
//     </div>
//   );
// };

// const StatsCard = ({ title, value, subtitle, icon: Icon, color }: StatsCardProps) => (
//   <div style={{
//     backgroundColor: "white",
//     borderRadius: "1rem",
//     padding: "1.5rem",
//     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//     transition: "transform 0.2s, box-shadow 0.2s",
//   }}
//   onMouseOver={(e) => {
//     e.currentTarget.style.transform = 'translateY(-2px)';
//     e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
//   }}
//   onMouseOut={(e) => {
//     e.currentTarget.style.transform = 'translateY(0)';
//     e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
//   }}>
//     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//       <div>
//         <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
//           {title}
//         </p>
//         <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827", marginBottom: "0.25rem", lineHeight: 1.2 }}>
//           {value}
//         </p>
//         <p style={{ fontSize: "0.75rem", color, fontWeight: 500 }}>
//           {subtitle}
//         </p>
//       </div>
//       <div style={{
//         width: "3rem",
//         height: "3rem",
//         backgroundColor: `${color}15`,
//         borderRadius: "0.75rem",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center"
//       }}>
//         <Icon style={{ color, fontSize: "1.5rem" }} />
//       </div>
//     </div>
//   </div>
// );