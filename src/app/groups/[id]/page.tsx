"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  
  // New expense form
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  useEffect(() => {
    if (id) {
      loadGroup();
      loadExpenses();
    }
  }, [id]);

  const loadGroup = async () => {
    try {
      console.log("Loading group with ID:", id);
      const data = await api.getGroup(id);
      console.log("Group data received:", data);
      setGroupName(data.name);
      setMembers(data.members || []);
      console.log("Members set to:", data.members);
    } catch (err) {
      console.error("Failed to load group:", err);
    }
  };

  const loadExpenses = async () => {
    try {
      const data = await api.getGroupExpenses(id);
      setExpenses(data);
    } catch (err) {
      console.error("Failed to load expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!description || !amount || !paidBy) {
      alert("Please fill all fields");
      return;
    }

    // Simple equal split among all members
    const numAmount = parseFloat(amount);
    const splitAmount = numAmount / members.length;
    
    const participants = members.map(name => ({
      name,
      amount: splitAmount
    }));

    try {
      await api.createExpense({
        description,
        amount: numAmount,
        paidBy,
        groupId: id,
        participants
      });
      
      // Reset form
      setDescription("");
      setAmount("");
      setPaidBy("");
      setShowAddExpense(false);
      
      // Reload expenses
      loadExpenses();
    } catch (err) {
      console.error("Failed to add expense:", err);
      alert("Failed to add expense");
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <button onClick={() => router.back()} style={{ marginBottom: "1rem", cursor: "pointer" }}>← Back</button>
      
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{groupName}</h1>
      
      <div style={{ marginBottom: "2rem" }}>
        <h3>Members:</h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {members && members.length > 0 ? (
            members.map((name, i) => (
              <span key={i} style={{ background: "#e5e7eb", padding: "0.25rem 0.75rem", borderRadius: "999px" }}>
                {name}
              </span>
            ))
          ) : (
            <p>No members found</p>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h3>Expenses</h3>
          <button 
            onClick={() => setShowAddExpense(true)}
            style={{
              padding: "0.5rem 1rem",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer"
            }}
          >
            + Add Expense
          </button>
        </div>

        {expenses.length === 0 ? (
          <p>No expenses yet</p>
        ) : (
          expenses.map(exp => (
            <div key={exp._id} style={{ 
              padding: "1rem", 
              border: "1px solid #e5e7eb", 
              borderRadius: "0.5rem",
              marginBottom: "0.5rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{exp.description}</strong>
                <span>Rs {exp.amount}</span>
              </div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Paid by {exp.paidBy} • {new Date(exp.date).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }} onClick={() => setShowAddExpense(false)}>
          <div style={{
            background: "white",
            padding: "2rem",
            borderRadius: "0.5rem",
            width: "400px",
            maxWidth: "90%"
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: "1rem" }}>Add Expense</h2>
            
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem"
              }}
            />
            
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem"
              }}
            />
            
            <select
              value={paidBy}
              onChange={e => setPaidBy(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem"
              }}
            >
              <option value="">Select who paid</option>
              {members && members.length > 0 ? (
                members.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))
              ) : (
                <option disabled>No members available</option>
              )}
            </select>
            
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAddExpense(false)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer"
                }}
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}