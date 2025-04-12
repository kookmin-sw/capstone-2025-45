import { useEffect, useState } from "react";
import { getUserVotes } from "../utils/firebaseVoting";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signInWithGoogle, signInWithOIDC, signOutUser } from "../utils/firebaseAuth";

const My = () => {
  const [votedProjects, setVotedProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [loginStatus, setLoginStatus] = useState("idle"); // "idle", "loading", "authenticated"
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoginStatus("authenticated");
        fetchUserVotes(currentUser.uid);
      } else {
        setUser(null);
        setVotedProjects([]);
        setLoginStatus("idle");
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserVotes = async (userId) => {
    const voteData = await getUserVotes(userId);
    setVotedProjects(voteData.votedProjects || []);
  };

  const handleLogin = async () => {
    setLoginStatus("loading");
    try {
      await signInWithOIDC(); // 리디렉션 발생
      // await signInWithGoogle();
    } catch (error) {
      console.error("로그인 오류:", error);
      setLoginStatus("idle");
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">내 투표 현황</h1>

      {loginStatus === "loading" ? (
        <div className="flex flex-col items-center">
          <p className="text-gray-700 mb-4">로그인 중입니다...</p>
          <button
            disabled
            className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
          >
            로그인 중...
          </button>
        </div>
      ) : loginStatus === "authenticated" ? (
        <>
          <p className="text-gray-700">총 3회 투표 가능</p>
          <p className="text-lg font-semibold mt-2">
            남은 투표 횟수: {3-votedProjects.length}
          </p>

          <h2 className="text-xl font-bold mt-6 mb-4">투표 내역</h2>
          <div className="w-full max-w-md">
            {votedProjects.length === 0 ? (
              <p className="text-gray-500">아직 투표한 프로젝트가 없습니다.</p>
            ) : (
              votedProjects.map((projectId) => (
                <div
                  key={projectId}
                  className="bg-white p-4 mb-2 border rounded-lg shadow-md"
                >
                  프로젝트 {projectId}에 투표 완료
                </div>
              ))
            )}
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
          >
            로그아웃
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-700 mb-4">로그인이 필요합니다.</p>
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            로그인
          </button>
        </>
      )}
    </div>
  );
};

export default My;
