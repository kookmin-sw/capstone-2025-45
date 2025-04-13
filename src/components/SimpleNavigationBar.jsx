// components/SimpleNavigationBar.jsx
import { useNavigate } from "react-router-dom";

const SimpleNavigationBar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-md flex justify-around p-2 border-t">
      <button onClick={() => navigate("/simple")} className="text-lg">
        🏠 Home
      </button>
      <button onClick={() => navigate("/simple/projects")} className="text-lg">
        📂 Projects
      </button>
    </div>
  );
};

export default SimpleNavigationBar;
