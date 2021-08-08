const Context = require("./context");
const Transaction = require("./transaction");

class Wrapper {
  constructor({
    date,
    capital = 300000,
    hightLoss = 0.1,
    handlingFeeRebate = 0.65,
    limitHandlingFee = 20,
    hightStockPrice = 150,
  }) {
    this.date = date;
    this.context = new Context({
      subject: date,
      capital,
      hightLoss,
      handlingFeeRebate,
      limitHandlingFee,
      hightStockPrice,
    });
    this.transaction = new Transaction({ handlingFeeRebate, limitHandlingFee });
  }

  run() {
    for (let i = 20; i < this.date.getLength(); i++) {
      this.date.setNext();
    }
  }

  show(detail) {
    let data = this.context.stock.get();
    let profitArr = Object.keys(data).map((key) => {
      let sell = this.transaction.getSellPrice(data[key]["nowPrice"]);
      let response = sell - data[key]["buy"];
      return response;
    });
    // 損益陣列相加
    let profit = 0;
    if (profitArr.length > 0) {
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      profit = profitArr.reduce(reducer);
    }
    let obj = {
      進出點:
        "符合昨日技術分析，以今日開盤價買進。 符合賣出條件，以今日最低價賣出",
      本金: this.context.capital,
      損益: this.context.profit,
      Win: this.context.win,
      Lose: this.context.lose,
      勝率: `${
        Math.round(
          (this.context.win / (this.context.win + this.context.lose)) * 1000
        ) / 10
      } %`,
      未實現損益: profit,
    };
    if (detail) {
      obj["目前持股"] = data;
    }
    // console.log(obj);
    return obj;
  }

  history() {
    let data = this.context.stock.getHistory();
    // console.log(data);
    return data;
  }
}
module.exports = Wrapper;
