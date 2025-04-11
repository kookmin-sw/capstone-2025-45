# 📘 KMU 캡스톤 온리닝 투표 시스템 – 관리자 운영 메뉴얼

이 문서는 국민대학교 캡스톤디자인 전시회 온라인 투표 시스템 운영 가이드입니다.

---

## 🥉 1. 초기 준비

### ✅ 필요한 도구 설치
1. Node.js 설치 (https://nodejs.org)
2. 프로젝트 폴더 클로드
```bash
git clone https://github.com/your-org/capstone-vote-system.git
cd capstone-vote-system
```
3. 필수 패키지 설치
```bash
npm install
```

---

## 📋 2. Firebase 관리자 권한 설정

### 🔐 서비스 계정 키 발급
1. Firebase Console > 프로젝트 설정 > “관리권” > “서비스 계정”
2. “새 비공 키 생성” 클릭 → `serviceAccountKey.json` 파일 다운로드
3. `tools/` 폴더에 저장
```bash
mv ~/Downloads/serviceAccountKey.json tools/
```

---

## 🗳 3. QR 코드 생성

### ✅ 목적
각 프로젝트리트에 대한 QR 코드 자동 생성 + 나수 토큰 만들기

### ☑️ 사전 조건
- `generateQR.js` 내부에서 프로젝트 개수 설정 (Array.from)

### 🛠 실행 방법
```bash
node tools/generateQR.js
```

### 📆 결과
- `output/project-1.png` ~ `project-n.png`: QR 이미지
- `output/project-tokens.json`: ID 및 토큰 목록 저장

> `validToken` 값은 Firestore에 수동으로 등록

---

## 📅 4. Firestore에 프로젝트 데이터 등록

### 📃 필요 정보
- project: 개발 프로젝트 명
- team: 팀 번호
- poster: 이미지 URL (GitHub raw URL 권용)
- description: 개인 설명
- validToken: `project-tokens.json`

### 📂 등록 위치
```
/projects/{projectId}
```

---

## 💾 5. 투표 종료 후 결과 참고 (CSV)

### ✅ 목적
투표 결과를 `projects.csv`로 출력

### 🛠 실행
```bash
node tools/exportProjectsToCSV.js
```

### 📆 결과
- `output/projects.csv` 생성
- BOM(UTF-8 with BOM) 포함 – 한글 계정에서 가능

---

## 💡 금의 & 참고

| 항목 | 설명 |
|--------|------|
| `tools/serviceAccountKey.json` | Git에 올릴 수 없음 (`.gitignore`에 포함) |
| `output/` 폴더 | QR + 결과 출력용, Git에 포함하지 않음 |
| `project-tokens.json` | 토큰 만들고 Firestore에 등록해야 해요 |

---

## 📚 폴더 구조 요약

```
tools/
├─ generateQR.js
├─ exportProjectsToCSV.js
├─ serviceAccountKey.json
├─ README.md

output/
├─ project-1.png ~ project-50.png
├─ project-tokens.json
├─ projects.csv
```

---

## 📃 개요 행동 한글 정보

1. QR 생성: `generateQR.js`
2. Firestore에 project 등록 (token 값 포함)
3. 투표 진행
4. 결과 CSV 출력: `exportProjectsToCSV.js`

---

이 문서를 `tools/README.md`로 저장해가지고, 다른 관리자도 쉽게 따라할 수 있게 해줘. 필요하면 PDF로도 변환해 준비해줄게!

