"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { updateProfile } from "@/lib/actions/admin-actions";
import { FiUpload, FiX, FiLoader } from "react-icons/fi";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const updateUserSchema = z.object({
  firstName: z.string().min(2, "Minimum 2 characters").optional().or(z.literal("")),
  lastName: z.string().min(2, "Minimum 2 characters").optional().or(z.literal("")),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Minimum 3 characters"),
  image: z
    .instanceof(File).optional()
    .refine(f => !f || f.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(f => !f || ACCEPTED_IMAGE_TYPES.includes(f.type), "Only jpg, png, webp allowed"),
});

type UpdateUserData = z.infer<typeof updateUserSchema>;

const inputStyle = {
  width: "100%",
  padding: "0.625rem 0.875rem",
  border: "1px solid #e5e7eb",
  borderRadius: "0.5rem",
  fontSize: "0.875rem",
  color: "#111827",
  backgroundColor: "#fafafa",
  outline: "none",
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
};

const labelStyle = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "0.375rem",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
};

const errorStyle = {
  fontSize: "0.72rem",
  color: "#dc2626",
  marginTop: "0.25rem",
};

export default function UpdateUserForm({ user }: { user: any }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      username: user?.username || "",
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (file: File | undefined, onChange: (f?: File) => void) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    onChange(file);
  };

  const handleDismissImage = (onChange?: (f?: File) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: UpdateUserData) => {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName || "");
      formData.append("lastName", data.lastName || "");
      formData.append("email", data.email);
      formData.append("username", data.username);
      if (data.image) formData.append("image", data.image);
      await updateProfile(formData);
      toast.success("Profile updated successfully");
      handleDismissImage();
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    }
  };

  const initials = user?.username?.charAt(0).toUpperCase() || "A";

  return (
    <>
      <style>{`
        .upload-label:hover { background: #e5e7eb !important; }
        .upload-label { transition: background 0.15s; }
        .submit-btn:hover:not(:disabled) { background: #059669 !important; }
        .submit-btn { transition: background 0.15s; }
        .form-input:focus { border-color: #10b981 !important; background: white !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.08); }
      `}</style>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Photo upload */}
        <div>
          <label style={labelStyle}>Profile Photo</label>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Preview */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {previewImage ? (
                <>
                  <img src={previewImage} alt="Preview" style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb" }} />
                  <button type="button" onClick={() => handleDismissImage()} style={{
                    position: "absolute", top: "-4px", right: "-4px",
                    width: "18px", height: "18px", borderRadius: "50%",
                    backgroundColor: "#ef4444", color: "white", border: "2px solid white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", padding: 0,
                  }}>
                    <FiX size={10} />
                  </button>
                </>
              ) : user?.imageUrl ? (
                <img
                  src={process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl}
                  alt="Current"
                  style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb" }}
                />
              ) : (
                <div style={{
                  width: "60px", height: "60px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.25rem", fontWeight: 700,
                }}>
                  {initials}
                </div>
              )}
            </div>

            {/* Upload button */}
            <Controller name="image" control={control} render={({ field: { onChange } }) => (
              <div>
                <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp"
                  onChange={e => handleImageChange(e.target.files?.[0], onChange)}
                  style={{ display: "none" }} id="image-upload" />
                <label htmlFor="image-upload" className="upload-label" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.375rem",
                  padding: "0.5rem 0.875rem",
                  backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem", cursor: "pointer",
                  fontSize: "0.8rem", fontWeight: 500, color: "#374151",
                }}>
                  <FiUpload size={14} />
                  Upload photo
                </label>
              </div>
            )} />
          </div>
          {errors.image && <p style={errorStyle}>{errors.image.message}</p>}
        </div>

        {/* Fields grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {/* Username */}
          <div>
            <label htmlFor="username" style={labelStyle}>Username</label>
            <input id="username" type="text" {...register("username")} className="form-input" style={inputStyle} />
            {errors.username && <p style={errorStyle}>{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input id="email" type="email" {...register("email")} className="form-input" style={inputStyle} />
            {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
          </div>

          {/* First name */}
          <div>
            <label htmlFor="firstName" style={labelStyle}>First Name</label>
            <input id="firstName" type="text" {...register("firstName")} className="form-input" style={inputStyle} />
            {errors.firstName && <p style={errorStyle}>{errors.firstName.message}</p>}
          </div>

          {/* Last name */}
          <div>
            <label htmlFor="lastName" style={labelStyle}>Last Name</label>
            <input id="lastName" type="text" {...register("lastName")} className="form-input" style={inputStyle} />
            {errors.lastName && <p style={errorStyle}>{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-btn"
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.625rem 1.5rem",
              backgroundColor: "#10b981", color: "white",
              border: "none", borderRadius: "0.5rem",
              fontSize: "0.875rem", fontWeight: 600,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
              fontFamily: "inherit",
            }}
          >
            {isSubmitting ? (
              <>
                <FiLoader size={14} style={{ animation: "spin 1s linear infinite" }} />
                Saving...
              </>
            ) : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
}