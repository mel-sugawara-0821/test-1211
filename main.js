const fs = require("fs");
const files = fs.readdirSync('logs');
const TARGET_STRING = '/api/MarsCardLess/relayAuthRequest';
let total_count = 0;
let total_file = 0;

files.forEach((e) => {
  total_file++
  fs.readFile(`logs/${e}`, "utf8", (err, text) => {
    if (err) {
      console.error("読み込みエラー:", err);
      return;
    }

    const blocks = [...text.matchAll(
      /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})[\s\S]*?Debug:\s*Array\s*\(\n([\s\S]*?)\n\)/g
    )];

    const results = [];

    for (const match of blocks) {
      const datetime = match[1];    // 日時
      const arrayBody = match[2];   // Array(...) 中身
      const obj = { datetime };     // 日付を最初にセット
      // 各 key => value を解析
      const lines = arrayBody.split("\n");

      for (const line of lines) {
        const kv = line.match(/\[(.+?)\]\s*=>\s*(.+)/);
        if (kv) {
          const key = kv[1].trim();
          const value = kv[2].trim();
          obj[key] = value;
        }
      }
      results.push(obj);
    }

    let data = [];
    let count = 0;
    results.forEach((ele) => {
      if (!(ele.REQUEST_URI == TARGET_STRING)) {
        return;
      }
      data.push(ele);
      count++
      total_count++
    })
    if (!data.length) {
      return;
    }
    if (count) {
      console.log(e)
      console.log(`${count}個の ${TARGET_STRING} を取得`);
      console.log(`合計: ${total_count}個`);
    }

    function arrayToCSV(data) {
      // const header = Object.keys(data[0]).join(",");
      const rows = data.map(obj =>
        Object.values(obj)
          .map(v => `"${String(v).replace(/"/g, '""')}"`) // CSV エスケープ
          .join(",")
      );    
      return [...rows].join("\n");
    }

    const csv = arrayToCSV(data);
    fs.appendFileSync("output.csv", `${csv}\n`, "utf8");
  });  
})
console.log("----------CSVファイル output.csv を作成しました----------");
console.log(`合計:${total_file}ファイル`);
