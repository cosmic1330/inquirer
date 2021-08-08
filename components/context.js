const Transaction = require("./transaction");
const Stock = require("./stock");
const BuyMethod = require("../logic/buy");
const SellMethod = require("../logic/sell");
class Context {
  constructor({
    capital = 300000,
    subject,
    hightLoss = 0.1,
    handlingFeeRebate = 0.65,
    limitHandlingFee = 20,
    hightStockPrice = 150,
  }) {
    this.capital = capital;
    this.stock = new Stock();
    this.transaction = new Transaction({ handlingFeeRebate, limitHandlingFee });
    this.buyMethod = new BuyMethod();
    this.sellMethod = new SellMethod();
    this.subject = subject;
    this.subject.attach(this);
    this.hightLoss = hightLoss;
    this.hightStockPrice = hightStockPrice;
    this.win = 0;
    this.lose = 0;
    this.profit = 0;
  }

  buy() {
    /* 
      基本條件:
        股價超過150忽略
        沒有本金忽略
        已買過的忽略
        昨日交易量超過 1000

      其次：
        符合邏輯買進
    */

    let list = this.subject.getList();
    let handle = this.stock.get();
    Object.keys(list).forEach((key) => {
      //  設定買進方式-------------------------------------------------
      let response = this.buyMethod.method3(list, key);
      //  ------------------------------------------------------------

      // 買進邏輯處理 + 紀錄訊息處理
      if (
        this.capital > 0 &&
        !handle.hasOwnProperty(key) &&
        response["o"] < this.hightStockPrice &&
        list[key][list[key].length - 2]["v"] > 1000
      ) {
        if (response.status) {
          let buy = this.transaction.getBuyPrice(response["o"]); // 買進價格
          let inDate = response["t"]; // 買進日期
          let count = 1000; // 買進張數
          let inPrice = response["o"]; // 買進股價
          let name = response["name"]; // 股票名稱
          let id = key; // 股票代號
          let pressure = response["pressure"]; // 壓力
          let shore = response["shore"]; // 支撐
          let verification = response["custom"]; // 客製化驗證訊息
          let detail = {
            buy,
            inDate,
            count,
            inPrice,
            name,
            id,
            pressure,
            shore,
            verification,
          };
          this.stock.save(key, detail);

          // 扣錢
          this.capital -= buy;
        }
      }
    });
  }
  sell() {
    /* 
      基本條件:
        虧損超過設定則賣出
        符合邏輯且大於買進價格賣出
    */
    let list = this.subject.getList();
    let handle = this.stock.get();
    Object.keys(handle).forEach((key) => {
      //  設定賣出方式-------------------------------------------------
      let response = this.sellMethod.method3(list, key);
      //  ------------------------------------------------------------

      // 賣出邏輯處理 + 紀錄訊息處理
      if (
        handle[key]["buy"] - handle[key]["buy"] * this.hightLoss >
        handle[key]["count"] * response["l"] // 虧損大於設定:賣出
      ) {
        let sell = this.transaction.getSellPrice(response["l"]); // 賣出價格
        let outDate = response["t"]; // 賣出日期
        let outPrice = response["l"]; // 賣出股價
        let profit = sell - handle[key]["buy"]; // 損益
        let verification = "達到最高虧損限制"; // 客製化驗證訊息
        let detail = {
          ...handle[key],
          outDate,
          outPrice,
          sell,
          profit,
          verification,
        };

        this.capital += sell;
        this.lose += 1;
        this.profit += profit;
        this.stock.remove(key, detail);
      } else if (response.status && response["l"] > handle[key]["inPrice"]) {
        let sell = this.transaction.getSellPrice(response["l"]); // 賣出價格
        let outDate = response["t"]; // 賣出日期
        let outPrice = response["l"]; // 賣出股價
        let profit = sell - handle[key]["buy"]; // 損益
        let verification = response["custom"]; // 客製化驗證訊息
        let detail = {
          ...handle[key],
          outDate,
          outPrice,
          sell,
          profit,
          verification,
        };

        // 計算輸贏
        this.capital += sell;
        if (profit > 0) {
          this.win += 1;
        } else {
          this.lose += 1;
        }
        this.profit += profit;
        this.stock.remove(key, detail);
      }
    });
  }
  updateNowPrice() {
    let list = this.subject.getList();
    let handle = this.stock.get();
    Object.keys(handle).forEach((key) => {
      let price = list[key][list[key].length - 1]["c"];
      this.stock.update(key, price);
    });
  }
  update() {
    // 當每日資料更新執行買賣
    this.updateNowPrice();
    this.sell();
    this.buy();
  }
}

module.exports = Context;
