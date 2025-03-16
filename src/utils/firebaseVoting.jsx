import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { app } from "../firebase";

const db = getFirestore(app);

// 🔹 Firestore에서 사용자의 투표 내역 가져오기
export const getUserVotes = async (userId) => {
  if (!userId) return { votedProjects: [], remainingVotes: 3 };

  const userVoteRef = doc(db, "votes", `${userId}_vote`);
  const docSnap = await getDoc(userVoteRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return { votedProjects: [], remainingVotes: 3 };
  }
};

// 🔹 Firestore에 투표 데이터 저장
export const voteForProject = async (userId, projectId) => {
  const userVoteRef = doc(db, "votes", `${userId}_vote`);
  const docSnap = await getDoc(userVoteRef);

  if (docSnap.exists()) {
    const voteData = docSnap.data();

    if (voteData.votedProjects.includes(projectId)) {
      throw new Error("이미 이 프로젝트에 투표했습니다.");
    }

    if (voteData.remainingVotes <= 0) {
      throw new Error("최대 3번까지 투표할 수 있습니다.");
    }

    // 🔹 기존 투표 데이터 업데이트
    await updateDoc(userVoteRef, {
      votedProjects: [...voteData.votedProjects, projectId],
      remainingVotes: voteData.remainingVotes - 1,
    });

  } else {
    // 🔹 새로운 투표 데이터 저장 (처음 투표하는 경우)
    await setDoc(userVoteRef, {
      userId,
      votedProjects: [projectId],
      remainingVotes: 2, // 처음 투표하면 2회 남음
    });
  }
};
