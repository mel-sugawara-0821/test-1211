console.log("hash-------------------");

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const INPUT_FILE = path.join(__dirname, "passwords.txt");
const OUTPUT_FILE = path.join(__dirname, "hashed-passwords.txt");

const SALT_ROUNDS = 10;

async function main() {
  // ファイル読み込み
  const data = fs.readFileSync(INPUT_FILE, "utf8");

  // 改行ごとに分割（空行除外）
  const passwords = data
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const results = [];

  for (const password of passwords) {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    // results.push(`${password} => ${hash}`);
    results.push(hash);
  }

  // 結果を書き込み
  fs.writeFileSync(OUTPUT_FILE, results.join("\n"), "utf8");

  console.log("ハッシュ化完了");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
