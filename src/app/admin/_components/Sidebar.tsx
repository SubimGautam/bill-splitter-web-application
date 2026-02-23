"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiUsers, FiFolder, FiUser, FiSettings } from "react-icons/fi";

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard", icon: FiHome },
  { href: "/admin/users", label: "Users", icon: FiUsers },
  { href: "/admin/groups", label: "Groups", icon: FiFolder },
  { href: "/admin/profile", label: "Profile", icon: FiUser },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname?.startsWith(href);

  return (
    <>
      <style>{`
        .admin-nav-item:hover { background: #f3f4f6 !important; color: #111827 !important; }
        .admin-nav-item { transition: background 0.15s, color 0.15s; }
      `}</style>
      <aside style={{
        width: "240px",
        flexShrink: 0,
        backgroundColor: "white",
        borderRight: "1px solid #e5e7eb",
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Logo — same as user dashboard */}
        <div style={{
          padding: "1.25rem 1rem",
          borderBottom: "1px solid #f3f4f6",
        }}>
          <div style={{ fontSize: "1.375rem", fontWeight: "bold", color: "#10b981", paddingLeft: "0.5rem" }}>
            💰 Splito
          </div>
          <div style={{ fontSize: "0.65rem", color: "#9ca3af", paddingLeft: "0.5rem", marginTop: "2px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Admin Panel
          </div>
        </div>

        {/* Nav — same style as user dashboard nav */}
        <nav style={{ flex: 1, padding: "0.75rem", display: "flex", flexDirection: "column", gap: "2px", overflowY: "auto" }}>
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                <div
                  className={!active ? "admin-nav-item" : ""}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    padding: "0.625rem 0.75rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 500,
                    cursor: "pointer",
                    backgroundColor: active ? "#f3f4f6" : "transparent",
                    color: active ? "#10b981" : "#4b5563",
                  }}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: "0.875rem 1.25rem",
          borderTop: "1px solid #f3f4f6",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: "0.7rem", color: "#d1d5db" }}>v1.0.0</span>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }} />
            <span style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: 500 }}>Live</span>
          </div>
        </div>
      </aside>
    </>
  );
}