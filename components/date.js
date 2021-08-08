// 測試看資料是否統一長度

class Date {
  constructor({defaultDataCount=30, data}) {
    let obj = {};
    let lengthArr = Object.keys(data).map((element) => {
      obj[element] = data[element].filter((item,index)=>index<=defaultDataCount);
      return data[element].length;
    });
    this.length =
      [...new Set(lengthArr)].length === 1
        ? lengthArr[0]
        : [...new Set(lengthArr)];
    this.all = data;
    this.list = obj;
    this.observers = [];
    this.index = defaultDataCount;
  }

  getLength() {
    if (Array.isArray(this.length)) {
      console.log("資料長度不相等");
      return Math.min(this.length);
    }
    return this.length;
  }

  getList(number = this.index) {
    let keys = Object.keys(this.list);
    let response = {};
    keys.forEach((element) => {
      let obj = this.list[element].filter(
        (item, index) => index > this.index - number && index <= this.index
      );
      response[element] = obj;
    });
    return response;
  }

  setList() {
    let keys = Object.keys(this.list);
    keys.forEach((element) => {
      this.list[element].push(this.all[element][this.index]);
    });
  }

  setNext() {
    this.index++;
    this.setList();
    this.notifyAllObservers();
  }

  notifyAllObservers() {
    this.observers.forEach((observer) => {
      observer.update();
    });
  }

  attach(observer) {
    this.observers.push(observer);
  }
}
module.exports = Date;
