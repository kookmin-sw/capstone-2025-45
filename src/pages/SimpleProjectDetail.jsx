// pages/SimpleProjectDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSimpleProjectById, incrementSimpleVote, logSimpleVote } from "../utils/simpleVoting";
import SimpleNavigationBar from "../components/SimpleNavigationBar";


const SimpleProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const data = await getSimpleProjectById(id);
      setProject(data);
    };
    fetchProject();
  }, [id]);

  const handleVote = async () => {
    try {
      await incrementSimpleVote(id);
      await logSimpleVote(id);
      alert("✅ 투표 완료!");
      navigate("/simple/complete");
    } catch (err) {
      console.error("투표 오류:", err);
      alert("⚠️ 투표 처리 중 오류가 발생했습니다.");
    }
  };

  if (!project) {
    return <p className="text-center mt-20">📡 프로젝트 불러오는 중...</p>;
  }

  return (
    <div className="pb-20">
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-2">{project.project}</h1>
      <p className="text-gray-600 mb-4">[{project.team}조]</p>
      <img
        src={project.poster}
        alt="프로젝트 포스터"
        className="w-full max-w-xs mb-4 rounded shadow"
      />
      <button
        onClick={handleVote}
        className="mt-2 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        이 프로젝트에 투표하기
      </button>
    </div>
    <SimpleNavigationBar />
    </div>
  );
};

export default SimpleProjectDetail;
