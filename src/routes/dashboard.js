// routes/dashboard.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Group = require('../models/Group');
const Expense = require('../models/Expense');

// Helper function to compute balances
async function computeBalances(userId) {
  try {
    // Get all users except current user
    const allUsers = await User.find({ _id: { $ne: userId } });
    
    // Get all expenses where current user is involved
    const expenses = await Expense.find({
      $or: [
        { paidBy: userId },
        { 'splits.user': userId }
      ]
    }).populate('paidBy', 'username')
      .populate('splits.user', 'username');

    // Create a map to store net balances
    const balanceMap = new Map();

    // Process each expense
    for (const expense of expenses) {
      const paidBy = expense.paidBy._id.toString();
      
      // If current user paid
      if (paidBy === userId) {
        // For each split, add to what others owe current user
        for (const split of expense.splits) {
          const otherUserId = split.user._id.toString();
          if (otherUserId !== userId) {
            const currentBalance = balanceMap.get(otherUserId) || 0;
            balanceMap.set(otherUserId, currentBalance + split.amount);
          }
        }
      } 
      // If someone else paid
      else {
        // Find current user's split in this expense
        const currentUserSplit = expense.splits.find(
          split => split.user._id.toString() === userId
        );
        
        if (currentUserSplit) {
          const currentBalance = balanceMap.get(paidBy) || 0;
          // Subtract what current user owes to the payer
          balanceMap.set(paidBy, currentBalance - currentUserSplit.amount);
        }
      }
    }

    // Convert map to array with user details
    const balances = [];
    for (const [otherUserId, amount] of balanceMap) {
      const user = await User.findById(otherUserId).select('username');
      if (user) {
        balances.push({
          userId: otherUserId,
          name: user.username,
          amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
        });
      }
    }

    return balances;
  } catch (error) {
    console.error('Error computing balances:', error);
    return [];
  }
}

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch user
    const user = await User.findById(userId).select('-password');
    
    // Fetch groups the user belongs to
    const groups = await Group.find({ members: userId })
      .populate('members', 'username')
      .lean();

    // For each group, compute total balance (sum of expenses) and member count
    const groupsWithDetails = await Promise.all(groups.map(async (group) => {
      const expenses = await Expense.find({ group: group._id });
      const totalBalance = expenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        id: group._id,
        name: group.name,
        members: group.members.length,
        totalBalance,
      };
    }));

    // Fetch recent expenses (last 5) involving the user
    const recentExpenses = await Expense.find({
      $or: [{ paidBy: userId }, { 'splits.user': userId }]
    })
      .sort({ date: -1 })
      .limit(5)
      .populate('paidBy', 'username')
      .populate('group', 'name')
      .lean();

    const formattedExpenses = recentExpenses.map(exp => {
      const paidByUser = exp.paidBy._id.toString() === userId;
      const userSplit = exp.splits.find(s => s.user.toString() === userId);
      const youOwe = userSplit ? userSplit.amount : 0;
      return {
        id: exp._id,
        description: exp.description,
        amount: exp.amount,
        paidBy: paidByUser ? 'You' : exp.paidBy.username,
        date: new Date(exp.date).toLocaleDateString(),
        groupName: exp.group.name,
        youPaid: paidByUser,
        youOwe: paidByUser ? 0 : youOwe,
      };
    });

    // Compute balances with other users using the helper function
    const balances = await computeBalances(userId);

    // Summary totals
    const totalOwedToYou = balances
      .filter(b => b.amount > 0)
      .reduce((sum, b) => sum + b.amount, 0);
    
    const totalYouOwe = balances
      .filter(b => b.amount < 0)
      .reduce((sum, b) => sum + Math.abs(b.amount), 0);
    
    const pendingCount = balances.filter(b => b.amount !== 0).length;

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        groups: groupsWithDetails,
        recentExpenses: formattedExpenses,
        balances,
        summary: {
          totalOwedToYou,
          totalYouOwe,
          pendingCount,
        },
      },
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;