// tools/generateQR.js
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

// 🔢 프로젝트 ID 자동 생성(QR생성할 프로젝트 수 = length)
const projects = Array.from({ length: 4 }, (_, i) => ({ id: (i + 1).toString() }));

// 🔐 랜덤 토큰 생성 함수 (기본 12자리)
const generateToken = (length = 12) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const outputDir = "./output";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// ✅ QR 코드 생성 + token 저장
const tokenData = [];

projects.forEach(async ({ id }) => {
  const token = generateToken();
  const url = `https://kmu-capstone-vote.firebaseapp.com/project/${id}?qr=${token}`;
  const outputPath = path.join(outputDir, `project-${id}.png`);

  try {
    await QRCode.toFile(outputPath, url);
    console.log(`✅ QR 생성 완료: ${url}`);
    tokenData.push({ id, token });

    // 모든 QR 생성 완료 후 token JSON 저장
    if (tokenData.length === projects.length) {
      const jsonPath = path.join(outputDir, "project-tokens.json");
      fs.writeFileSync(jsonPath, JSON.stringify(tokenData, null, 2));
      console.log(`📦 토큰 목록 저장 완료: ${jsonPath}`);
    }
  } catch (err) {
    console.error(`❌ QR 생성 실패 (id=${id})`, err);
  }
});
