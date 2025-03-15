import { useEffect, useState } from "react";

const Home = () => {
  const [topProjects, setTopProjects] = useState([]);

  // 🔹 더미 데이터 (실제 Firebase Firestore에서 데이터를 불러올 예정)
  useEffect(() => {
    const dummyData = [
      { id: 1, name: "AI 기반 도서 추천 시스템", votes: 120 },
      { id: 4, name: "스마트 홈 자동화", votes: 95 },
      { id: 68, name: "친환경 배터리 연구", votes: 80 },
    ];

    // 2분마다 데이터 업데이트 (실제 Firestore 연동 시 Firestore에서 가져올 예정)
    const interval = setInterval(() => {
      setTopProjects(dummyData);
    }, 2000); // 🔹 2초마다 업데이트 (테스트용, 실제 환경에서는 2분으로 설정)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          2025 캡스톤 프로젝트 전시전
        </h1>
        <p className="text-gray-700">QR 코드를 스캔하고 투표하세요!</p>

        {/* 🔹 TOP 3 프로젝트 표시 */}
        <div className="mt-6 w-full bg-white border border-gray-300 rounded-lg shadow-md p-5">
          <h2 className="text-lg md:text-xl font-semibold">
            🔥 실시간 인기 프로젝트 TOP 3 🔥
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            *2분마다 자동 집계됩니다.
          </p>
          {topProjects.map((project, index) => {
            const medals = ["🥇", "🥈", "🥉"]; // 금, 은, 동 메달 이모지
            return (
              <div key={project.id} className="mt-2">
                <p className="text-base md:text-lg font-medium">
                {medals[index]} [{project.id}조] {project.name} (
                  {project.votes}표)
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
