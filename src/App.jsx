import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import VoteComplete from "./pages/VoteComplete";
import LoginModal from "./components/LoginModal"; // 로그인 페이지 추가

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/vote-complete" element={<VoteComplete />} />
        <Route path="/login" element={<LoginModal />} /> {/* 로그인 페이지 추가 */}
      </Routes>
    </Router>
  );
};

export default App;
