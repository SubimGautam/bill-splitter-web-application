import { getAllSettlements } from "@/lib/actions/admin-actions";
import { FiTrendingUp, FiArrowRight } from "react-icons/fi";

export default async function SettlementsPage() {
  const settlements = await getAllSettlements();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalSum = settlements.reduce((acc: number, s: any) => acc + (s.amount || 0), 0);

  return (
    <div>
      <style>{`
        .settlement-row { transition: background-color 0.15s; }
        .settlement-row:hover { background-color: #f9fafb; }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "0.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FiTrendingUp size={22} style={{ color: "#10b981" }} />
            All Settlements
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            Complete history of all settlements across all groups
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#f0fdf4",
              border: "1px solid #d1fae5",
              borderRadius: "0.625rem",
            }}
          >
            <FiTrendingUp size={14} style={{ color: "#10b981" }} />
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#10b981" }}>
              {settlements.length} Settlements
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 1rem",
              backgroundColor: "#f0fdf4",
              border: "1px solid #d1fae5",
              borderRadius: "0.625rem",
            }}
          >
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#10b981" }}>
              Rs {totalSum.toFixed(2)} Total
            </span>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0.875rem",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                {["Date", "Group", "Transfer", "Amount"].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "0.875rem 1.25rem",
                      textAlign: "left",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {settlements.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "#9ca3af",
                      fontSize: "0.875rem",
                    }}
                  >
                    No settlements found.
                  </td>
                </tr>
              ) : (
                settlements.map((s: any, index: number) => {
                  const isLast = index === settlements.length - 1;
                  return (
                    <tr
                      key={s._id}
                      className="settlement-row"
                      style={{ borderBottom: isLast ? "none" : "1px solid #f3f4f6" }}
                    >
                      <td
                        style={{
                          padding: "1rem 1.25rem",
                          fontSize: "0.825rem",
                          color: "#6b7280",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDate(s.date)}
                      </td>
                      <td style={{ padding: "1rem 1.25rem", whiteSpace: "nowrap" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "0.2rem 0.65rem",
                            backgroundColor: "#f0fdf4",
                            color: "#059669",
                            borderRadius: "999px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            border: "1px solid #d1fae5",
                          }}
                        >
                          {s.group?.name || "Unknown"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem", whiteSpace: "nowrap" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            backgroundColor: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.5rem",
                            padding: "0.3rem 0.75rem",
                          }}
                        >
                          <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#374151" }}>
                            {s.from}
                          </span>
                          <FiArrowRight size={13} style={{ color: "#10b981", flexShrink: 0 }} />
                          <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#374151" }}>
                            {s.to}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.25rem",
                          fontSize: "0.825rem",
                          fontWeight: 700,
                          color: "#10b981",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Rs {s.amount.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {settlements.length > 0 && (
          <div
            style={{
              padding: "0.875rem 1.25rem",
              borderTop: "1px solid #f3f4f6",
              backgroundColor: "#f9fafb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
              Showing {settlements.length} settlement{settlements.length !== 1 ? "s" : ""}
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#10b981" }}>
              Grand Total: Rs {totalSum.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}