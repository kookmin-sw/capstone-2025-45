// generateQR.js
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

// 프로젝트 ID와 토큰 목록 (예시)
const projects = [
  { id: "1", token: "123abc" },
  { id: "2", token: "456def" },
  { id: "3", token: "789ghi" },
  { id: "4", token: "111aaa" },
];

const outputDir = "./output";

// 디렉토리 없으면 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

projects.forEach(async ({ id, token }) => {
  const url = `https://kmu-capstone-vote.web.app/project/${id}?qr=${token}`;
  const outputPath = path.join(outputDir, `project-${id}.png`);

  try {
    await QRCode.toFile(outputPath, url);
    console.log(`project-${id} QR 생성 완료: ${url}`);
  } catch (err) {
    console.error(`project-${id} QR 생성 실패`, err);
  }
});
