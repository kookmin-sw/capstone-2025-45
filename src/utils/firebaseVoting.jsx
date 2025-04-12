import { getFirestore, doc, getDoc, updateDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { app } from "../firebase";

const db = getFirestore(app);

// 🔹 Firestore에서 상위 3개 인기 프로젝트 가져오기 (votes 기준)
export const getTopProjects = async () => {
  try {
    const projectsRef = collection(db, "projects");
    const topProjectsQuery = query(projectsRef, orderBy("votes", "desc"), limit(10));
    const querySnapshot = await getDocs(topProjectsQuery);

    const topProjects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      project: doc.data().project,      // 프로젝트 이름
      team: doc.data().team,            // 팀(조) 번호
      type: doc.data().type,            // 유형 (웹, 앱, 기타 등)
      poster: doc.data().poster,        // 포스터 이미지 URL
      votes: doc.data().votes || 0      // 투표 수 (기본값 0)
    }));

    return topProjects;
  } catch (error) {
    console.error("🔥 Firestore 데이터 불러오기 오류:", error);
    return [];
  }
};

// 🔹 특정 프로젝트 정보 가져오기
export const getProjectById = async (projectId) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(projectRef, { source: "server" });

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        project: docSnap.data().project,
        team: docSnap.data().team,
        type: docSnap.data().type,
        description: docSnap.data().description, // 프로젝트 소개글
        poster: docSnap.data().poster,
        votes: docSnap.data().votes || 0,
        validToken: docSnap.data().validToken // QR 코드 인식 후 유효성 검사용 토큰
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

// 🔹 Firestore에서 모든 프로젝트 목록 가져오기
export const getAllProjects = async () => {
  try {
    const projectsRef = collection(db, "projects");
    const querySnapshot = await getDocs(projectsRef);

    const projects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      project: doc.data().project,
      team: doc.data().team,
      type: doc.data().type,
      description: doc.data().description,
      poster: doc.data().poster,
      votes: doc.data().votes || 0
    }));

    return projects;
  } catch (error) {
    console.error("🔥 Firestore 데이터 불러오기 오류:", error);
    return [];
  }
};

// 🔹 Firestore에서 사용자 정보 가져오기
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error("🔥 Firestore 사용자 정보 불러오기 오류:", error);
    return null;
  }
};

// 🔹 Firestore에서 사용자의 투표 내역 가져오기
export const getUserVotes = async (userId) => {
  if (!userId) return { votedProjects: [], votesRemaining: 3 };

  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return {
        votedProjects: docSnap.data().votedProjects || [],
        votesRemaining: docSnap.data().votesRemaining || 3
      };
    } else {
      console.warn(`⚠ 사용자 ${userId}의 투표 내역이 없습니다.`);
      return { votedProjects: [], votesRemaining: 3 };
    }
  } catch (error) {
    console.error("🔥 Firestore 데이터 불러오기 오류:", error);
    return { votedProjects: [], votesRemaining: 3 };
  }
};

// 🔹 Firestore에 투표 데이터 저장 및 프로젝트 투표 수 증가
// export const updateUserVotes = async (userId, projectId) => {
//   const userRef = doc(db, "users", userId);
//   const projectRef = doc(db, "projects", projectId);

//   const userSnap = await getDoc(userRef);
//   const projectSnap = await getDoc(projectRef);

//   if (userSnap.exists() && projectSnap.exists()) {
//     const userData = userSnap.data();
//     const projectData = projectSnap.data();

//     if (userData.votedProjects.includes(projectId)) {
//       throw new Error("이미 투표한 프로젝트입니다.");
//     }

//     if (userData.votesRemaining <= 0) {
//       throw new Error("투표 가능 횟수를 초과했습니다.");
//     }

//     // 🔹 사용자 투표 데이터 업데이트
//     await updateDoc(userRef, {
//       votesRemaining: userData.votesRemaining - 1,
//       votedProjects: [...userData.votedProjects, projectId],
//     });

//     // 🔹 프로젝트 투표 수 증가
//     await updateDoc(projectRef, {
//       votes: (projectData.votes || 0) + 1
//     });

//   } else {
//     throw new Error("사용자 또는 프로젝트 데이터를 찾을 수 없습니다.");
//   }
// };

export const updateUserVotesWithLocation = async (userId, projectId, location, distance) => {
  const userRef = doc(db, "users", userId);
  const projectRef = doc(db, "projects", projectId);

  const userSnap = await getDoc(userRef);
  const projectSnap = await getDoc(projectRef);

  if (!userSnap.exists() || !projectSnap.exists()) {
    throw new Error("사용자 또는 프로젝트 데이터를 찾을 수 없습니다.");
  }

  const userData = userSnap.data();
  const projectData = projectSnap.data();

  if (userData.votedProjects.includes(projectId)) {
    throw new Error("이미 투표한 프로젝트입니다.");
  }

  if (userData.votesRemaining <= 0) {
    throw new Error("투표 가능 횟수를 초과했습니다.");
  }

  const voteEntry = {
    projectId,
    timestamp: Date.now(),
    location,
    distance,
  };

  // 🔄 사용자 데이터 업데이트
  await updateDoc(userRef, {
    votesRemaining: userData.votesRemaining - 1,
    votedProjects: [...userData.votedProjects, projectId],
    votes: [...(userData.votes || []), voteEntry],
  });

  // 🔄 프로젝트 투표 수 증가
  await updateDoc(projectRef, {
    votes: (projectData.votes || 0) + 1,
  });
};
