import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  console.log("hello rerender ");

  return (
    <div>
      <button className="bg-red-400 p-3 " onClick={() => navigate("/project")}>
        Project Page
      </button>
    </div>
  );
}

export default Home;
