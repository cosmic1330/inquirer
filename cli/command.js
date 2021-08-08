#!/usr/bin/env node
const program = require("commander");
const fs = require("fs");

program.version("0.0.1", "-v, --version", "output the current version");

program
  .description("Split the current Price/data.json for test data")
  .option("-a, --all", "split data.json to <date>.json")
  .option("-i, --id <stockId>", "split data.json to  <stockId>.json")
  .option(
    "-d, --debug <fileName>",
    "debug testData/<fileName>.json of data length"
  );

program.parse();

const options = program.opts();
if (options.all !== undefined && options.id === undefined)
    runAll();
else if (options.id !== undefined && options.all === undefined)
    runID(options.id);
else if (options.id !== undefined && options.all !== undefined)
  console.error(`Can not be used at the same time as -i and -a.`);

if(options.debug && options.id === undefined && options.all === undefined)
  runDebug(options.debug)

function runAll(){
    let rawdata = fs.readFileSync("./datas/Price/data.json");
    let stockdata = JSON.parse(rawdata);
    fs.copyFile("./datas/Price/data.json",`./datas/testData/${stockdata['1101'][stockdata['1101'].length-1]['t']}.json`, (error) => {
        if (error) {
            console.log("測試檔案寫入失敗");
          } else {
            console.log(`測試檔案${stockdata['1101'][stockdata['1101'].length-1]['t']}.json寫入成功`);
          }
      });
}

function runID(id){
    let rawdata = fs.readFileSync("./datas/Price/data.json");
    let stockdata = JSON.parse(rawdata);
    fs.writeFile(
        `./datas/testData/${id}.json`,
        JSON.stringify({[id]:stockdata[id]}),
        function (error) {
          if (error) {
            console.log("測試檔案寫入失敗");
          } else {
            console.log(`測試檔案${id}.json寫入成功`);
          }
        }
    );
}

function runDebug(fileName){
    let rawdata = fs.readFileSync(`./datas/testData/${fileName}`);
    let stockdata = JSON.parse(rawdata);
    let keys = Object.keys(stockdata)

    let lens = new Set();
    let lenStockList = {}
    keys.forEach(key => {
        lens.add(stockdata[key].length);
        if(lenStockList.hasOwnProperty(stockdata[key].length)){
            lenStockList[stockdata[key].length].push(key)
        }else{
            lenStockList[stockdata[key].length] = [key]
        }
    });
    console.log('\n',`長度: ${JSON.stringify([...lens])}`,'\n',`詳細資訊: ${JSON.stringify(lenStockList)}`)
}
