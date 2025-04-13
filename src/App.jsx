import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import VoteComplete from "./pages/VoteComplete";
import Projects from "./pages/Projects";
import My from "./pages/My";
import { useEffect } from "react";
import {
  handleRedirectLoginResult,
  saveUserToFirestore,
  sendTokenToKookmin,
} from "./utils/firebaseAuth";
import { getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import SimpleProjects from "./pages/SimpleProjects";
import SimpleProjectDetail from "./pages/SimpleProjectDetail";
import SimpleVoteComplete from "./pages/SimpleVoteComplete";
import SimpleHome from "./pages/SimpleHome";
import ProfessorList from "./pages/ProfessorList";
import ProfessorDetail from "./pages/ProfessorDetail";

const App = () => {
  useEffect(() => {
    const handleLogin = async () => {
      try {
        // 1️⃣ 리디렉션 결과 우선 처리
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("✅ getRedirectResult 로그인 성공:", result.user);
          await saveUserToFirestore(result.user);
          await sendTokenToKookmin(result.user);
          return;
        }

        // 2️⃣ fallback - 이미 로그인되어 있는 상태일 경우
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            console.log("✅ fallback 로그인된 사용자:", user);
            await saveUserToFirestore(user); // 이 경우에도 저장되도록 보장
            await sendTokenToKookmin(user);
          } else {
            console.log("❌ 로그인된 사용자 없음");
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("🔥 로그인 처리 중 오류:", error);
      }
    };

    handleLogin();
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
          <Route path="/simple" element={<SimpleHome />} />
          <Route path="/simple/projects" element={<SimpleProjects />} />
          <Route path="/simple/project/:id" element={<SimpleProjectDetail />} />
          <Route path="/simple/complete" element={<SimpleVoteComplete />} />
          <Route path="/proff" element={<ProfessorList />} />
          <Route path="/proff/:profId" element={<ProfessorDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
