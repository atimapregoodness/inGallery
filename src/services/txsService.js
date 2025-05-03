const mongoose = require("mongoose");
const Wallet = require("../models/wallet"); // Adjust path to your model
const PersonalMsg = require("../models/personalMsg"); // Adjust path to your model
const User = require("../models/user"); // Adjust path to your model
const CommMsg = require("../models/commMsg"); // Adjust path to your model

// Function to add a transaction
async function addTransaction(userId, amount, currency, type, imgUser) {
  if (!userId || amount <= 0) {
    return { success: false, message: "Invalid transaction details" };
  }

  try {
    // Find user's wallet
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return { success: false, message: "Wallet not found" };
    }

    // Check for sufficient balance before proceeding
    if (
      ["withdrawal", "transfer"].includes(type) &&
      wallet.availableBalance < amount
    ) {
      return { success: false, message: "Insufficient balance" };
    }

    // Create a transaction object
    const transaction = {
      txId: new mongoose.Types.ObjectId().toString(),
      amount,
      currency,
      type,
      status: "successful", // Directly marking it as confirmed
      createdAt: new Date(),
    };

    // Define update object
    const updateData = {
      $push: { transactions: transaction },
      $inc: {},
    };

    // Handle different transaction types
    if (["view-reward", "download-reward"].includes(type)) {
      updateData.$inc.totalEarnings = amount;
      updateData.$inc.availableBalance = amount;
    } else if (["withdrawal", "transfer"].includes(type)) {
      updateData.$inc.availableBalance = -amount;
    }

    // Perform atomic update
    const updatedWallet = await Wallet.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true }
    ).populate("transactions");

    const user = await User.findById(userId).populate("personalMsg");
    // const imgUser = await User.findById(userId).populate("uploadedImages");

    let messageBody;

    switch (type) {
      case "withdrawal":
        messageBody = `Your withdrawal request of ${amount} ${currency} has been processed successfully.`;
        break;
      case "view-reward":
        messageBody = `You have earned ${amount} IGP for a new view on your image by ${
          imgUser.username || "a user"
        }.`;
        break;
      case "download-reward":
        messageBody = `You have earned ${amount} IGP for a new download of your image by ${
          imgUser.username || "a user"
        }.`;
        break;
      case "transfer":
        messageBody = `You have successfully transferred ${amount}${currency} to another user.`;
        break;
      default:
        messageBody = `A transaction of type ${type} for ${amount} ${currency} has been completed.`;
    }

    const personalMsg = new PersonalMsg({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      body: messageBody,
      user: userId,
    });

    await user.personalMsg.push(personalMsg._id);

    await user.save();
    await personalMsg.save();

    return {
      success: true,
      message: "Transaction completed successfully",
      wallet: updatedWallet,
    };
  } catch (err) {
    console.error("Error adding transaction:", err);
    return { success: false, message: "An error occurred" };
  }
}

async function addConvert(userId, amount, conversionRate) {
  if (!userId || amount <= 0) {
    return { success: false, message: "Invalid conversion details" };
  }

  try {
    // Find user's wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return { success: false, message: "Wallet not found" };
    }

    if (wallet.availableBalance < amount) {
      return { success: false, message: "Insufficient points balance" };
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
          availableBalance: -amount, // Deduct points
          usdtBalance: usdtAmount, // Add USDT
        },
        $push: {
          transactions: {
            $each: [
              {
                txId: pointsTxId,
                amount: amount,
                currency: "points",
                type: "conversion-deduction",
                status: "successful",
                createdAt: new Date(),
              },
              {
                txId: usdtTxId,
                amount: usdtAmount,
                currency: "usdt",
                type: "conversion-credit",
                status: "successful",
                createdAt: new Date(),
              },
            ],
          },
        },
      },
      { new: true }
    );

    const user = await User.findById(userId).populate("personalMsg");

    // Create messages for the user
    const deductionMessageBody = `Your account has been debited with ${amount} IGP for conversion.`;
    const creditMessageBody = `Your account has been credited with ${usdtAmount.toFixed(
      2
    )} USDT after conversion.`;

    const deductionPersonalMsg = new PersonalMsg({
      title: "IGP Conversion - Deduction",
      body: deductionMessageBody,
      user: userId,
    });

    const creditPersonalMsg = new PersonalMsg({
      title: "IGP Conversion - Credit",
      body: creditMessageBody,
      user: userId,
    });

    await user.personalMsg.push(deductionPersonalMsg._id);
    await user.personalMsg.push(creditPersonalMsg._id);

    await user.save();
    await deductionPersonalMsg.save();
    await creditPersonalMsg.save();

    await user.save();

    return {
      success: true,
      message: "IGPoints converted to USDT successfully",
      wallet: updatedWallet,
    };
  } catch (err) {
    console.error("Transaction error:", err);
    return {
      success: false,
      message: "An error occurred while converting points",
    };
  }
}

async function withdrawAddTransaction(userId, amount, currency) {
  if (!userId || amount <= 0) {
    return { success: false, message: "Invalid withdrawal details" };
  }

  try {
    // Find user's wallet
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return { success: false, message: "Wallet not found" };
    }

    // Check for sufficient balance before proceeding
    if (wallet.usdtBalance < amount) {
      return { success: false, message: "Insufficient balance" };
    }

    // Create a transaction object
    const transaction = {
      txId: new mongoose.Types.ObjectId().toString(),
      amount,
      currency,
      type: "withdrawal",
      status: "pending", // Marking it as pending initially
      createdAt: new Date(),
    };

    // Define update object
    const updateData = {
      $push: { transactions: transaction },
      $inc: { usdtBalance: -amount }, // Deducting balance immediately
    };

    // Perform atomic update
    const updatedWallet = await Wallet.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true }
    ).populate("transactions");

    // Simulate delay for transaction processing
    setTimeout(async () => {
      try {
        // Update the transaction status to successful
        await Wallet.updateOne(
          { user: userId, "transactions.txId": transaction.txId },
          { $set: { "transactions.$.status": "successful" } }
        );
        console.log(`Transaction ${transaction.txId} marked as successful`);
      } catch (err) {
        console.error(
          `Error updating transaction ${transaction.txId} to successful:`,
          err
        );
      }
    }, 10000); // 10 seconds delay

    return {
      success: true,
      message: "Withdrawal transaction initiated and marked as pending",
      wallet: updatedWallet,
    };
  } catch (err) {
    console.error("Error processing withdrawal transaction:", err);
    return { success: false, message: "An error occurred" };
  }
}

// Export function
module.exports = { addTransaction, addConvert, withdrawAddTransaction };
