import { useNavigate } from "react-router-dom";

const projects = [
  { id: 1, name: "AI 기반 도서 추천 시스템", team: "1조" },
  { id: 2, name: "스마트 홈 자동화", team: "2조" },
  { id: 3, name: "친환경 배터리 연구", team: "3조" },
];

const Projects = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">전체 프로젝트</h1>
      <div className="w-full max-w-md">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => navigate(`/project/${project.id}`)}
            className="block w-full bg-white p-4 mb-2 border rounded-lg shadow-md hover:bg-gray-100 text-left"
          >
            <span className="font-semibold text-blue-500">{project.team}</span> {project.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Projects;
