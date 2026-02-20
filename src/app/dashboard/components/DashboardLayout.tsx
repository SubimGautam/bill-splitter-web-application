// // components/DashboardLayout.tsx
// import { ReactNode } from 'react';

// interface DashboardLayoutProps {
//   children: ReactNode;
// }

// export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
//   return (
//     <div style={{
//       minHeight: "100vh",
//       backgroundColor: "#f9fafb",
//       padding: "1rem"
//     }}>
//       <style jsx global>{`
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//         @media (min-width: 768px) {
//           .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
//         }
//         @media (min-width: 1024px) {
//           .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
//           .content-grid { grid-template-columns: 2fr 1fr !important; }
//           .groups-grid { grid-template-columns: repeat(2, 1fr) !important; }
//         }
//       `}</style>
//       <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
//         {children}
//       </div>
//     </div>
//   );
// };