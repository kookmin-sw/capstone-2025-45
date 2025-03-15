import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginModal from "../components/LoginModal";

const projects = {
  1: {
    name: "AI 기반 도서 추천 시스템",
    team: "1조",
    image: "https://source.unsplash.com/400x300/?technology,book",
  },
  2: {
    name: "스마트 홈 자동화",
    team: "2조",
    image: "https://source.unsplash.com/400x300/?smart-home,technology",
  },
  3: {
    name: "친환경 배터리 연구",
    team: "3조",
    image: "https://source.unsplash.com/400x300/?battery,eco",
  },
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ studentId: "", name: "" });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAlreadyVotedModal, setShowAlreadyVotedModal] = useState(false);
  const [votedProjects, setVotedProjects] = useState([]);

  const project = projects[id];

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">
          ❌ 프로젝트를 찾을 수 없습니다.
        </h1>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const handleVote = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (votedProjects.includes(id)) {
      setShowAlreadyVotedModal(true);
      return;
    }

    setVotedProjects([...votedProjects, id]);
    alert(`투표 완료! 프로젝트 ${id}`);
    navigate("/vote-complete");
  };

  const handleLogin = (studentId, name) => {
    setUserInfo({ studentId, name });
    setIsLoggedIn(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate("/")}
        className="mt-4 px-6 py-2 w-full bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        홈으로 이동
      </button>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center">
        {/* 포스터 이미지 */}
        <img
          src={project.image}
          alt={`포스터 - ${project.name}`}
          className="w-full h-64 object-cover rounded-md mb-4"
        />

        {/* 프로젝트 정보 */}
        <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
        <p className="text-lg text-gray-600 mt-2">{project.team}</p>

        {/* 투표 버튼 */}
        <button
          onClick={handleVote}
          className={`mt-4 px-6 py-2 w-full rounded text-white ${
            votedProjects.includes(id)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={votedProjects.includes(id)}
        >
          {votedProjects.includes(id) ? "이미 투표 완료" : "투표하기"}
        </button>

        {/* 투표 완료 버튼 */}
        <button
          onClick={() => navigate("/vote-complete")}
          className="mt-4 px-6 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          투표 완료
        </button>
      </div>

      {/* 로그인 팝업 */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}

      {/* 이미 투표한 경우 경고 모달 */}
      {showAlreadyVotedModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-red-500">
              ⚠ 이미 투표했습니다!
            </h2>
            <p className="text-gray-700 mb-4">
              한 프로젝트에는 한 번만 투표할 수 있습니다.
            </p>
            <button
              onClick={() => setShowAlreadyVotedModal(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
