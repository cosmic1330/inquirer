class Williams {
  // 回傳今日威廉指數;
  getWilliams(arr) {
    let maxArr = arr.map((item) => item && item["h"]);
    let minArr = arr.map((item) => item && item["l"]);
    let max = Math.max(...maxArr);
    let min = Math.min(...minArr);
    let close = arr[arr.length - 1] && arr[arr.length - 1]["c"];
    let williams = ((max - close) / (max - min)) * -100;
    return williams;
  }
}
module.exports = Williams;
