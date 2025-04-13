// pages/SimpleVoteComplete.jsx
import { Link } from "react-router-dom";
import SimpleNavigationBar from "../components/SimpleNavigationBar";

const SimpleVoteComplete = () => {
  return (
    <div className="pb-20">
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ 투표 완료!
        </h1>
        <p className="text-gray-700 mb-6">투표해 주셔서 감사합니다.</p>
        <Link
          to="/simple"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          프로젝트 목록으로 돌아가기
        </Link>
      </div>
      <SimpleNavigationBar />
    </div>
  );
};

export default SimpleVoteComplete;
