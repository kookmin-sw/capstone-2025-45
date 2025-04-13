import { useEffect, useState } from "react";
import { getTopProjects } from "../utils/firebaseVoting";
import NavigationBar from "../components/NavigationBar";

const Home = () => {
  const [topProjects, setTopProjects] = useState([]);

  useEffect(() => {
    const fetchTopProjects = async () => {
      const projects = await getTopProjects();
      setTopProjects(projects);
    };

    fetchTopProjects(); // 처음 실행 시 데이터를 불러옴

    // 🔹 2분마다 Firestore에서 새로운 데이터 불러오기
    const interval = setInterval(() => {
      fetchTopProjects();
    }, 120000); // 120000ms = 2분

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pb-20">
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
          {topProjects.length === 0 ? (
            <p className="text-gray-500 mt-4">데이터를 불러오는 중...</p>
          ) : (
            topProjects.map((project, index) => {
              const medals = ["🥇", "🥈", "🥉"];
              const rankLabel = medals[index] || `${index + 1}위`;
            
              return (
                <p key={project.id} className="text-base md:text-lg font-medium mt-2">
                  {rankLabel} [{project.team}조] {project.project} ({project.votes}표)
                </p>
              );
            })
          )}
        </div>
      </div>
    </div>
    <NavigationBar />
    </div>
  );
};

export default Home;
