import { getAuth, signInWithPopup, signInWithRedirect,  OAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "../firebase";

const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 OpenID Connect 로그인 함수
export const loginWithOIDC = async () => {
  const provider = new OAuthProvider("oidc.kconnect.cs.kookmin.ac.kr"); 

  try {
    await signInWithRedirect(auth, provider); // Popup 대신 Redirect 방식 사용
    // const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("🔑 로그인 성공:", user.uid, user.displayName, user.email);

    // // Firestore에서 사용자 정보 확인
    // const userRef = doc(db, "users", user.uid);
    // const userSnap = await getDoc(userRef);

    // if (!userSnap.exists()) {
    //   // 신규 사용자 Firestore에 저장
    //   await setDoc(userRef, {
    //     studentId: user.email.split("@")[0], // 학번 추출
    //     name: user.displayName || "이름 없음",
    //     email: user.email,
    //     votedProjects: [],
    //     remainingVotes: 3,
    //   });
    // }

    return user;
  } catch (error) {
    console.error("🔥 OIDC 로그인 오류:", error.code, error.message); // 오류 메시지 출력
    alert(`로그인 실패: ${error.message}`); // 사용자에게 상세 오류 메시지 표시
    return null;
  }
};
