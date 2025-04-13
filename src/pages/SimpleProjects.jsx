// pages/SimpleProjects.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSimpleProjects } from "../utils/simpleVoting";
import SimpleNavigationBar from "../components/SimpleNavigationBar";

const SimpleProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getAllSimpleProjects();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <div className="pb-20">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">전체 프로젝트</h1>
        <div className="w-full max-w-md">
          {projects.length === 0 ? (
            <p className="text-gray-500 text-center">
              📡 프로젝트 불러오는 중...
            </p>
          ) : (
            projects.map((project) => (
              <button
                key={project.id}
                onClick={() => navigate(`/simple/project/${project.id}`)}
                className="w-full bg-white p-4 mb-3 border rounded-lg shadow-md hover:bg-gray-100 text-left"
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
      <SimpleNavigationBar />
    </div>
  );
};

export default SimpleProjects;
