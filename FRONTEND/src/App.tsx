import { useEffect } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import { restoreState } from "./features/auth/authSlice";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/home/Home";
import Signup from "./pages/Signup/Signup";
import CreateQcm from "./pages/CreateQcm/CreateQcm";
import AnswerQcm from "./pages/AnswerQcm/AnswerQcm";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedState = localStorage.getItem("authState");
    if (storedState) {
      dispatch(restoreState(JSON.parse(storedState)));
    }
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-qcm" element={<CreateQcm />} />
        <Route path="/qcm/:id" element={<AnswerQcm />} />
      </Routes>
    </Router>
  );
}
