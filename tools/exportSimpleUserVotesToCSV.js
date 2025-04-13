// tools/exportSimpleUserVotes.js

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { format } from "date-fns";

// ESM용 __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔐 서비스 계정 로딩
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

const exportSimpleUserVotesToCSV = async () => {
  const votesSnap = await db.collection("simpleVotes").get();
  const projectsSnap = await db.collection("simpleProjects").get();

  console.log(`📊 투표 수: ${votesSnap.size}`);
  console.log(`📦 프로젝트 수: ${projectsSnap.size}`);

  // 🔹 프로젝트 ID → 이름 매핑
  const projectMap = {};
  projectsSnap.forEach((doc) => {
    const data = doc.data();
    projectMap[doc.id] = data.project || "(이름 없음)";
  });

  // 🔹 CSV 헤더
  const rows = [["No", "Project ID", "Project Name", "Timestamp"]];
  let count = 1;

  votesSnap.forEach((doc) => {
    const data = doc.data();
    const projectId = data.projectId || "";
    const projectName = projectMap[projectId] || "(이름 없음)";
    const timestamp = data.timestamp
      ? format(new Date(data.timestamp), "yyyy-MM-dd HH:mm:ss")
      : "";

    console.log(`✔ ${projectId} | ${projectName} | ${timestamp}`);

    rows.push([
      count++,
      projectId,
      projectName,
      timestamp
    ]);
  });

  const csvContent = "\uFEFF" + rows.map((row) => row.join(",")).join("\n");
  const fileName = `simple_votes_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`;
  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, csvContent, "utf8");

  console.log(`✅ CSV 저장 완료: ${filePath}`);
};

exportSimpleUserVotesToCSV();
