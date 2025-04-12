import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getProjectById,
  updateUserVotes,
  getUserData,
} from "../utils/firebaseVoting";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useSearchParams } from "react-router-dom";
import {
  getDistanceFromLatLonInKm,
  EXHIBITION_COORDS,
} from "../utils/geoUtils";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
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
        <p className="text-xl font-bold text-gray-700">
          📡 데이터 불러오는 중...
        </p>
      </div>
    );
  }

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

  const handleVote = async () => {
    if (!user) {
      navigate("/my");
      return;
    }

    if (!qrToken || qrToken !== project.validToken) {
      alert("⚠️ QR 코드 인식을 통해 입장해야 투표할 수 있어요.");
      return;
    }

    if (!userData) {
      alert("⚠️ 사용자 정보를 불러오는 데 실패했습니다.");
      return;
    }

    if (userData.votedProjects.includes(id)) {
      setShowAlreadyVotedModal(true);
      return;
    }

    if (userData.votesRemaining <= 0) {
      alert("⚠️ 투표 횟수를 모두 사용했습니다.");
      return;
    }

    // ✅ 위치 요청 & 거리 계산
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const distance = getDistanceFromLatLonInKm(
            latitude,
            longitude,
            EXHIBITION_COORDS.lat,
            EXHIBITION_COORDS.lng
          );

          if (distance > 0.5) {
            alert(
              `⚠️ 현재 전시관에서 약 ${distance.toFixed(
                2
              )}km 떨어져 있습니다.\n현장 관람객이 아닌 경우 투표가 무효 처리될 수 있습니다.`
            );
          }

          await updateUserVotes(user.uid, id); // 🔜 위치 정보 포함 저장 예정
          alert(`✅ 투표 완료! ${project.team}조`);
          navigate("/vote-complete");
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            // ✅ 위치 권한 거절 시 다시 안내
            const retry = window.confirm(
              "⚠️ 위치 정보 접근이 거부되었습니다.\n브라우저 설정에서 권한을 허용하신 후(사이트 설정 > 위치 > 허용 선택), 페이지를 새로고침하고 다시 시도해 주세요."
            );
            if (retry) {
              handleVote(); // 사용자가 허용하고 다시 시도하는 경우 재귀 호출
            }
          } else {
            alert("⚠️ 위치 정보를 가져오지 못했습니다. 다시 시도해주세요.");
          }
        }
      );
    } catch (err) {
      alert("⚠️ 위치 접근 중 오류가 발생했습니다.");
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
            userData?.votedProjects.includes(id)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={userData?.votedProjects.includes(id)}
        >
          {userData?.votedProjects.includes(id) ? "이미 투표 완료" : "투표하기"}
        </button>

        <p className="text-sm text-red-500 mt-4 text-center">
          ※ 본 투표는 현장 관람객 전용입니다.
          <br />
          <strong>
            전시관과 물리적으로 먼 거리에서 투표한 경우 <br /> 무효 처리될 수
            있습니다.
          </strong>
        </p>
      </div>

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
