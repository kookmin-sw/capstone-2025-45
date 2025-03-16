import { Link, useLocation } from "react-router-dom";

const NavigationBar = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 w-full bg-white border-t flex justify-around py-2 shadow-md">
      <Link to="/" className={`px-4 py-2 ${location.pathname === "/" ? "text-blue-500 font-bold" : "text-gray-600"}`}>
        Home
      </Link>
      <Link to="/projects" className={`px-4 py-2 ${location.pathname === "/projects" ? "text-blue-500 font-bold" : "text-gray-600"}`}>
        Projects
      </Link>
      <Link to="/my" className={`px-4 py-2 ${location.pathname === "/my" ? "text-blue-500 font-bold" : "text-gray-600"}`}>
        My
      </Link>
    </div>
  );
};

export default NavigationBar;
