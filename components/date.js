// 測試看資料是否統一長度

class DateSequence {
  constructor({ data, startDate=null, endDate=null }) {
    // startDate
    if(startDate){
      this.startDate = startDate;
    }else{
      startDate = Date.parse(new Date()); // 預設
      Object.keys(data).forEach((key) => {
        let thisDate = data[key][0]["t"];
        thisDate = this.dateFormat(thisDate, 2);
        if (startDate > thisDate) {
          startDate = thisDate;
        }
      });
    }
    // defultList
    let defultList = {};
    Object.keys(data).forEach((key) => {
      if (this.dateFormat(data[key][0]["t"], 2) === startDate) {
        const firstElement = data[key].shift();
        defultList[key] = [firstElement];
      }
    });
    // endDate
    if(endDate){
      this.endDate = endDate
    }else{
      this.endDate = Date.parse(new Date());
    }
    this.currentList = defultList;
    this.laterList = data;
    this.observers = [];
    this.currentDate = startDate;
  }

  getCurrentDate() {
    return this.dateFormat(this.currentDate, 5);
  }

  getList() {
    return this.currentList;
  }

  setList() {
    let nextDate = this.currentDate + 24 * 60 * 60 * 1000;
    let keys = Object.keys(this.laterList);
    keys.forEach((key) => {
      // 沒有資料跳過
      if(this.laterList[key].length===0) return;
      // 處理資料
      if (
        this.dateFormat(this.laterList[key][0]["t"], 2) === nextDate &&
        this.currentList.hasOwnProperty(key)
      ) {
        const element = this.laterList[key].shift();
        this.currentList[key].push(element);
      } else if (
        this.dateFormat(this.laterList[key][0]["t"], 2) === nextDate &&
        !this.currentList.hasOwnProperty(key)
      ) {
        const element = this.laterList[key].shift();
        this.currentList[key] = [element];
      }
    });
    this.currentDate = nextDate;
  }

  setNext() {
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

  dateFormat(date, mode) {
    date = `${date}`;
    switch (mode) {
      case 1: // ex:20210801 --> 2021-08-01
        date =
          date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8);
        break;
      case 2: // ex:20210801 --> 時間戳記
        date =
          date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8);
        date = Date.parse(new Date(date));
        break;
      case 3: // ex:2021-08-01 --> 時間戳記
        date = Date.parse(new Date(date));
        break;
      case 4: // ex:時間戳記 --> 2021-08-01
        date = new Date(parseInt(date));
        let Y4 = date.getFullYear() + "-";
        let M4 =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        let D4 = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        date = Y4 + M4 + D4;
        break;
      case 5: // ex:時間戳記 --> 20210801
        date = new Date(parseInt(date));
        let Y5 = date.getFullYear();
        let M5 =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
        let D5 = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        date = Y5 + M5 + D5;
        break;
      case 6: // ex:2021-08-01 --> 20210801
        break;
      default:
        console.log("please select mode (1,2,3,4,5,6)");
        break;
    }
    return date;
  }
}
module.exports = DateSequence;
