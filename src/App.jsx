import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import VoteComplete from "./pages/VoteComplete";
import Projects from "./pages/Projects";
import My from "./pages/My";
import NavigationBar from "./components/NavigationBar";

const App = () => {
  return (
    <Router>
      <div className="pb-16"> {/* 네비게이션 바가 화면을 가리지 않도록 패딩 추가 */}
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
