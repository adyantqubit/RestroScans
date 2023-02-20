import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
function Home() {
    const navigate = useNavigate();
    const fun = () => navigate('/menu');
  return (
    <div>
      <button onClick={fun}>click</button>
    </div>
  );
}
export default Home;
