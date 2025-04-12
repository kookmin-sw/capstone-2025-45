// tools/exportUserVotesToCSV.js

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM용 __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔐 서비스 계정 키 로딩
const serviceAccountPath = path.join(__dirname, "./serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Firebase Admin 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const outputDir = path.join(__dirname, "../output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const exportUserVotesToCSV = async () => {
  const usersRef = db.collection("users");
  const usersSnapshot = await usersRef.get();

  // ✅ displayName 열 추가
  const rows = [
    ["UID", "사용자 이름", "프로젝트 ID", "위도", "경도", "거리(km)", "투표 시간"]
  ];

  usersSnapshot.forEach((doc) => {
    const data = doc.data();
    const uid = doc.id;
    const name = data.displayName || "";
    const votes = data.votes || [];

    votes.forEach((vote) => {
      const { projectId, location, distance, timestamp } = vote;

      rows.push([
        uid,
        name,
        projectId,
        location?.lat || "",
        location?.lng || "",
        distance?.toFixed(2) || "",
        timestamp
          ? new Date(timestamp).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
          : ""
      ]);
    });
  });

  const csvContent = "\uFEFF" + rows.map((row) => row.join(",")).join("\n");
  const filePath = path.join(outputDir, "votes.csv");
  fs.writeFileSync(filePath, csvContent, "utf8");

  console.log(`✅ 사용자 투표 CSV 저장 완료: ${filePath}`);
};

exportUserVotesToCSV();
