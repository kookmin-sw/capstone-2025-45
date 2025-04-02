import { useState, useEffect } from "react";
import { getCurrentUser } from "../utils/firebaseAuth";

const NavigationBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser(setUser);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-md flex justify-around p-2 border-t">
      <button onClick={() => window.location.href = "/"} className="text-lg">🏠 Home</button>
      <button onClick={() => window.location.href = "/projects"} className="text-lg">📂 Projects</button>
      <button onClick={() => window.location.href = "/my"} className="text-lg">📊 My</button>
    </div>
  );
};

export default NavigationBar;
