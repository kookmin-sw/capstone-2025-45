import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// fast-csv 대신 직접 BOM 포함 파일 쓰기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(__dirname, "./serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const outputDir = path.join(__dirname, "../output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const exportProjectsToCSV = async () => {
  const projectsRef = db.collection("projects");
  const snapshot = await projectsRef.get();

  const headers = ["팀", "프로젝트명", "투표 수"];
  const rows = snapshot.docs.map((doc) => {
    const d = doc.data();
    return [d.team, d.project, d.votes ?? 0];
  });

  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const withBOM = "\uFEFF" + csvContent;

  const outputPath = path.join(outputDir, "projects.csv");
  fs.writeFileSync(outputPath, withBOM, "utf8");

  console.log(`✅ BOM 포함 CSV 파일 생성 완료: ${outputPath}`);
};

exportProjectsToCSV();
