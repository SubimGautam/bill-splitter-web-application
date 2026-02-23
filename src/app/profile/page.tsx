"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiCamera,
  FiHome,
  FiUsers,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiShield,
  FiCalendar,
  FiLock,
} from "react-icons/fi";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

  const getToken = (): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(^| )token=([^;]+)/);
    return match ? match[2] : null;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();
        if (!token) { router.push("/authentication/login"); return; }
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          const userData = data.data;
          setUser(userData);
          if (userData.profileImage) {
            const imgUrl = userData.profileImage.startsWith("http")
              ? userData.profileImage
              : `http://localhost:5000${userData.profileImage}`;
            setProfileImage(imgUrl);
          }
        } else throw new Error(data.message);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/authentication/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/users/upload-profile-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        let newUrl = data.data.profileImage;
        if (newUrl && !newUrl.startsWith("http")) newUrl = `http://localhost:5000${newUrl}`;
        setProfileImage(newUrl);
        setUser((prev: any) => ({ ...prev, profileImage: newUrl }));
      } else throw new Error(data.message);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success && data.data.profileImage) {
        const imgUrl = data.data.profileImage.startsWith("http")
          ? data.data.profileImage
          : `http://localhost:5000${data.data.profileImage}`;
        setProfileImage(imgUrl);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    localStorage.removeItem("user");
    router.push("/authentication/login");
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={{ color: "#6b7280" }}>Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.username?.slice(0, 2).toUpperCase() || "??";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome },
    { id: "groups",    label: "Groups",    icon: FiUsers },
    { id: "expenses",  label: "Expenses",  icon: FiDollarSign },
    { id: "analytics", label: "Analytics", icon: FiBarChart2 },
    { id: "settings",  label: "Settings",  icon: FiSettings },
  ] as const;

  return (
    <div style={styles.container}>
      {/* ── Sidebar (identical to dashboard) ── */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>💰 Splito</div>
        <nav style={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => router.push("/dashboard")}
                style={{ ...styles.navItem, backgroundColor: "transparent", color: "#4b5563" }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Main ── */}
      <div style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>Profile</h1>
          <div style={styles.userSection}>
            <div style={styles.userInfo}>
              <FiUser size={18} color="#10b981" />
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#111827" }}>
                {user.username}
              </span>
            </div>
            <button onClick={handleLogout} style={styles.logoutButton} title="Logout">
              <FiLogOut size={20} />
            </button>
          </div>
        </header>

        {/* Two-column layout */}
        <div style={styles.contentGrid}>
          {/* Left — avatar + quick info */}
          <div style={styles.leftCol}>
            <div style={styles.card}>
              {/* Avatar */}
              <div style={styles.avatarCenter}>
                <div style={styles.avatarWrap}>
                  {profileImage ? (
                    <img src={profileImage} alt={user.username} style={styles.avatarImg} />
                  ) : (
                    <div style={styles.avatarInitials}>{initials}</div>
                  )}
                  <label htmlFor="image-upload" style={styles.cameraBtn} title="Change photo">
                    {uploading
                      ? <span style={styles.uploadSpinner} />
                      : <FiCamera size={13} />}
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                    disabled={uploading}
                  />
                </div>

                <h2 style={styles.avatarName}>{user.username}</h2>

                <span style={styles.roleBadge}>
                  <FiShield size={11} />
                  {user.role || "User"}
                </span>
              </div>

              <div style={styles.divider} />

              {/* Info list */}
              <div style={styles.infoList}>
                {[
                  { icon: <FiMail size={14} color="#10b981" />, label: "Email", value: user.email },
                  { icon: <FiCalendar size={14} color="#10b981" />, label: "Member Since", value: "January 2025" },
                  { icon: <FiShield size={14} color="#10b981" />, label: "Status", value: "● Active", green: true },
                ].map((row) => (
                  <div key={row.label} style={styles.infoRow}>
                    <span style={styles.infoIconWrap}>{row.icon}</span>
                    <div>
                      <p style={styles.infoLabel}>{row.label}</p>
                      <p style={row.green ? { ...styles.infoValue, color: "#10b981", fontWeight: 600 } : styles.infoValue}>
                        {row.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — details + actions + danger */}
          <div style={styles.rightCol}>
            {/* Profile details */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Profile Information</h3>
                <span style={styles.readOnlyTag}>Read-only</span>
              </div>
              <div style={styles.fieldsGrid}>
                <div style={styles.fieldItem}>
                  <label style={styles.fieldLabel}>Username</label>
                  <div style={styles.fieldValue}>
                    <FiUser size={15} color="#10b981" />
                    <span style={styles.fieldText}>{user.username}</span>
                  </div>
                </div>
                <div style={styles.fieldItem}>
                  <label style={styles.fieldLabel}>Role</label>
                  <div style={styles.fieldValue}>
                    <FiShield size={15} color="#10b981" />
                    <span style={{ ...styles.fieldText, textTransform: "capitalize" }}>{user.role || "user"}</span>
                  </div>
                </div>
                <div style={{ ...styles.fieldItem, gridColumn: "1 / -1" }}>
                  <label style={styles.fieldLabel}>Email Address</label>
                  <div style={styles.fieldValue}>
                    <FiMail size={15} color="#10b981" />
                    <span style={styles.fieldText}>{user.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account actions */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Account Actions</h3>
              </div>
              <button
                style={styles.actionRow}
                onClick={() => router.push("/change-password")}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#f9fafb")}
              >
                <span style={styles.actionIconWrapBlue}>
                  <FiLock size={16} color="#0369a1" />
                </span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <p style={styles.actionTitle}>Change Password</p>
                  <p style={styles.actionSub}>Update your login credentials</p>
                </div>
                <span style={{ color: "#9ca3af" }}>→</span>
              </button>
            </div>

            {/* Danger zone */}
            <div style={styles.dangerCard}>
              <h3 style={styles.dangerTitle}>Danger Zone</h3>
              <p style={styles.dangerSub}>Permanent actions — cannot be reversed.</p>
              <div style={styles.dangerBtns}>
                <button style={styles.logoutDangerBtn} onClick={handleLogout}>
                  <FiLogOut size={15} /> Logout
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => {
                    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
                      alert("Account deletion would be processed here");
                    }
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    gap: "1rem",
  },
  spinner: {
    width: "3rem",
    height: "3rem",
    border: "4px solid #e5e7eb",
    borderTopColor: "#10b981",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  // Layout
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
  },

  // Sidebar — pixel-for-pixel match with dashboard
  sidebar: {
    width: "260px",
    backgroundColor: "white",
    borderRight: "1px solid #e5e7eb",
    padding: "2rem 1rem",
    flexShrink: 0,
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: "2rem",
    paddingLeft: "1rem",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },

  // Main
  main: {
    flex: 1,
    padding: "2rem",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  pageTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#111827",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "white",
    borderRadius: "2rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  logoutButton: {
    padding: "0.5rem",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "50%",
    width: "2.5rem",
    height: "2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  // Content grid
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "1.5rem",
    alignItems: "start",
  },
  leftCol: {},
  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  // Card (matches dashboard's statCard / chartCard style)
  card: {
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    padding: "1.5rem",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  cardTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#111827",
  },
  readOnlyTag: {
    fontSize: "0.7rem",
    color: "#9ca3af",
    backgroundColor: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "2px 8px",
  },

  // Avatar
  avatarCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: "0",
  },
  avatarWrap: {
    position: "relative",
    marginBottom: "1rem",
  },
  avatarImg: {
    width: "88px",
    height: "88px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #d1fae5",
  },
  avatarInitials: {
    width: "88px",
    height: "88px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.75rem",
    fontWeight: "bold",
    border: "3px solid #d1fae5",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "2px solid white",
    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
  },
  uploadSpinner: {
    width: "11px",
    height: "11px",
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "white",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
  avatarName: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "0.4rem",
  },
  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "#f0fdf4",
    color: "#10b981",
    border: "1px solid #bbf7d0",
    borderRadius: "999px",
    padding: "3px 12px",
    fontSize: "0.75rem",
    fontWeight: 500,
    textTransform: "capitalize",
    marginBottom: "1rem",
  },
  divider: {
    width: "100%",
    height: "1px",
    backgroundColor: "#f3f4f6",
    margin: "1rem 0",
  },
  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.875rem",
  },
  infoRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
  },
  infoIconWrap: {
    width: "30px",
    height: "30px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: "0.65rem",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "2px",
  },
  infoValue: {
    fontSize: "0.8rem",
    color: "#111827",
    fontWeight: 500,
    wordBreak: "break-all",
  },

  // Fields
  fieldsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  fieldItem: {},
  fieldLabel: {
    display: "block",
    fontSize: "0.7rem",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "6px",
    fontWeight: 500,
  },
  fieldValue: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    padding: "10px 14px",
  },
  fieldText: {
    fontSize: "0.875rem",
    color: "#111827",
    fontWeight: 500,
  },

  // Action row
  actionRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "0.75rem",
    padding: "14px 16px",
    cursor: "pointer",
    width: "100%",
    fontFamily: "inherit",
    transition: "background-color 0.15s",
  },
  actionIconWrapBlue: {
    width: "36px",
    height: "36px",
    backgroundColor: "#e0f2fe",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  actionTitle: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "2px",
  },
  actionSub: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },

  // Danger zone
  dangerCard: {
    backgroundColor: "#fff5f5",
    border: "1px solid #fecaca",
    borderRadius: "1rem",
    padding: "1.5rem",
  },
  dangerTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#dc2626",
    marginBottom: "0.3rem",
  },
  dangerSub: {
    fontSize: "0.8rem",
    color: "#ef4444",
    marginBottom: "1.1rem",
  },
  dangerBtns: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  logoutDangerBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "0.55rem 1.1rem",
    backgroundColor: "white",
    color: "#dc2626",
    border: "1px solid #fca5a5",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  deleteBtn: {
    padding: "0.55rem 1.1rem",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};