import { useEffect, useState } from "react";

const My = () => {
  const [votedProjects, setVotedProjects] = useState([]);
  const maxVotes = 3;

  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem("votedProjects")) || [];
    setVotedProjects(storedVotes);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">내 투표 현황</h1>
      <p className="text-gray-700">총 {maxVotes}회 투표 가능</p>
      <p className="text-lg font-semibold mt-2">
        남은 투표 횟수: {maxVotes - votedProjects.length}
      </p>

      <div className="w-full max-w-md mt-4">
        {votedProjects.length === 0 ? (
          <p className="text-gray-500">아직 투표한 프로젝트가 없습니다.</p>
        ) : (
          votedProjects.map((projectId, index) => (
            <div key={index} className="bg-white p-4 mb-2 border rounded-lg shadow-md">
              프로젝트 {projectId}에 투표 완료
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default My;
