import { useEffect, useState } from "react";
import { getUserVotes } from "../utils/firebaseVoting";
import { getAuth } from "firebase/auth";

const My = () => {
  const [votedProjects, setVotedProjects] = useState([]);
  const [remainingVotes, setRemainingVotes] = useState(3);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchUserVotes = async () => {
      const voteData = await getUserVotes(user.uid);
      setVotedProjects(voteData.votedProjects || []);
      setRemainingVotes(voteData.remainingVotes || 3);
    };

    fetchUserVotes();
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">내 투표 현황</h1>
      <p className="text-gray-700">총 3회 투표 가능</p>
      <p className="text-lg font-semibold mt-2">남은 투표 횟수: {remainingVotes}</p>

      <h2 className="text-xl font-bold mt-6 mb-4">투표 내역</h2>

      <div className="w-full max-w-md">
        {votedProjects.length === 0 ? (
          <p className="text-gray-500">아직 투표한 프로젝트가 없습니다.</p>
        ) : (
          votedProjects.map((projectId) => (
            <div key={projectId} className="bg-white p-4 mb-2 border rounded-lg shadow-md">
              프로젝트 {projectId}에 투표 완료
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default My;
