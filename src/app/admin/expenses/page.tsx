import { getAllExpenses } from "@/lib/actions/admin-actions";
import { FiDollarSign } from "react-icons/fi";

export default async function ExpensesPage() {
  const expenses = await getAllExpenses();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAmount = (exp: any) => exp.totalAmount || exp.amount || 0;
  const totalSum = expenses.reduce((acc: number, exp: any) => acc + getAmount(exp), 0);

  return (
    <div>
      <style>{`
        .expense-row { transition: background-color 0.15s; }
        .expense-row:hover { background-color: #f9fafb; }
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
            <FiDollarSign size={22} style={{ color: "#10b981" }} />
            All Expenses
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            Complete list of all expenses across all groups
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
            <FiDollarSign size={14} style={{ color: "#10b981" }} />
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#10b981" }}>
              {expenses.length} Expenses
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
                {["Date", "Group", "Description", "Total", "Paid By"].map((col) => (
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
              {expenses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "#9ca3af",
                      fontSize: "0.875rem",
                    }}
                  >
                    No expenses found.
                  </td>
                </tr>
              ) : (
                expenses.map((exp: any, index: number) => {
                  const amount = getAmount(exp);
                  const isLast = index === expenses.length - 1;
                  return (
                    <tr
                      key={exp._id}
                      className="expense-row"
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
                        {formatDate(exp.date)}
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
                          {exp.group?.name || "Unknown"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.25rem",
                          fontSize: "0.825rem",
                          color: "#111827",
                          fontWeight: 500,
                          maxWidth: "240px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {exp.description}
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
                        Rs {amount.toFixed(2)}
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.25rem",
                          fontSize: "0.825rem",
                          color: "#374151",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {exp.payments?.map((p: any) => p.name).join(", ") ||
                          exp.paidBy ||
                          "Unknown"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {expenses.length > 0 && (
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
              Showing {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
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