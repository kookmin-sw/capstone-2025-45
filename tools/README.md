좋아, 아주 중요한 내용이야!  
지금까지는 관리자 도구 위주로 정리했으니, 이번에는 **시스템 구성 및 각 기능별 페이지 구조/엔드포인트**까지 포함해서 완전한 버전의 README를 만들어줄게 💡

---

# 📘 KMU 캡스톤디자인 온라인 투표 시스템 – 관리자 운영 메뉴얼

이 문서는 국민대학교 캡스톤디자인 전시회 온라인 투표 시스템의 **전체 구성**,  
**운영 도구 사용법**, **페이지 구조 및 경로**에 대한 가이드를 제공합니다.

---

## 🗂 시스템 구성 개요

| 시스템 구분 | 설명 |
|-------------|------|
| 🧾 기본 투표 시스템 | 학교 로그인 기반. QR 토큰 검증 + 위치 정보 활용 |
| ⚡ 심플 투표 시스템 | 로그인/위치 정보 없음. 누구나 빠르게 투표 가능 |
| 🧑‍🏫 교수 평가 시스템 | 교수님들이 Google Form을 통해 평가 수행. 평가 여부 표시 기능 포함 |

---

## 🧭 페이지 라우팅 구조

### ✅ 기본 투표 시스템

| 경로 | 설명 |
|------|------|
| `/` | 홈 페이지 – 실시간 인기 프로젝트 TOP 10 표시 |
| `/projects` | 전체 프로젝트 목록 |
| `/project/:id?qr=xxx` | 개별 프로젝트 페이지 (QR 토큰 포함 시 유효성 검사 후 투표 가능) |
| `/vote-complete` | 투표 완료 후 리디렉션 |
| `/my` | 사용자 로그인 및 투표 현황 확인 페이지 |

---

### ✅ 심플 투표 시스템

| 경로 | 설명 |
|------|------|
| `/simple` | 심플 시스템 홈 – 투표 시작 안내 + 진입 버튼 |
| `/simple/projects` | 전체 프로젝트 목록 표시 |
| `/simple/project/:id` | 개별 프로젝트 상세 페이지 및 투표 버튼 |
| `/simple/vote-complete` | 심플 시스템 전용 투표 완료 페이지 |

> **차이점:** `/simple/...`으로 시작하는 경로는 로그인 및 QR 없이 자유롭게 접근 가능

---

### ✅ 교수 평가 시스템

| 경로 | 설명 |
|------|------|
| `/proff` | 교수 목록 카드 페이지 (Firestore 기반) |
| `/proff/:profId` | 선택한 교수의 평가 대상 프로젝트 목록 + Google Form 링크 제공 |
| — | 각 버튼 클릭 시 localStorage로 평가 완료 여부 저장 |

---

## 🧰 관리자 툴 요약

| 파일명 | 기능 | 설명 |
|--------|------|------|
| `generateQR.js` | QR 생성 | 프로젝트 수만큼 QR 이미지 + 토큰 생성 |
| `exportProjectsToCSV.js` | 기본 투표 결과 요약 | 프로젝트별 총 득표수 집계 |
| `exportUserVotesToCSV.js` | GPS 기반 투표 이력 | 로그인 사용자별 GPS 위치 및 시간 포함 |
| `exportSimpleUserVotes.js` | 심플 시스템 투표 이력 | 로그인 없이 수집된 모든 투표 기록을 CSV로 출력 |

---

## 🔐 Firebase 설정 가이드

1. Firebase Console → 프로젝트 설정 → "서비스 계정"
2. 비공개 키 발급 → `tools/serviceAccountKey.json` 저장
```bash
mv ~/Downloads/serviceAccountKey.json tools/
```

---

## 🔧 실행 예시

```bash
# QR 코드 생성
node tools/generateQR.js

# 기본 투표 결과 요약
node tools/exportProjectsToCSV.js

# 로그인 사용자 GPS 기반 이력
node tools/exportUserVotesToCSV.js

# 심플 투표 시스템 이력
node tools/exportSimpleUserVotes.js
```

---

## 📁 폴더 구조 요약

```
tools/
├─ generateQR.js                   # QR 코드 + 토큰 생성
├─ exportProjectsToCSV.js         # 기본 시스템 결과
├─ exportUserVotesToCSV.js        # 로그인 사용자 GPS 이력
├─ exportSimpleUserVotes.js       # 심플 시스템 투표 이력
├─ serviceAccountKey.json         # Firebase 인증 키 (Git에 포함 금지)

output/
├─ project-1.png ~ 50.png         # 생성된 QR 이미지
├─ project-tokens.json            # 각 프로젝트별 QR 토큰
├─ projects.csv                   # 기본 투표 결과
├─ votes.csv                      # GPS 포함 결과
├─ simple_votes_YYYYMMDD.csv     # 심플 시스템 개별 투표 결과
```

---

## 🛡 Git 관리 주의사항

| 항목 | 주의 |
|------|------|
| `tools/serviceAccountKey.json` | 절대 Git에 포함하지 않음 (`.gitignore` 처리됨) |
| `output/` 폴더 | 결과 파일 저장용. Git에 포함하지 않음 |

---

## ✅ 전반적인 운영 흐름

### 🧾 기본 투표 시스템

1. `generateQR.js`로 QR 생성
2. `/projects/{projectId}`에 Firestore 수동 등록
3. 전시 현장에서 참가자 QR 스캔 → 투표 진행
4. `exportProjectsToCSV.js` / `exportUserVotesToCSV.js`로 결과 추출

---

### ⚡ 심플 투표 시스템

1. QR 없이 `/simple`로 바로 접근
2. 투표 내용은 `simple_votes`에 기록
3. `exportSimpleUserVotes.js`로 결과 추출

---

### 🧑‍🏫 교수 평가 시스템

1. `/professors/{profId}` 문서에 프로젝트 목록 및 폼 링크 등록
2. `/proff`에서 교수 클릭 → `/proff/:profId`로 평가 수행
3. localStorage 기반으로 평가 여부 표시됨

---