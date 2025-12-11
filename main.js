const fs = require("fs");

fs.readFile("logs/debug.log", "utf8", (err, text) => {
  if (err) {
    console.error("読み込みエラー:", err);
    return;
  }
  console.log("読み込んだ内容:", text);
  const blocks = [...text.matchAll(/Array\s*\(([\s\S]*?)\)/g)];
  const results = [];

  for (const block of blocks) {
    const lines = block[1].split("\n");
    const obj = {};
    for (const line of lines) {
      const match = line.match(/\[(.+?)\]\s*=>\s*(.+)/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        obj[key] = value;
      }
    }
    results.push(obj);
  }
  console.log('r---------------')
  console.log(results);
});

const data = [
  { time: "10:00", store_id: 24, user_code: "80101964" },
  { time: "11:00", store_id: 30, user_code: "80101965" },
  { time: "12:00", store_id: 30, user_code: "90101964" }
];

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
console.log("CSVファイル output.csv を作成しました");