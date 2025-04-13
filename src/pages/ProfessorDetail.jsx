// pages/ProfessorDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfessorById } from "../utils/firebaseProff";
import { getProjectById } from "../utils/firebaseVoting";

const ProfessorDetail = () => {
  const { profId } = useParams();
  const [professor, setProfessor] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const profData = await getProfessorById(profId);
      if (!profData || !profData.projects) return;

      setProfessor({ id: profData.id, name: profData.name });

      const resolved = await Promise.all(
        profData.projects.map(async ({ projectId, formLink }) => {
          const project = await getProjectById(projectId);
          return {
            projectId,
            formLink,
            projectName: project?.project || "이름 없음",
            team: project?.team || "??",
            clicked:
              localStorage.getItem(`evaluated_${profId}_${projectId}`) ===
              "true",
          };
        })
      );

      setProjects(resolved);
    };

    fetch();
  }, [profId]);

  const handleClick = (projectId, formLink) => {
    localStorage.setItem(`evaluated_${profId}_${projectId}`, "true");
    window.open(formLink, "_blank");

    // UI 업데이트 (즉시 반영)
    setProjects((prev) =>
      prev.map((p) => (p.projectId === projectId ? { ...p, clicked: true } : p))
    );
  };

  if (!professor) return <p className="p-6">📡 불러오는 중...</p>;

  return (
    <div className="min-h-screen bg-white p-6 pb-20 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">{professor.name} 교수님 평가</h1>
      <div className="w-full max-w-md space-y-4">
        {projects.map(({ projectId, projectName, team, formLink, clicked }) => (
          <div
            key={projectId}
            className="p-4 border rounded shadow flex flex-col bg-gray-50"
          >
            <p className="font-semibold mb-2">
              [{team}조] {projectName}
            </p>
            <button
              onClick={() => handleClick(projectId, formLink)}
              className={`px-4 py-2 rounded font-medium transition ${
                clicked
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {clicked ? "✅ 평가 완료" : "✍️ 평가하러 가기"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessorDetail;
