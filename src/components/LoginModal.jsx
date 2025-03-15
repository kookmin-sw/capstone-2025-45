import { useState } from "react";

const LoginModal = ({ onClose, onLogin }) => {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (studentId.trim() === "" || name.trim() === "") {
      alert("학번과 이름을 입력해주세요!");
      return;
    }

    onLogin(studentId, name); // 부모 컴포넌트에 로그인 정보 전달
    onClose(); // 모달 닫기
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">로그인</h2>
        <input
          type="text"
          placeholder="학번을 입력하세요"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />
        <div className="flex justify-between">
          <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded">
            로그인
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
