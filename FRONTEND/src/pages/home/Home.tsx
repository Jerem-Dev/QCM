import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import QcmList from "../../components/qcm/QcmList";

export default function Home() {
  const userData = useSelector((state: RootState) => state.auth.user);
  return (
    <div>
      <h1>Welcome to the home page</h1>
      {userData && (
        <div>
          <button>Answer a QCM</button>
          <QcmList />
        </div>
      )}
    </div>
  );
}
