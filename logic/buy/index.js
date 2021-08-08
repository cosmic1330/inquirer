const Williams = require("../../skill/williams");
const RSI = require("../../skill/rsi");
const MA = require("../../skill/ma");
const MACD = require("../../skill/macd");
const Gold = require("../../skill/gold");
const waveLow = require("../../utils/waveLow");
const waveHight = require("../../utils/waveHight");

// **   注意：所有使用技術測試日期都要取昨日不可使用今日，因為買入是以今日開盤價買入   **
class BuyMethod {
  constructor() {
    this.williams = new Williams();
    this.rsi = new RSI();
    this.ma = new MA();
    this.macd = new MACD();
    this.gold = new Gold();
  }
  filterData(response, method, list) {
    // 計算壓力支撐
    let pressure = null;
    let shore = null;
    if (list.length > 60) {
      list = list.slice(-60);
      let indexObj = list.map((item) => item.v);
      let maxVolume = list.reduce(function (prev, item, index) {
        return Math.max(prev, item.v);
      }, 0);
      let index = indexObj.indexOf(maxVolume);
      if (list[index]["h"] < list[list.length - 1]["c"]) {
        shore = list[index]["h"];
      } else {
        pressure = list[index]["h"];
      }
    }
    response["pressure"] = pressure;
    response["shore"] = shore;

    response["status"] = true;
    response["custom"]["class"] = "buy";
    response["custom"]["method"] = method;
    return response;
  }

  method1(list, key) {
    /* 
      買進:
        ris6大於昨日ris6
        OSC 翻轉 或 大於昨日OSC
        威廉小於 -20
    */
    let rsi = this.rsi.getRSI6(list[key]);
    let macd = this.macd.getMACD(rsi);
    let william9 = this.williams.getWilliams(macd.slice(-10, -1));
    let william18 = this.williams.getWilliams(macd.slice(-19, -1));
    let response = macd[macd.length - 1];
    if (
      macd[macd.length - 2]["v"] > 1000 &&
      macd[macd.length - 2]["rsi6"] > macd[macd.length - 3]["rsi6"] &&
      ((macd[macd.length - 2]["OSC"] > 0 && macd[macd.length - 3]["OSC"] < 0) ||
        (macd[macd.length - 2]["OSC"] > macd[macd.length - 3]["OSC"] &&
          macd[macd.length - 2]["OSC"] > 0)) &&
      (william9 < -20 || william18 < -20)
    ) {
      response["custom"] = {
        date: macd[macd.length - 2]["t"],
        RSI6: macd[macd.length - 2]["rsi6"],
        DIF: macd[macd.length - 2]["DIF"],
        MACD9: macd[macd.length - 2]["MACD9"],
        OSC: macd[macd.length - 2]["OSC"],
        William9: william9,
        William18: william18,
      };
      response = this.filterData(response, 1, macd);
    } else {
      response.status = false;
    }
    return response;
  }

  method2(list, key) {
    /* 
      買進:
        主力買進兩日
    */
    let rsi = this.rsi.getRSI6(list[key]);
    let ma = this.ma.getMA(rsi);

    let response = list[key][list[key].length - 1];
    if (
      ma[ma.length - 2]["stockAgentMainPower"] > 1000 &&
      ma[ma.length - 3]["stockAgentMainPower"] > 1000
    ) {
      /* 
        custom提供驗證訊息
      */
      response["custom"] = {
        date: list[key][list[key].length - 2]["t"],
      };
      response = this.filterData(response, 2, ma);
    } else {
      response.status = false;
    }
    return response;
  }

  method3(list, key) {
    /* 
      買進:
        投信買進兩日
    */
    let ma = this.ma.getMA(list[key]);
    let response = ma[ma.length - 1];

    if (
      ma[ma.length - 2]["sumING"] > 1000 &&
      ma[ma.length - 3]["sumING"] > 1000
    ) {
      /* 
        custom提供驗證訊息
      */
      response["custom"] = {
        date: ma[ma.length - 2]["t"],
        sumING: ma[ma.length - 2]["sumING"],
        beforeSumING: ma[ma.length - 3]["sumING"],
      };
      response = this.filterData(response, 3, ma);
    } else {
      response.status = false;
    }
    return response;
  }

  method4(list, key) {
    /* 
      買進:
        外資買進三日
    */
    let ma = this.ma.getMA(list[key]);
    let response = ma[ma.length - 1];

    if (
      ma[ma.length - 2]["sumForeignNoDealer"] > 100 &&
      ma[ma.length - 3]["sumForeignNoDealer"] > 100 &&
      ma[ma.length - 4]["sumForeignNoDealer"] > 100
    ) {
      /* 
        custom提供驗證訊息
      */
      response["custom"] = {
        date: ma[ma.length - 2]["t"],
        sumING: ma[ma.length - 2]["sumING"],
        beforeSumING: ma[ma.length - 3]["sumING"],
      };
      response = this.filterData(response, 4, ma);
    } else {
      response.status = false;
    }
    return response;
  }

  method5(list, key) {
    /* 
      買進:
        不高於布林通道(頂部)
        主力買進
        兩日不破前低
        配合賣出方法2
    */
    let ma = this.ma.getMA(list[key]);
    let macd = this.macd.getMACD(ma);

    let response = ma[ma.length - 1];
    if (
      macd[macd.length - 2]["v"] > 1000 &&
      macd[macd.length - 2]["c"] < macd[macd.length - 2]["UB"] &&
      macd[macd.length - 2]["stockAgentMainPower"] > 500 &&
      macd[macd.length - 3]["stockAgentMainPower"] > 500 &&
      macd[macd.length - 2]["l"] > macd[macd.length - 3]["l"] &&
      macd[macd.length - 3]["l"] > macd[macd.length - 4]["l"] &&
      ((macd[macd.length - 2]["OSC"] > 0 && macd[macd.length - 3]["OSC"] < 0) ||
        (macd[macd.length - 2]["OSC"] > macd[macd.length - 3]["OSC"] &&
          macd[macd.length - 2]["OSC"] > 0))
    ) {
      /* 
        custom提供驗證訊息
      */
      response["custom"] = {
        date: ma[ma.length - 2]["t"],
      };
      response = this.filterData(response, 5, list[key]);
    } else {
      response.status = false;
    }
    return response;
  }
}
module.exports = BuyMethod;
