// 투표 완료 페이지

import { Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

const VoteComplete = () => {
  return (
    <div className="pb-20">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">투표 완료 🎉</h1>
        <p>투표해 주셔서 감사합니다!</p>
        <Link to="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          홈으로 돌아가기
        </Link>
      </div>
      <NavigationBar />
    </div>
  );
};

export default VoteComplete;
