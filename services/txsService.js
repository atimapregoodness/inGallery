const mongoose = require('mongoose');
const Wallet = require('../models/wallet'); // Adjust path to your model

// Function to add a transaction
async function addTransaction(userId, amount, type) {
  try {
    // Find the user's wallet
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return { success: false, message: 'Wallet not found' };
    }

    // Create a new transaction
    const newTransaction = {
      txId: new mongoose.Types.ObjectId().toString(), // Generate a unique txId
      amount,
      type,
      status: 'pending', // Default status
      createdAt: new Date()
    };

    // Add transaction to wallet
    wallet.transactions.push(newTransaction);

    // Update the wallet balance if it's a reward
    if (type === 'view-reward' || type === 'download-reward') {
      wallet.totalEarnings += amount;
      wallet.availableBalance += amount;
    } else if (type === 'withdrawal' || type === 'transfer') {
      if (wallet.availableBalance < amount) {
        return { success: false, message: 'Insufficient balance' };
      }
      wallet.availableBalance -= amount;
    }

    // Save changes
    await wallet.save();

    // After saving, update the last transaction's status to "confirmed"
    const lastTransactionIndex = wallet.transactions.length - 1;
    if (lastTransactionIndex >= 0) {
      wallet.transactions[lastTransactionIndex].status = 'confirmed';
    }

    // Save again to reflect the status change
    await wallet.save();

    // Populate the transactions array before returning
    const populatedWallet = await Wallet.findOne({ user: userId }).populate('transactions');

    return { success: true, message: 'Transaction completed successfully', wallet: populatedWallet };

  } catch (err) {
    console.error('Error adding transaction:', err);
    return { success: false, message: 'An error occurred' };
  }
}

// Export the function for use in other files
module.exports = { addTransaction };
