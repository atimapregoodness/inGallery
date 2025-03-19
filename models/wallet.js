const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalEarnings: { type: Number, default: 0 }, // Total earnings in points
  availableBalance: { type: Number, default: 0 }, // Available points balance
  usdtBalance: { type: Number, default: 0 }, // USDT balance
  transactions: [
    {
      txId: { type: String, required: true },
      amount: { type: Number, required: true },
      currency: { type: String, enum: ['points', 'usdt'], required: true }, // Currency type
      type: { type: String, enum: ['view-reward', 'download-reward', 'withdrawal', 'transfer', 'conversion-deduction', 'conversion-credit'] },
      status: { type: String, enum: ['pending', 'successful', 'failed'], default: 'pending' },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const Wallet = mongoose.model('Wallet', WalletSchema);
module.exports = Wallet;
