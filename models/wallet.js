const mongoose = require('mongoose');

const UsdtWalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalEarnings: { type: Number, default: 0 },
  availableBalance: { type: Number, default: 0 },
  transactions: [
    {
      txId: { type: String, required: true },
      amount: { type: Number, required: true },
      type: { type: String, enum: ['view-reward', 'download-reward', 'withdrawal', 'transfer'] },
      status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const Wallet = mongoose.model('wallet', UsdtWalletSchema);
module.exports = Wallet;
