const fs = require("fs");

fs.readFile("logs/debug.log", "utf8", (err, text) => {
  if (err) {
    console.error("読み込みエラー:", err);
    return;
  }

  const blocks = [...text.matchAll(
    /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}).*?Array\s*\(([\s\S]*?)\)/g
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
  results.forEach((ele) => {
    data.push(ele)
  })

  function arrayToCSV(data) {
    const header = Object.keys(data[0]).join(",");
    const rows = data.map(obj =>
      Object.values(obj)
        .map(v => `"${String(v).replace(/"/g, '""')}"`) // CSV エスケープ
        .join(",")
    );
    return [header, ...rows].join("\n");
  }

  const csv = arrayToCSV(data);
  fs.writeFileSync("output.csv", csv, "utf8");
  console.log("-----CSVファイル output.csv を作成しました-----");
});