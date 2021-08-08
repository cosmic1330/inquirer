const fs = require("fs");
const inquirer = require("inquirer");
const Wrapper = require("./components/wrapper");


// 取得所有測試檔案
let jsonFiles = [];
let files = fs.readdirSync("./datas/testData");
files.forEach((item, index) => {
  jsonFiles.push(item);
});

function runTest(ans){
  console.log('執行中....\n');
  let rawdata = fs.readFileSync("./datas/testData/"+ans[0]);
  let stockdata = JSON.parse(rawdata);
  const Date = require("./components/date");
  let date = new Date({
    defaultDataCount:19,
    data:stockdata
  });
  const wrapper = new Wrapper({date, hightLoss:ans[2], capital:ans[3], handlingFeeRebate:ans[4], limitHandlingFee:ans[5]});
  wrapper.run();
  let response = wrapper.show(ans[1]);
  console.log(response)
}

// 執行交互式命令行用户界面
function run() {
  const ans = ["20210705.json", false, 0.15, 200000, 0.65, 20];
  inquirer
    .prompt([
      {
        type: "list",
        message: "選擇你的測試檔案",
        name: "testFile",
        choices: jsonFiles,
        default: "20210705.json",
      },
    ])
    .then((answers) => {
      console.log("你選擇的檔案是" + answers.testFile, "\n");
      ans[0] = answers.testFile;
    })
    .then(() => {
      inquirer
        .prompt([
          {
            type: "confirm",
            message: "是否要顯示詳細資訊",
            name: "detail",
            default: false,
          },
        ])
        .then((answers) => {
          console.log("show detail: " + answers.detail, "\n");
          ans[1] = answers.detail;
        })
        .then(() => {
          inquirer
            .prompt([
              {
                type: "input",
                message: "條件設定1: 最高虧損, ex:0.15 (代表虧損超過15%)",
                name: "hightLoss",
                default: 0.15,
              },
            ])
            .then((answers) => {
              let data = parseFloat(answers.hightLoss);
              if (data > 0.01 && data < 1) {
                console.log("setting hightLoss: " + answers.hightLoss, "\n");
                ans[2] = answers.hightLoss;
              } else {
                console.log("輸入不正確，設定預設0.15", "\n");
              }
            })
            .then(() => {
              inquirer
                .prompt([
                  {
                    type: "input",
                    message: "條件設定2: 本金, ex:200000 (二十萬)",
                    name: "capital",
                    default: 200000,
                  },
                ])
                .then((answers) => {
                  let data = parseInt(answers.capital);
                  if (Number.isInteger(data) && data > 0) {
                    console.log("setting capital: " + data, "\n");
                    ans[3] = data;
                  } else {
                    console.log("輸入不正確，設定預設200000", "\n");
                  }
                })
                .then(() => {
                  inquirer
                    .prompt([
                      {
                        type: "confirm",
                        message:
                          "是否要使用預設手續費折扣(65折)及最低手續費(20元)",
                        name: "default",
                        default: true,
                      },
                    ])
                    .then((answers) => {
                      if(answers.default){
                        inquirer
                          .prompt([
                            {
                              type: "confirm",
                              message:
                                `Please confirm\n----------------\n測試檔案: ${ans[0]},\n顯示詳細資訊: ${ans[1]},\n最高虧損: ${ans[2]*100}%,\n本金: $${ans[3]},\n手續費折扣: ${ans[4]*100}%,\n最低手續費: $${ans[5]},\n----------------\n`,
                              name: "default",
                              default: true,
                            },
                          ])
                          .then(() => {
                            // 執行囉
                            runTest(ans)
                          });
                      }else{
                        inquirer
                          .prompt([
                            {
                              type: "input",
                              message:
                                "條件設定3: 手續費折扣, ex:0.65 (65折)",
                              name: "handlingFeeRebate",
                              default: 0.65,
                            },
                          ])
                          .then((answers) => {
                            let data = parseFloat(answers.handlingFeeRebate);
                            if (data > 0.01 && data < 1) {
                              console.log("setting handlingFeeRebate: " + data, "\n");
                              ans[4] = data;
                            } else {
                              console.log("輸入不正確，設定預設0.65", "\n");
                            }
                          })
                          .then(()=>{
                            inquirer
                              .prompt([
                                {
                                  type: "input",
                                  message:
                                    "條件設定4: 最低手續費, ex:20 (20元)",
                                  name: "limitHandlingFee",
                                  default: 0.65,
                                },
                              ])
                              .then((answers) => {
                                let data = parseInt(answers.limitHandlingFee);
                                if (Number.isInteger(data) && data > 0) {
                                  console.log("setting limitHandlingFee: " + data, "\n");
                                  ans[5] = data;
                                } else {
                                  console.log("輸入不正確，設定預設20", "\n");
                                }
                              })
                              .then(()=>{
                                inquirer
                                  .prompt([
                                    {
                                      type: "confirm",
                                      message:
                                        `Please confirm\n----------------\n測試檔案: ${ans[0]},\n顯示詳細資訊: ${ans[1]},\n最高虧損: ${ans[2]*100}%,\n本金: $${ans[3]},\n手續費折扣: ${ans[4]*100}%,\n最低手續費: $${ans[5]},\n----------------\n`,
                                      name: "default",
                                      default: true,
                                    },
                                  ])
                                  .then(() => {
                                    // 執行囉
                                    runTest(ans)
                                  });
                              })
                          })
                      }
                    })
                });
            });
        });
    });
}
run();
