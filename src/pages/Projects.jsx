import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects } from "../utils/firebaseVoting";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsData = await getAllProjects();
      setProjects(projectsData);
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">전체 프로젝트</h1>
      <div className="w-full max-w-md">
        {projects.length === 0 ? (
          <p className="text-gray-500 text-center">📡 데이터 불러오는 중...</p>
        ) : (
          projects.map((project) => (
            <button
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              className="block w-full bg-white p-4 mb-2 border rounded-lg shadow-md hover:bg-gray-100 text-left"
            >
              <span className="font-semibold text-blue-500">
                [{project.team}조]
              </span>{" "}
              {project.project}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;
