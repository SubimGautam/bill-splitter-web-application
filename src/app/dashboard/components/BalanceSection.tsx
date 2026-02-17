// app/dashboard/components/BalancesSection.tsx
"use client";

interface Balance {
  name: string;
  amount: number;
}

interface BalancesSectionProps {
  balances: Balance[];
}

export const BalancesSection = ({ balances }: BalancesSectionProps) => {
  return (
    <div style={{ background: "white", borderRadius: "1rem", padding: "1.5rem" }}>
      <h2>Balances</h2>
      {balances.length === 0 ? (
        <p>All settled up!</p>
      ) : (
        balances.map((b) => (
          <div key={b.name} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid #f3f4f6" }}>
            <span>{b.name}</span>
            <span style={{ color: b.amount > 0 ? "#10b981" : "#dc2626" }}>
              {b.amount > 0 ? `owes you Rs ${b.amount.toFixed(2)}` : `you owe Rs ${Math.abs(b.amount).toFixed(2)}`}
            </span>
          </div>
        ))
      )}
    </div>
  );
};