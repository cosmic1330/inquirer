const Williams = require("../../skill/williams");
const RSI = require("../../skill/rsi");
const MA = require("../../skill/ma");
const MACD = require("../../skill/macd");
const Gold = require("../../skill/gold");

class SellMethod {
  constructor(list) {
    this.list = list;
    this.williams = new Williams();
    this.rsi = new RSI();
    this.ma = new MA();
    this.macd = new MACD();
    this.gold = new Gold();
  }
  method1(list, key) {
    /* 
       賣出:
          昨日 william9 高於-20 && william18 高於-20
          今日 william9 低於-20 && william18 低於-20
    */
    let william9 = this.williams.getWilliams(list[key].slice(-9));
    let william18 = this.williams.getWilliams(list[key].slice(-18));
    let beforeWilliam9 = this.williams.getWilliams(list[key].slice(-10, -1));
    let beforeWilliam18 = this.williams.getWilliams(list[key].slice(-19, -1));

    let response = list[key][list[key].length - 1];
    if (
      william9 > -20 &&
      william18 > -20 &&
      beforeWilliam9 < -20 &&
      beforeWilliam18 < -20
    ) {
      /* 
        custom提供驗證訊息
      */
      response.custom = {
        date: list[key][list[key].length - 1]["t"],
        william9,
        beforeWilliam9,
        william18,
        beforeWilliam18,
        method: 1,
        class: "sell",
      };
      response.status = true;
    } else {
      response.status = false;
    }
    return response;
  }

  method2(list, key) {
    /* 
       賣出:
          主力賣出時
    */
    let rsi = this.rsi.getRSI6(list[key]);
    let ma = this.ma.getMA(rsi);
    let response = ma[ma.length - 1];
    if (
      ma[ma.length - 2]["stockAgentMainPower"] < -100 &&
      ma[ma.length - 3]["stockAgentMainPower"] < -100 &&
      ma[ma.length - 4]["stockAgentMainPower"] < -100
    ) {
      /* 
        custom提供驗證訊息
      */
      response["custom"] = {
        date: ma[ma.length - 1]["t"],
        method: 2,
        class: "sell",
      };
      response.status = true;
    } else {
      response.status = false;
    }
    return response;
  }

  method3(list, key) {
    /* 
       賣出:
          投信賣出時
    */
    let ma = this.ma.getMA(list[key]);
    let response = ma[ma.length - 1];
    if (
      ma[ma.length - 2]["sumING"] < -100 &&
      ma[ma.length - 3]["sumING"] < -100 &&
      ma[ma.length - 4]["sumING"] < -100
    ) {
      /* 
        custom提供驗證訊息
      */
      response["custom"] = {
        date: list[key][list[key].length - 1]["t"],
        ma5: response["ma5"],
        method: 3,
        class: "sell",
      };
      response.status = true;
    } else {
      response.status = false;
    }
    return response;
  }

  method4(list, key) {
    /* 
       賣出:
          外資賣出時
    */
    let ma = this.ma.getMA(list[key]);
    let response = ma[ma.length - 1];
    if (
      ma[ma.length - 2]["sumForeignNoDealer"] < -100 &&
      ma[ma.length - 3]["sumForeignNoDealer"] < -100 &&
      ma[ma.length - 4]["sumForeignNoDealer"] < -100
    ) {
      /* 
        custom提供驗證訊息
      */
      response["custom"] = {
        date: list[key][list[key].length - 1]["t"],
        ma5: response["ma5"],
        method: 4,
        class: "sell",
      };
      response.status = true;
    } else {
      response.status = false;
    }
    return response;
  }
}

module.exports = SellMethod;
