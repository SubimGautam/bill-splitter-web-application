import { getCurrentUser } from "@/lib/actions/admin-actions";
import UpdateUserForm from "../_components/UpdateUserForm";
import { FiMail, FiShield, FiHash, FiCalendar } from "react-icons/fi";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const initials = user?.username?.charAt(0).toUpperCase() || "A";

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>Profile</h1>
        <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>Manage your personal information and account settings</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "1.25rem", alignItems: "start" }}>

        {/* ── Left: identity card ── */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "0.875rem",
          border: "1px solid #f3f4f6",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}>
          {/* Top accent */}
          <div style={{ height: "3px", background: "linear-gradient(90deg, #10b981, #059669)" }} />

          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            {/* Avatar */}
            <div style={{ position: "relative", marginBottom: "0.875rem" }}>
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.75rem", fontWeight: 700,
                boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
              }}>
                {initials}
              </div>
              <span style={{
                position: "absolute", bottom: "3px", right: "3px",
                width: "13px", height: "13px", borderRadius: "50%",
                backgroundColor: "#10b981", border: "2px solid white",
              }} />
            </div>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "0.375rem" }}>
              {user?.username || "Admin"}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.875rem" }}>
              {user?.email || "—"}
            </p>

            {/* Role badge */}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              backgroundColor: "#f0fdf4", color: "#10b981",
              border: "1px solid #d1fae5", borderRadius: "999px",
              padding: "4px 12px", fontSize: "0.72rem", fontWeight: 600,
              textTransform: "capitalize",
            }}>
              <FiShield size={10} />
              {user?.role || "admin"}
            </span>
          </div>

          {/* Info rows */}
          <div style={{ borderTop: "1px solid #f3f4f6", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { icon: FiMail, label: "Email", value: user?.email || "—" },
              { icon: FiShield, label: "Role", value: user?.role || "admin", cap: true },
              { icon: FiHash, label: "ID", value: user?.id ? `#${String(user.id).slice(-8)}` : "N/A", mono: true },
              { icon: FiCalendar, label: "Since", value: "2025" },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "7px",
                    backgroundColor: "#f0fdf4", border: "1px solid #d1fae5",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon size={13} style={{ color: "#10b981" }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "0.62rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1px" }}>
                      {row.label}
                    </p>
                    <p style={{
                      fontSize: "0.78rem", color: "#111827", fontWeight: 500,
                      textTransform: (row as any).cap ? "capitalize" : "none",
                      fontFamily: (row as any).mono ? "monospace" : "inherit",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {row.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: edit form ── */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "0.875rem",
          border: "1px solid #f3f4f6",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}>
          <div style={{ height: "3px", background: "linear-gradient(90deg, #10b981, #059669)" }} />
          <div style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827", marginBottom: "2px" }}>Edit Profile</h3>
                <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Update your personal information below</p>
              </div>
              <span style={{
                fontSize: "0.65rem", color: "#9ca3af",
                backgroundColor: "#f9fafb", border: "1px solid #e5e7eb",
                borderRadius: "5px", padding: "3px 8px", fontWeight: 500,
              }}>
                Admin Account
              </span>
            </div>
            <UpdateUserForm user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}