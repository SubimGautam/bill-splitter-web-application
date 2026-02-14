"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaUserCircle, 
  FaCamera, 
  FaSave, 
  FaArrowLeft,
  FaEnvelope,
  FaUser,
  FaShieldAlt,
  FaBell,
  FaLock,
  FaSignOutAlt
} from 'react-icons/fa';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface ProfileData {
  username: string;
  email: string;
  bio: string;
  phone: string;
  location: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    email: '',
    bio: '',
    phone: '',
    location: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = "http://localhost:5000/api";

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem("user");
      const hasToken = document.cookie.includes('token=');

      if (!userStr || !hasToken) {
        router.push("/authentication/login");
        return;
      }

      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        
        // Set initial profile data
        setProfileData({
          username: userData.username || '',
          email: userData.email || '',
          bio: userData.bio || '',
          phone: userData.phone || '',
          location: userData.location || ''
        });
        
        // Check if user has profile image in localStorage
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
          setProfileImage(savedImage);
        }
        
        setLoading(false);
      } catch (error) {
        console.log("Error parsing user data, redirecting to login");
        router.push("/authentication/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        // Save to localStorage temporarily
        localStorage.setItem('profileImage', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Prepare data for API
      const updateData = {
        username: profileData.username,
        email: profileData.email,
        bio: profileData.bio,
        phone: profileData.phone,
        location: profileData.location,
        profileImage: profileImage // Send base64 image
      };

      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const res = await fetch(`${API_BASE_URL}/users/update-profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update local storage with new user data
      const updatedUser = {
        ...user,
        username: profileData.username,
        email: profileData.email,
        bio: profileData.bio,
        phone: profileData.phone,
        location: profileData.location
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      alert('Profile updated successfully!');
      
      // Update localStorage with profile image if exists
      if (profileImage) {
        localStorage.setItem('profileImage', profileImage);
      }

    } catch (error: any) {
      console.error("Update error:", error);
      alert(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0';
    localStorage.removeItem("user");
    localStorage.removeItem("profileImage");
    router.push("/authentication/login");
  };

  if (loading) {
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
          }}></div>
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f9fafb"
    }}>
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (min-width: 768px) {
          .profile-container {
            max-width: 42rem !important;
          }
        }
        
        @media (min-width: 1024px) {
          .profile-grid {
            grid-template-columns: 1fr 2fr !important;
          }
        }
      `}</style>
      
      {/* Navigation */}
      <div style={{
        backgroundColor: "white",
        padding: "1rem 1.5rem",
        marginBottom: "2rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button 
              onClick={() => router.push("/dashboard")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "none",
                border: "none",
                color: "#6b7280",
                cursor: "pointer",
                fontSize: "0.875rem"
              }}
            >
              <FaArrowLeft /> Back to Dashboard
            </button>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#f3f4f6",
              borderRadius: "0.5rem"
            }}>
              <FaUserCircle style={{ color: "#10b981" }} />
              <span style={{ fontWeight: 500 }}>{user.username}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ 
            fontSize: "2rem", 
            fontWeight: "bold", 
            color: "#111827",
            marginBottom: "0.5rem"
          }}>
            Profile Settings
          </h1>
          <p style={{ color: "#6b7280" }}>
            Manage your account settings and profile information
          </p>
        </div>

        <div style={{
          maxWidth: "48rem",
          margin: "0 auto"
        }} className="profile-container">
          {/* Profile Card */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "2rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "2rem"
          }}>
            <div style={{ 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "2rem"
            }}>
              {/* Profile Image Upload */}
              <div style={{ position: "relative", marginBottom: "1rem" }}>
                <div style={{
                  width: "8rem",
                  height: "8rem",
                  borderRadius: "50%",
                  backgroundColor: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "4px solid white",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}>
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover" 
                      }} 
                    />
                  ) : (
                    <FaUserCircle style={{ fontSize: "5rem", color: "#9ca3af" }} />
                  )}
                </div>
                
                <button
                  onClick={triggerFileInput}
                  style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "2.5rem",
                    height: "2.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}
                >
                  <FaCamera />
                </button>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>

              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>
                {profileData.username}
              </h2>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                {user.role} • Member since {new Date().getFullYear()}
              </p>
            </div>

            {/* Profile Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1.5rem"
              }} className="profile-grid">
                {/* Left Column - Personal Info */}
                <div>
                  <h3 style={{ 
                    fontSize: "1.125rem", 
                    fontWeight: "bold", 
                    color: "#111827",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <FaUser /> Personal Information
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ 
                        display: "block", 
                        fontSize: "0.875rem", 
                        fontWeight: 500, 
                        color: "#374151",
                        marginBottom: "0.25rem"
                      }}>
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={profileData.username}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem"
                        }}
                        placeholder="Enter your username"
                      />
                    </div>

                    <div>
                      <label style={{ 
                        display: "block", 
                        fontSize: "0.875rem", 
                        fontWeight: 500, 
                        color: "#374151",
                        marginBottom: "0.25rem"
                      }}>
                        Email Address
                      </label>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FaEnvelope style={{ color: "#6b7280" }} />
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          style={{
                            width: "100%",
                            padding: "0.5rem 0.75rem",
                            border: "1px solid #d1d5db",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem"
                          }}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ 
                        display: "block", 
                        fontSize: "0.875rem", 
                        fontWeight: 500, 
                        color: "#374151",
                        marginBottom: "0.25rem"
                      }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem"
                        }}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label style={{ 
                        display: "block", 
                        fontSize: "0.875rem", 
                        fontWeight: 500, 
                        color: "#374151",
                        marginBottom: "0.25rem"
                      }}>
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem"
                        }}
                        placeholder="Enter your location"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Bio */}
                <div>
                  <h3 style={{ 
                    fontSize: "1.125rem", 
                    fontWeight: "bold", 
                    color: "#111827",
                    marginBottom: "1rem"
                  }}>
                    About Me
                  </h3>
                  
                  <div>
                    <label style={{ 
                      display: "block", 
                      fontSize: "0.875rem", 
                      fontWeight: 500, 
                      color: "#374151",
                      marginBottom: "0.25rem"
                    }}>
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows={6}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem",
                        fontSize: "0.875rem",
                        resize: "vertical",
                        minHeight: "8rem"
                      }}
                      placeholder="Tell us a little about yourself..."
                      maxLength={500}
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                      {profileData.bio.length}/500 characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: "flex", 
                justifyContent: "flex-end", 
                gap: "1rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid #e5e7eb"
              }}>
                <button
                  onClick={() => router.push("/dashboard")}
                  style={{
                    padding: "0.5rem 1.5rem",
                    backgroundColor: "transparent",
                    color: "#6b7280",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  style={{
                    padding: "0.5rem 1.5rem",
                    backgroundColor: saving ? "#9ca3af" : "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: saving ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  {saving ? (
                    <>
                      <div style={{
                        width: "1rem",
                        height: "1rem",
                        border: "2px solid white",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }}></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Settings Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.5rem"
          }}>
            {/* Account Settings */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ 
                fontSize: "1.125rem", 
                fontWeight: "bold", 
                color: "#111827",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <FaShieldAlt /> Account Settings
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button
                  onClick={() => router.push("/change-password")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem",
                    backgroundColor: "#f9fafb",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <FaLock style={{ color: "#6b7280" }} />
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontWeight: 500, color: "#111827" }}>Change Password</p>
                      <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>Update your password regularly</p>
                    </div>
                  </div>
                  <span style={{ color: "#6b7280" }}>→</span>
                </button>

                <button
                  onClick={() => router.push("/notification-settings")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem",
                    backgroundColor: "#f9fafb",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <FaBell style={{ color: "#6b7280" }} />
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontWeight: 500, color: "#111827" }}>Notification Settings</p>
                      <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>Manage your notification preferences</p>
                    </div>
                  </div>
                  <span style={{ color: "#6b7280" }}>→</span>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "0.75rem",
              padding: "1.5rem"
            }}>
              <h3 style={{ 
                fontSize: "1.125rem", 
                fontWeight: "bold", 
                color: "#991b1b",
                marginBottom: "1rem"
              }}>
                Danger Zone
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p style={{ fontSize: "0.875rem", color: "#7f1d1d" }}>
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button 
                    onClick={handleLogout}
                    style={{
                      padding: "0.5rem 1.5rem",
                      backgroundColor: "#fee2e2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                  
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                        alert("Account deletion would be processed here");
                      }
                    }}
                    style={{
                      padding: "0.5rem 1.5rem",
                      backgroundColor: "#dc2626",
                      color: "white",
                      border: "none",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      cursor: "pointer"
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
    </div>
  );
}