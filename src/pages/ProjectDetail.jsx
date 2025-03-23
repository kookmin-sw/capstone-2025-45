import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjectById, updateUserVotes, getUserData } from "../utils/firebaseVoting";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginModal from "../components/LoginModal";
import { useSearchParams } from "react-router-dom";


const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAlreadyVotedModal, setShowAlreadyVotedModal] = useState(false);

  // 🔹 로그인 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const data = await getUserData(currentUser.uid);
        setUserData(data);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // 🔹 Firestore에서 프로젝트 데이터 가져오기
  useEffect(() => {
    const fetchProject = async () => {
      const projectData = await getProjectById(id);
      setProject(projectData);
      setIsLoading(false);
    };

    fetchProject();
  }, [id]);

  const [qrToken, setQrToken] = useState(null);
const [searchParams] = useSearchParams();

useEffect(() => {
  const token = searchParams.get("qr");
  if (token) {
    setQrToken(token);
    // 주소창에서 ?qr=abc123 숨기기
    window.history.replaceState({}, "", `/project/${id}`);
  }
}, [searchParams, id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-bold text-gray-700">📡 데이터 불러오는 중...</p>
      </div>
    );
  }



  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">❌ 프로젝트를 찾을 수 없습니다.</h1>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const handleVote = async () => {

    console.log(qrToken, project.validToken);
    if (!qrToken || qrToken !== project.validToken) {
      // alert("⚠️ QR 코드를 인식을 통해 투표해주세요.");
      alert(qrToken);
      return;
    }

    if (!user) {
      setShowLoginModal(true); // 🔹 로그인하지 않은 경우 로그인 모달 표시
      return;
    }

    if (userData?.votedProjects.includes(id)) {
      setShowAlreadyVotedModal(true);
      return;
    }

    try {
      await updateUserVotes(user.uid, id);
      alert(`✅ 투표 완료! ${project.team}조`);
      navigate("/vote-complete");
    } catch (error) {
      alert(`⚠️ ${error.message}`);
    }
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
          src={project.poster}
          alt={`포스터 - ${project.project}`}
          className="w-full max-w-md h-auto min-h-[250px] min-w-[170px] aspect-[1280/1882] object-cover bg-gray-200 rounded-md mb-4"
        />

        {/* 프로젝트 정보 */}
        <h1 className="text-3xl font-bold text-gray-800">{project.project}</h1>
        <p className="text-lg text-gray-600 mt-2">[{project.team}조]</p>
        <p className="text-sm text-gray-500 mt-2">유형: {project.type}</p>
        <p className="text-sm mt-2">{project.description}</p>

        {/* 투표 버튼 */}
        <button
          onClick={handleVote}
          className={`mt-4 px-6 py-2 w-full rounded text-white ${
            userData?.votedProjects.includes(id) ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={userData?.votedProjects.includes(id)}
        >
          {userData?.votedProjects.includes(id) ? "이미 투표 완료" : "투표하기"}
        </button>
      </div>

      {/* 로그인 팝업 */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      {/* 이미 투표한 경우 경고 모달 */}
      {showAlreadyVotedModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-red-500">⚠ 이미 투표했습니다!</h2>
            <p className="text-gray-700 mb-4">한 프로젝트에는 한 번만 투표할 수 있습니다.</p>
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
