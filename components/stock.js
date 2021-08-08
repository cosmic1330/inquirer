
class Stock {
    constructor() {
      this.list = {};
      this.history = [];
    }
    save(key, value) {
      this.list[key] = value;
    }
    remove(key, value) {
      delete this.list[key];
      this.history.push(value);
    }
    update(key,price){
      this.list[key].nowPrice = price;
    }
    get() {
      return this.list;
    }
    getHistory() {
      return this.history;
    }
  }
  
  module.exports = Stock;