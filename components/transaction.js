class Transaction {
  constructor({ handlingFeeRebate, limitHandlingFee }) {
    this.handlingFeeRebate = handlingFeeRebate;
    this.limitHandlingFee = limitHandlingFee;
  }
  getBuyPrice(price, stockCount = 1000) {
    let buyPrice = price * stockCount; // 股價
    let handlingFee = buyPrice * 0.001425 * this.handlingFeeRebate; // 手續費
    if (handlingFee < this.limitHandlingFee) {
      buyPrice += 20;
    } else {
      buyPrice += handlingFee;
    }
    return Math.round(buyPrice);
  }
  getSellPrice(price, stockCount = 1000) {
    let sellPrice = price * stockCount; // 股價
    let handlingFee = sellPrice * 0.001425 * this.handlingFeeRebate; // 手續費
    if (handlingFee < this.limitHandlingFee) {
      sellPrice += 20;
    } else {
      sellPrice -= handlingFee;
    }
    sellPrice -= sellPrice * 0.003; // 交易稅
    return Math.round(sellPrice);
  }
}
module.exports = Transaction;
