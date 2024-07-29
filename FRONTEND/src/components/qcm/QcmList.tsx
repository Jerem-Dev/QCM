import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";

export default function QcmList() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [qcms, setQcms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchQcms = async () => {
        try {
          const response = await fetch("http://localhost:3000/api/qcms", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error("An error occurred");
          }
          const data = await response.json();
          console.log(data);
          setQcms(data);
        } catch (error) {
          console.error("Error:", error);
        }
      };
      fetchQcms();
    }
  }, [user]);

  const handleNavigateCreateQcm = () => {
    navigate("/create-qcm");
  };
  return (
    <div>
      <h2>QCM List</h2>
      <ul>
        {qcms.map((qcm: any) => (
          <li key={qcm.id}>
            <a>{qcm.title}</a>
          </li>
        ))}
      </ul>
      <button onClick={handleNavigateCreateQcm}>Create a QCM</button>
    </div>
  );
}
