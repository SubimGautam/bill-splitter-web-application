// "use client";

// import React, { useState } from 'react';
// import { FaReceipt, FaPlus } from 'react-icons/fa';
// import { Expense } from '../types/dashboard.type';
// import { api } from '@/lib/api';

// interface ExpensesSectionProps {
//   expenses: Expense[];
//   onExpenseAdded?: () => void;
//   groupId: string; // This should be the MongoDB ObjectId
//   userId: string; // This should be the user's MongoDB ObjectId
// }

// export const ExpensesSection = ({ expenses, onExpenseAdded, groupId, userId }: ExpensesSectionProps) => {
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newExpense, setNewExpense] = useState({
//     description: '',
//     amount: '',
//     // Remove paidBy and groupId from here since they come from props
//   });
//   const [isAdding, setIsAdding] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleAddExpense = async () => {
//     if (!newExpense.description || !newExpense.amount) {
//       setError('Please fill all fields');
//       return;
//     }

//     if (!groupId) {
//       setError('Please select a group first');
//       return;
//     }

//     if (!userId) {
//       setError('User not authenticated');
//       return;
//     }

//     setIsAdding(true);
//     setError(null);

//     try {
//       console.log('Creating expense with:', {
//         description: newExpense.description,
//         amount: parseFloat(newExpense.amount),
//         paidBy: userId,
//         groupId: groupId,
//       });

//       await api.createExpense({
//         description: newExpense.description,
//         amount: parseFloat(newExpense.amount),
//         paidBy: userId,
//         splitWith: [], // Empty array means split with all group members
//         groupId: groupId,
//         splitType: 'equal', // Added for consistency
//         participants: [] // Added for consistency (empty for equal split)
//       });

//       setNewExpense({ description: '', amount: '' });
//       setShowAddModal(false);
     
//       if (onExpenseAdded) {
//         onExpenseAdded();
//       }
//     } catch (err: any) {
//       console.error('Failed to add expense:', err);
//       setError(err.message || 'Failed to add expense. Please try again.');
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   return (
//     <>
//       <div style={{
//         backgroundColor: "white",
//         borderRadius: "1rem",
//         padding: "1.5rem",
//         boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
//       }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
//           <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827" }}>Recent Expenses</h2>
//           <button
//             onClick={() => setShowAddModal(true)}
//             style={{
//               color: "#10b981",
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               fontWeight: 500,
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.25rem',
//             }}
//           >
//             View all <span style={{ fontSize: '1.2rem' }}>→</span>
//           </button>
//         </div>

//         {expenses.length > 0 ? (
//           <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
//             {expenses.map((expense) => (
//               <ExpenseCard key={expense.id} expense={expense} />
//             ))}
//           </div>
//         ) : (
//           <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
//             <p>No recent expenses.</p>
//           </div>
//         )}

//         <button
//           onClick={() => setShowAddModal(true)}
//           style={{
//             width: "100%",
//             padding: "0.75rem",
//             border: "2px dashed #d1d5db",
//             borderRadius: "0.75rem",
//             backgroundColor: "transparent",
//             color: "#6b7280",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: "0.5rem",
//             marginTop: "1.5rem",
//             cursor: "pointer",
//             fontWeight: 500,
//             transition: 'border-color 0.2s, color 0.2s',
//           }}
//           onMouseOver={(e) => {
//             e.currentTarget.style.borderColor = '#10b981';
//             e.currentTarget.style.color = '#10b981';
//           }}
//           onMouseOut={(e) => {
//             e.currentTarget.style.borderColor = '#d1d5db';
//             e.currentTarget.style.color = '#6b7280';
//           }}
//         >
//           <FaPlus /> Add new expense
//         </button>
//       </div>

//       {showAddModal && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0,0,0,0.5)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 1000,
//         }}
//         onClick={() => setShowAddModal(false)}>
//           <div style={{
//             backgroundColor: 'white',
//             borderRadius: '1rem',
//             padding: '2rem',
//             maxWidth: '500px',
//             width: '90%',
//           }}
//           onClick={(e) => e.stopPropagation()}>
//             <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add New Expense</h3>
           
//             {error && (
//               <div style={{
//                 padding: '0.75rem',
//                 backgroundColor: '#fee2e2',
//                 border: '1px solid #fecaca',
//                 borderRadius: '0.5rem',
//                 color: '#dc2626',
//                 marginBottom: '1rem'
//               }}>
//                 {error}
//               </div>
//             )}

//             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//               <input
//                 type="text"
//                 placeholder="Description"
//                 value={newExpense.description}
//                 onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
//                 style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
//               />
//               <input
//                 type="number"
//                 placeholder="Amount"
//                 value={newExpense.amount}
//                 onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
//                 style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
//                 min="0.01"
//                 step="0.01"
//               />
             
//               {/* Display the group and user info (read-only) */}
//               <div style={{
//                 padding: '0.75rem',
//                 backgroundColor: '#f3f4f6',
//                 borderRadius: '0.5rem',
//                 fontSize: '0.875rem',
//                 color: '#4b5563'
//               }}>
//                 <p><strong>Group ID:</strong> {groupId}</p>
//                 <p><strong>User ID:</strong> {userId}</p>
//                 <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
//                   The expense will be split equally among all group members.
//                 </p>
//               </div>

//               <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
//                 <button
//                   onClick={() => setShowAddModal(false)}
//                   style={{
//                     padding: '0.5rem 1rem',
//                     backgroundColor: '#f3f4f6',
//                     border: 'none',
//                     borderRadius: '0.5rem',
//                     cursor: 'pointer',
//                     fontWeight: 500
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddExpense}
//                   disabled={isAdding}
//                   style={{
//                     padding: '0.5rem 1rem',
//                     backgroundColor: '#10b981',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '0.5rem',
//                     cursor: isAdding ? 'not-allowed' : 'pointer',
//                     opacity: isAdding ? 0.6 : 1,
//                     fontWeight: 500
//                   }}
//                 >
//                   {isAdding ? 'Adding...' : 'Add Expense'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// const ExpenseCard = ({ expense }: { expense: Expense }) => (
//   <div
//     style={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: "1rem",
//       border: "1px solid #f3f4f6",
//       borderRadius: "0.75rem",
//       backgroundColor: "#f9fafb",
//       transition: 'background-color 0.2s',
//     }}
//     onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
//     onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
//   >
//     <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//       <div style={{
//         width: "2.5rem",
//         height: "2.5rem",
//         backgroundColor: "#f3f4f6",
//         borderRadius: "0.5rem",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center"
//       }}>
//         <FaReceipt style={{ color: "#6b7280" }} />
//       </div>
//       <div>
//         <h4 style={{ fontWeight: 500, color: "#111827" }}>{expense.description}</h4>
//         <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
//           <span style={{
//             padding: "0.125rem 0.5rem",
//             backgroundColor: "#f3f4f6",
//             borderRadius: "0.25rem"
//           }}>
//             {expense.groupName}
//           </span>
//           <span>•</span>
//           <span>{expense.paidBy}</span>
//           <span>•</span>
//           <span>{expense.date}</span>
//         </div>
//       </div>
//     </div>
//     <div style={{ textAlign: "right" }}>
//       <p style={{ fontWeight: "bold", color: "#111827" }}>${expense.amount?.toFixed(2) || '0.00'}</p>
//       {expense.youOwe !== undefined && expense.youOwe > 0 && (
//         <p style={{ fontSize: "0.75rem", color: "#dc2626" }}>You owe: ${expense.youOwe.toFixed(2)}</p>
//       )}
//       {expense.youPaid && (
//         <p style={{ fontSize: "0.75rem", color: "#10b981" }}>You paid</p>
//       )}
//     </div>
//   </div>
// );