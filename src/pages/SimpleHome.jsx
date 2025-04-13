// pages/SimpleHome.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTopSimpleProjects } from "../utils/simpleVoting";
import SimpleNavigationBar from "../components/SimpleNavigationBar";

const SimpleHome = () => {
  const navigate = useNavigate();
  const [topProjects, setTopProjects] = useState([]);

  useEffect(() => {
    const fetchTop = async () => {
      const projects = await getTopSimpleProjects();
      setTopProjects(projects);
    };

    fetchTop();

    const interval = setInterval(fetchTop, 120000); // 2분마다 갱신
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pb-20">
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🗳️ 심플 투표 시스템
        </h1>
        <p className="text-center text-gray-600 mb-8 leading-relaxed">
          모바일에 익숙하지 않으신 분도 쉽게 사용할 수 있도록
          <br />
          로그인 없이 간편하게 투표할 수 있는 시스템입니다.
        </p>
        <button
          onClick={() => navigate("/simple/projects")}
          className="px-6 py-3 bg-blue-500 text-white text-lg rounded hover:bg-blue-600"
        >
          투표 시작하기
        </button>

        {/* 🔥 실시간 순위 */}
        <div className="w-full max-w-md bg-gray-100 mt-10 p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-center mb-2">
            🔥 실시간 인기 TOP 5 🔥
          </h2>
          {topProjects.length === 0 ? (
            <p className="text-center text-gray-500">집계 중...</p>
          ) : (
            topProjects.map((project, index) => (
              <p
                key={project.id}
                className="text-base text-gray-800 mt-1 text-center"
              >
                {index + 1}위: [{project.team}조] {project.project} ({project.votes}표)
              </p>
            ))
          )}
          <p className="mt-2 text-sm text-gray-500 text-center">* 2분마다 자동 갱신됩니다.</p>
        </div>
      </div>

      <SimpleNavigationBar />
    </div>
  );
};

export default SimpleHome;
