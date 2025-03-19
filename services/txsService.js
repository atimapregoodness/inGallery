const mongoose = require('mongoose');
const Wallet = require('../models/wallet'); // Adjust path to your model

// Function to add a transaction
async function addTransaction(userId, amount, currency, type) {
  if (!userId || amount <= 0) {
    return { success: false, message: 'Invalid transaction details' };
  }

  try {
    // Find user's wallet
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return { success: false, message: 'Wallet not found' };
    }

    // Check for sufficient balance before proceeding
    if (['withdrawal', 'transfer'].includes(type) && wallet.availableBalance < amount) {
      return { success: false, message: 'Insufficient balance' };
    }

    // Create a transaction object
    const transaction = {
      txId: new mongoose.Types.ObjectId().toString(),
      amount,
      currency,
      type,
      status: 'successful', // Directly marking it as confirmed
      createdAt: new Date()
    };

    // Define update object
    const updateData = {
      $push: { transactions: transaction },
      $inc: {}
    };

    // Handle different transaction types
    if (['view-reward', 'download-reward'].includes(type)) {
      updateData.$inc.totalEarnings = amount;
      updateData.$inc.availableBalance = amount;
    } else if (['withdrawal', 'transfer'].includes(type)) {
      updateData.$inc.availableBalance = -amount;
    }

    // Perform atomic update
    const updatedWallet = await Wallet.findOneAndUpdate({ user: userId }, updateData, { new: true }).populate('transactions');

    return { success: true, message: 'Transaction completed successfully', wallet: updatedWallet };

  } catch (err) {
    console.error('Error adding transaction:', err);
    return { success: false, message: 'An error occurred' };
  }
}


async function addConvert(userId, amount, conversionRate) {
  if (!userId || amount <= 0) {
    return { success: false, message: 'Invalid conversion details' };
  }

  try {
    // Find user's wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return { success: false, message: 'Wallet not found' };
    }

    if (wallet.availableBalance < amount) {
      return { success: false, message: 'Insufficient points balance' };
    }

    // Calculate USDT amount
    const usdtAmount = amount * conversionRate;

    // Generate transaction IDs
    const pointsTxId = new mongoose.Types.ObjectId().toString();
    const usdtTxId = new mongoose.Types.ObjectId().toString();

    // Perform atomic update
    const updatedWallet = await Wallet.findOneAndUpdate(
      { user: userId },
      {
        $inc: {
          availableBalance: -amount,  // Deduct points
          usdtBalance: usdtAmount     // Add USDT
        },
        $push: {
          transactions: {
            $each: [
              {
                txId: pointsTxId,
                amount: amount,
                currency: 'points',
                type: 'conversion-deduction', // Updated type to indicate deduction
                status: 'successful',
                createdAt: new Date()
              },
              {
                txId: usdtTxId,
                amount: usdtAmount, // Adding USDT
                currency: 'usdt',
                type: 'conversion-credit', // Updated type to indicate credit
                status: 'successful',
                createdAt: new Date()
              }
            ]
          }
        }
      },
      { new: true }
    );

    return { success: true, message: 'Points converted to USDT successfully', wallet: updatedWallet };

  } catch (err) {
    console.error('Transaction error:', err);
    return { success: false, message: 'An error occurred while converting points' };
  }
}


// Export function
module.exports = { addTransaction, addConvert };
