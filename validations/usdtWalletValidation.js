// Function to validate USDT (BSC) address format
module.exports = function isValidBSCAddress(address) {
  const bscPattern = /^0x[a-fA-F0-9]{40}$/; // BSC uses the same format as Ethereum (0x...)
  return bscPattern.test(address);
};
