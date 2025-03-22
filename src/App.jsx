import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import VoteComplete from "./pages/VoteComplete";
import Projects from "./pages/Projects";
import My from "./pages/My";
import NavigationBar from "./components/NavigationBar";
import { useEffect } from "react";
import { handleRedirectLoginResult } from "./utils/firebaseAuth";
import { getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const App = () => {
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("✅ 로그인된 사용자:", user);
      } else {
        try {
          const result = await getRedirectResult(auth);
          if (result?.user) {
            console.log("✅ 리디렉션 로그인 성공:", result.user);
            await saveUserToFirestore(result.user);
            await sendTokenToKookmin(result.user);
          } else {
            console.log("❌ 리디렉션 결과도 없음");
          }
        } catch (error) {
          console.error("🔥 getRedirectResult 오류:", error);
        }
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);

  return (
    <Router>
      <div className="pb-16">
        {" "}
        {/* 네비게이션 바가 화면을 가리지 않도록 패딩 추가 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/my" element={<My />} />
          <Route path="/vote-complete" element={<VoteComplete />} />
        </Routes>
        <NavigationBar /> {/* 하단 네비게이션 바 추가 */}
      </div>
    </Router>
  );
};

export default App;
