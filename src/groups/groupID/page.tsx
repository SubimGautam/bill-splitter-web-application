"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ExpenseForm } from '../../app/dashboard/components/expenses/ExpenseForm';
import { ExpenseList } from '../../app/dashboard/components/expenses/ExpenseList';
import { GroupMembers } from '../../app/dashboard/components/groups/GroupMembers';
import { SettlementModal } from '../../app/dashboard/components/settlements/SettlementModal';
import { FaArrowLeft, FaUsers, FaReceipt, FaBalanceScale, FaMoneyBillWave } from 'react-icons/fa';

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const router = useRouter();
  const [groupData, setGroupData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showSettlement, setShowSettlement] = useState(false);
  const [activeTab, setActiveTab] = useState<'expenses' | 'balances' | 'members'>('expenses');

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const data = await api.getGroupDetails(groupId as string);
      setGroupData(data);
    } catch (error) {
      console.error('Failed to fetch group:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!groupData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Group not found</div>
      </div>
    );
  }

  const { group, expenses, balances, simplifiedDebts, userBalance, userBalanceText } = groupData;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {group.name}
            </h1>
            <p style={{ color: '#6b7280' }}>
              {group.members?.length} members • Created by {group.createdBy?.username}
            </p>
          </div>
          
          {/* User Balance Card */}
          <div style={{
            padding: '1rem 2rem',
            backgroundColor: userBalance > 0 ? '#d1fae5' : userBalance < 0 ? '#fee2e2' : '#f3f4f6',
            borderRadius: '0.75rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              Your Balance
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: userBalance > 0 ? '#10b981' : userBalance < 0 ? '#dc2626' : '#6b7280'
            }}>
              {userBalance > 0 ? '+' : userBalance < 0 ? '-' : ''}Rs {Math.abs(userBalance).toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {userBalance > 0 ? 'You are owed' : userBalance < 0 ? 'You owe' : 'Settled up'}
            </div>
          </div>
        </div>

        {/* Group Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Total Expenses
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              Rs {group.totalExpenses?.toFixed(2) || '0.00'}
            </div>
          </div>
          
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Pending Settlements
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {simplifiedDebts?.length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setShowAddExpense(true)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FaReceipt /> Add Expense
        </button>
        <button
          onClick={() => setShowSettlement(true)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'white',
            color: '#10b981',
            border: '2px solid #10b981',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FaMoneyBillWave /> Settle Up
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
        <TabButton
          active={activeTab === 'expenses'}
          onClick={() => setActiveTab('expenses')}
          icon={<FaReceipt />}
          label="Expenses"
        />
        <TabButton
          active={activeTab === 'balances'}
          onClick={() => setActiveTab('balances')}
          icon={<FaBalanceScale />}
          label="Balances"
        />
        <TabButton
          active={activeTab === 'members'}
          onClick={() => setActiveTab('members')}
          icon={<FaUsers />}
          label="Members"
        />
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'expenses' && (
          <ExpenseList 
            expenses={expenses} 
            onExpenseUpdated={fetchGroupDetails}
            currentUserId={group.members.find((m: any) => m._id === userBalance)?.id}
          />
        )}

        {activeTab === 'balances' && (
          <div>
            {/* Simplified Debts */}
            {simplifiedDebts.length > 0 ? (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
                  Who Owes Whom (Simplified)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {simplifiedDebts.map((debt: any, index: number) => {
                    const fromUser = group.members.find((m: any) => m._id === debt.from);
                    const toUser = group.members.find((m: any) => m._id === debt.to);
                    return (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.75rem'
                      }}>
                        <div>
                          <span style={{ fontWeight: 500 }}>{fromUser?.username}</span>
                          <span style={{ margin: '0 0.5rem', color: '#6b7280' }}>owes</span>
                          <span style={{ fontWeight: 500 }}>{toUser?.username}</span>
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#dc2626' }}>
                          Rs {debt.amount.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <p>Everyone is settled up! 🎉</p>
              </div>
            )}

            {/* Detailed Balances */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
                Detailed Balances
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {balances.map((balance: any) => {
                  const user = group.members.find((m: any) => m._id === balance.userId);
                  return (
                    <div key={balance.userId} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.5rem'
                    }}>
                      <span style={{ fontWeight: 500 }}>{user?.username}</span>
                      <span style={{
                        color: balance.balance > 0 ? '#10b981' : balance.balance < 0 ? '#dc2626' : '#6b7280',
                        fontWeight: 600
                      }}>
                        {balance.balance > 0 ? `+Rs ${balance.balance.toFixed(2)}` : 
                         balance.balance < 0 ? `-Rs ${Math.abs(balance.balance).toFixed(2)}` : 
                         'Settled'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <GroupMembers 
            members={group.members}
            groupId={groupId as string}
            onMemberAdded={fetchGroupDetails}
          />
        )}
      </div>

      {/* Modals */}
      {showAddExpense && (
        <ExpenseForm
          groupId={groupId as string}
          members={group.members}
          currentUserId={group.members.find((m: any) => m._id === userBalance)?._id}
          onClose={() => setShowAddExpense(false)}
          onSuccess={() => {
            setShowAddExpense(false);
            fetchGroupDetails();
          }}
        />
      )}

      {showSettlement && (
        <SettlementModal
          groupId={groupId as string}
          members={group.members}
          balances={balances}
          onClose={() => setShowSettlement(false)}
          onSuccess={() => {
            setShowSettlement(false);
            fetchGroupDetails();
          }}
        />
      )}
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      background: 'none',
      border: 'none',
      borderBottom: active ? '2px solid #10b981' : 'none',
      color: active ? '#10b981' : '#6b7280',
      cursor: 'pointer',
      fontWeight: active ? 600 : 400,
      marginBottom: '-2px'
    }}
  >
    {icon}
    {label}
  </button>
);