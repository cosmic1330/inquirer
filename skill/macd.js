class MACD {
  getMACD($list) {
    // 首筆RSI
    let EMA12 = this.getEMA12($list);
    let EMA26 = this.getEMA26(EMA12);
    let DIF = this.getDIF(EMA26);
    let MACD9 = this.getMACD9(DIF);
    return MACD9;
  }

  getDI($data) {
    return ($data["h"] + $data["l"] + 2 * $data["c"]) / 4;
  }

  getStartEMA($arr) {
    let $sum = 0;
    $arr.forEach((element) => {
      let $DI = this.getDI(element);
      $sum += $DI;
    });
    return $sum / $arr.length;
  }

  getEMA12($list) {
    let start = $list.slice(0, 11);
    let beforeEMA12 = this.getStartEMA(start);
    for (let i = 12; i < $list.length; i++) {
      beforeEMA12 = (beforeEMA12 * 11) / 13 + (this.getDI($list[i]) * 2) / 13;
      $list[i]["EMA12"] = beforeEMA12;
    }
    return $list;
  }

  getEMA26($list) {
    let start = $list.slice(0, 25);
    let beforeEMA26 = this.getStartEMA(start);
    for (let i = 26; i < $list.length; i++) {
      beforeEMA26 = (beforeEMA26 * 25) / 27 + (this.getDI($list[i]) * 2) / 27;
      $list[i]["EMA26"] = beforeEMA26;
    }
    return $list;
  }

  getDIF($list) {
    for (let i = 26; i < $list.length; i++) {
      const element = $list[i];
      let DIF = element["EMA12"] - element["EMA26"];
      $list[i]["DIF"] = DIF;
    }
    return $list;
  }

  getMACD9($list) {
    if ($list.length > 50 && $list[42].hasOwnProperty("DIF")) {
      let start = $list
        .slice(42, 50)
        .map((item) => item["DIF"])
        .reduce((accumulator, currentValue) => accumulator + currentValue);
      $list[50]["MACD9"] = start;
      let beforeMACD9 = start;
      for (let i = 51; i < $list.length; i++) {
        const element = $list[i];
        beforeMACD9 = beforeMACD9 + ((element["DIF"] - beforeMACD9) * 2) / 10;
        $list[i]["MACD9"] = beforeMACD9;
        $list[i]["OSC"] = $list[i]["DIF"] - $list[i]["MACD9"];
      }
    }
    return $list;
  }
}
module.exports = MACD;
