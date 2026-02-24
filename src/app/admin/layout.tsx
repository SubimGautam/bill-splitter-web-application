import Header from './_components/Header';
import Sidebar from './_components/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
    }}>
      <Sidebar />
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        minWidth: 0, // Prevents flex overflow
      }}>
        <Header />
        <main style={{ 
          flex: 1,
          padding: "2rem",
          overflowY: "auto",
        }}>
          <div style={{
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
          }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}