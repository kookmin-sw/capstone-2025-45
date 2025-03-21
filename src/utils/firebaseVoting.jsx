import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { app } from "../firebase";

const db = getFirestore(app);

// 🔹 Firestore에서 모든 프로젝트 가져오기
export const getAllProjects = async () => {
  try {
    const projectsRef = collection(db, "projects"); // "projects" 컬렉션에서 데이터 가져오기
    const querySnapshot = await getDocs(projectsRef);

    const projects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      team: doc.data().team, // 조 번호
      project: doc.data().project, // 프로젝트 이름 (name → project)
      type: doc.data().type, // 프로젝트 유형
      description: doc.data().description, // 프로젝트 설명
      poster: doc.data().poster, // 포스터 이미지 URL
      votes: doc.data().votes, // 투표 수
    }));

    return projects;
  } catch (error) {
    console.error("🔥 Firestore 데이터 불러오기 오류:", error);
    return [];
  }
};

// 🔹 Firestore에서 사용자의 투표 내역 가져오기
export const getUserVotes = async (userId) => {
  if (!userId) return { votedProjects: [], remainingVotes: 3 };

  try {
    const userVoteRef = doc(db, "votes", userId);
    const docSnap = await getDoc(userVoteRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn(`⚠ 사용자 ${userId}의 투표 내역이 없습니다.`);
      return { votedProjects: [], remainingVotes: 3 };
    }
  } catch (error) {
    console.error("🔥 Firestore 데이터 불러오기 오류:", error);
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

  // 🔹 프로젝트 투표 수 증가
  const projectRef = doc(db, "projects", projectId);
  const projectSnap = await getDoc(projectRef);
  if (projectSnap.exists()) {
    const currentVotes = projectSnap.data().votes || 0;
    await updateDoc(projectRef, {
      votes: currentVotes + 1,
    });
  }
};

// 🔹 Firestore에서 투표 수가 가장 많은 상위 3개 프로젝트 가져오기
export const getTopProjects = async () => {
  try {
    const projectsRef = collection(db, "projects"); // "projects" 컬렉션에서 데이터 가져오기
    const topProjectsQuery = query(projectsRef, orderBy("votes", "desc"), limit(3));
    const querySnapshot = await getDocs(topProjectsQuery);

    const topProjects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      team: doc.data().team,
      project: doc.data().project,
      type: doc.data().type,
      description: doc.data().description,
      poster: doc.data().poster,
      votes: doc.data().votes,
    }));

    return topProjects;
  } catch (error) {
    console.error("🔥 Firestore 데이터 불러오기 오류:", error);
    return [];
  }
};

// 🔹 Firestore에서 특정 프로젝트 가져오기
export const getProjectById = async (projectId) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(projectRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        team: docSnap.data().team,
        project: docSnap.data().project,
        type: docSnap.data().type,
        description: docSnap.data().description,
        poster: docSnap.data().poster,
        votes: docSnap.data().votes,
      };
    } else {
      console.warn(`⚠ 프로젝트 ${projectId}를 찾을 수 없습니다.`);
      return null;
    }
  } catch (error) {
    console.error("🔥 Firestore 데이터 불러오기 오류:", error);
    return null;
  }
};
