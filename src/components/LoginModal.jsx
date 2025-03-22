import { useEffect, useState } from "react";
import { signInWithOIDC, signOutUser, getCurrentUser } from "../utils/firebaseAuth";

const LoginModal = ({ onClose }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser(setUser);
  }, []);

  const handleLogin = async () => {
    try {
      console.log("로그인 시도 중...");
      await signInWithOIDC(); // 리디렉션 발생 후 이동하므로 아래는 실행되지 않음
    } catch (error) {
      console.error("로그인 오류:", error);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        {user ? (
          <>
            <h2 className="text-xl font-bold mb-4">환영합니다, {user.displayName}!</h2>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
              로그아웃
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">로그인</h2>
            <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded">
              학교 계정으로 로그인
            </button>
          </>
        )}
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">
          닫기
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
