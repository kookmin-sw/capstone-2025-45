// pages/ProfessorList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProfessors } from "../utils/firebaseProff";

const ProfessorList = () => {
  const [professors, setProfessors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfessors = async () => {
      const data = await getAllProfessors();
      setProfessors(data);
    };
    fetchProfessors();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6 pb-20 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">🧑‍🏫 교수님 평가 리스트</h1>
      <div className="w-full max-w-md space-y-4">
        {professors.length === 0 ? (
          <p className="text-gray-500 text-center">📡 교수님 정보를 불러오는 중...</p>
        ) : (
          professors.map((prof) => (
            <div
              key={prof.id}
              onClick={() => navigate(`/proff/${prof.id}`)}
              className="cursor-pointer p-4 bg-gray-100 rounded shadow hover:bg-blue-100 transition"
            >
              <p className="text-xl font-semibold text-center">{prof.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfessorList;
