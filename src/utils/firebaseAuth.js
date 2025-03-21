import { getAuth, signInWithRedirect, OAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from "../firebase";

const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 OpenID Connect 로그인 처리
export const signInWithOIDC = async () => {
  try {
    const provider = new OAuthProvider("oidc.kconnect.cs.kookmin.ac.kr"); 
    const result = await signInWithRedirect(auth, provider);
    const user = result.user;

    console.log("🔥 로그인 성공:", user);
    
    // 🔹 Firestore에 사용자 정보 저장
    await saveUserToFirestore(user);
    return user;
  } catch (error) {
    console.error("🔥 OIDC 로그인 오류:", error);
    throw error;
  }
};

// 🔹 Firestore에 사용자 정보 저장 (최초 로그인 시)
const saveUserToFirestore = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // 🔹 신규 사용자 Firestore 저장
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      votesRemaining: 3, // 기본 투표 횟수 3회
      votedProjects: []
    });
  }
};

// 🔹 로그아웃 처리
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("✅ 로그아웃 완료");
  } catch (error) {
    console.error("🔥 로그아웃 오류:", error);
  }
};

// 🔹 현재 로그인된 사용자 가져오기
export const getCurrentUser = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};