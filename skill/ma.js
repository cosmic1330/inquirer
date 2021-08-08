class MA {
  getMA($list) {
    // 首筆RSI
    let response = this.getMA5($list);
    response = this.getMA10(response);
    response = this.getMA20(response);
    response = this.getBOLL(response);
    return response;
  }

  getMA5($list) {
    let $length = $list.length;
    for (let $i = 4; $i < $length; $i++) {
      let $sum =
        $list[$i]["c"] +
        $list[$i - 1]["c"] +
        $list[$i - 2]["c"] +
        $list[$i - 3]["c"] +
        $list[$i - 4]["c"];
      $list[$i]["ma5"] = Math.round(($sum / 5) * 100) / 100;
    }
    return $list;
  }

  getMA10($list) {
    let $length = $list.length;
    for (let $i = 9; $i < $length; $i++) {
      let $sum =
        $list[$i]["c"] +
        $list[$i - 1]["c"] +
        $list[$i - 2]["c"] +
        $list[$i - 3]["c"] +
        $list[$i - 4]["c"]+
        $list[$i - 5]["c"]+
        $list[$i - 6]["c"]+
        $list[$i - 7]["c"]+
        $list[$i - 8]["c"]+
        $list[$i - 9]["c"];
      $list[$i]["ma10"] = Math.round(($sum / 10) * 100) / 100;
    }
    return $list;
  }

  getMA20($list) {
    let $length = $list.length;
    for (let $i = 19; $i < $length; $i++) {
      let $sum =
        $list[$i]["c"] +
        $list[$i - 1]["c"] +
        $list[$i - 2]["c"] +
        $list[$i - 3]["c"] +
        $list[$i - 4]["c"] +
        $list[$i - 5]["c"] +
        $list[$i - 6]["c"] +
        $list[$i - 7]["c"] +
        $list[$i - 8]["c"] +
        $list[$i - 9]["c"] +
        $list[$i - 10]["c"] +
        $list[$i - 11]["c"] +
        $list[$i - 12]["c"] +
        $list[$i - 13]["c"] +
        $list[$i - 14]["c"] +
        $list[$i - 15]["c"] +
        $list[$i - 16]["c"] +
        $list[$i - 17]["c"] +
        $list[$i - 18]["c"] +
        $list[$i - 19]["c"];
      $list[$i]["ma20"] = Math.round(($sum / 20) * 100) / 100;
    }
    return $list;
  }

  getBOLL($list) {
    let $length = $list.length;
    for (let $i = 24; $i < $length; $i++) {
      // ma25
      let $sumMA25 =
        $list[$i]["c"] +
        $list[$i - 1]["c"] +
        $list[$i - 2]["c"] +
        $list[$i - 3]["c"] +
        $list[$i - 4]["c"] +
        $list[$i - 5]["c"] +
        $list[$i - 6]["c"] +
        $list[$i - 7]["c"] +
        $list[$i - 8]["c"] +
        $list[$i - 9]["c"] +
        $list[$i - 10]["c"] +
        $list[$i - 11]["c"] +
        $list[$i - 12]["c"] +
        $list[$i - 13]["c"] +
        $list[$i - 14]["c"] +
        $list[$i - 15]["c"] +
        $list[$i - 16]["c"] +
        $list[$i - 17]["c"] +
        $list[$i - 18]["c"] +
        $list[$i - 19]["c"] +
        $list[$i - 20]["c"] +
        $list[$i - 21]["c"] +
        $list[$i - 22]["c"] +
        $list[$i - 23]["c"] +
        $list[$i - 24]["c"];
      $list[$i]["ma25"] = Math.round(($sumMA25 / 25) * 100) / 100;

      // 標準差
      let $sumBase =
        Math.pow($list[$i]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 1]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 2]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 3]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 4]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 5]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 6]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 7]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 8]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 9]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 10]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 11]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 12]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 13]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 14]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 15]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 16]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 17]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 18]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 19]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 20]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 21]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 22]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 23]["c"] - $list[$i]["ma25"],2) +
        Math.pow($list[$i - 24]["c"] - $list[$i]["ma25"],2);
      let base = Math.round(Math.sqrt($sumBase / 25) * 100) / 100;
      $list[$i]["UB"] = $list[$i]["ma25"]+2*base;
      $list[$i]["LB"] = $list[$i]["ma25"]-2*base;
    }
    return $list;
  }
}
module.exports = MA;
