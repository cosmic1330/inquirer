const Wrapper = require("./components/wrapper");
const DateSequence = require("./components/date");

// 提供測試資料
const fs = require("fs");
let rawdata = fs.readFileSync("./datas/testData/20210828.json");
let stockdata = JSON.parse(rawdata);

let date = new DateSequence({
    defaultDataCount:19,
    data:stockdata
  });

const wrapper = new Wrapper({date, hightLoss:0.15, capital:300000, handlingFeeRebate:0.28, limitHandlingFee:1});
wrapper.run();
// let show = wrapper.show(true);
let show = wrapper.show();
let history = wrapper.history();

console.log(history);
