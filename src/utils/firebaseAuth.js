import {
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
  // signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from "../firebase";

const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 OIDC 로그인 - 리디렉션 방식 사용
export const signInWithOIDC = async () => {
  try {
    const provider = new OAuthProvider("oidc.kconnect.cs.kookmin.ac.kr");
    await signInWithRedirect(auth, provider); // ✅ 변경된 부분
  } catch (error) {
    console.error("🔥 OIDC 로그인 리디렉션 오류:", error);
    throw error;
  }
};

// 🔹 로그인 결과 처리 (App.jsx에서 호출)
// export const handleRedirectLoginResult = async () => {
//   try {
//     // 1. 리디렉션 결과 확인
//     const result = await getRedirectResult(auth);
//     if (result?.user) {
//       console.log("✅ getRedirectResult 로그인 성공:", result.user);
//       await postLoginProcess(result.user);
//       return result.user;
//     }

//     // 2. fallback: onAuthStateChanged (로그인 유지 상태 등)
//     return new Promise((resolve) => {
//       const unsubscribe = onAuthStateChanged(auth, async (user) => {
//         unsubscribe();
//         if (user) {
//           console.log("✅ fallback 로그인 성공:", user);
//           await postLoginProcess(user);
//           resolve(user);
//         } else {
//           console.log("nono");
//           console.log("❌ 로그인된 사용자 없음");
//           resolve(null);
//         }
//       });
//     });
//   } catch (error) {
//     console.error("🔥 리디렉션 결과 처리 오류:", error);
//     return null;
//   }
// };

// 🔹 로그인 후 공통 처리: Firestore + 서버 전송
export const postLoginProcess = async (user) => {
  try {
    await saveUserToFirestore(user);
    // await sendTokenToKookmin(user);
  } catch (err) {
    console.error("❌ 로그인 후 처리 실패:", err);
  }
};

// 🔹 Firestore에 사용자 정보 저장
export const saveUserToFirestore = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      votesRemaining: 3,
      votedProjects: [],
    });
    console.log("✅ Firestore 사용자 저장 완료");
  }
};

// 🔹 로그아웃
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("✅ 로그아웃 완료");
  } catch (error) {
    console.error("🔥 로그아웃 오류:", error);
  }
};

// 🔹 현재 사용자 상태 감지
export const getCurrentUser = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
