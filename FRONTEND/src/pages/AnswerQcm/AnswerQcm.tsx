import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface QCM {
  id: number;
  title: string;
  questions: Question[];
}

interface Question {
  id: number;
  title: string;
  explanation: string;
  options: Option[];
}

interface Option {
  id: number;
  text_option: string;
  correct: boolean;
}

export default function AnswerQcm() {
  const { token } = useSelector((state: RootState) => state.auth);
  const { id } = useParams();
  const [qcm, setQcm] = useState<QCM>({ id: 0, title: "", questions: [] });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchQcm = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/qcms/${id}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("An error occurred");
        }
        const data = await response.json();
        setQcm(data);
        fetchUserProgress();
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchUserProgress = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/qcms/user-progress/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("An error occurred");
        }
        const data = await response.json();
        setCurrentQuestionIndex(data.currentQuestionIndex);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchQcm();
  }, [id, token]);

  const handleOptionChange = (optionId: number) => {
    setSelectedOptionIds((prevSelected) =>
      prevSelected.includes(optionId)
        ? prevSelected.filter((id) => id !== optionId)
        : [...prevSelected, optionId]
    );
  };

  const handleSubmit = async () => {
    if (selectedOptionIds === null) return;

    try {
      const response = await fetch(
        "http://localhost:3000/api/users/user-answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            optionIds: selectedOptionIds,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("An error occurred");
      }

      const result = await response.json();
      setIsCorrect(result.correct);
      setShowResults(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNextQuestion = () => {
    setShowResults(false);
    setIsCorrect(null);
    setSelectedOptionIds([]);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const currentQuestion = qcm.questions[currentQuestionIndex];

  return (
    <div>
      <h2>Answer QCM</h2>
      <h3>{qcm.title}</h3>
      {currentQuestion && (
        <div>
          <h4>
            Question {currentQuestionIndex + 1} / {qcm.questions.length}
          </h4>
          <h4>{currentQuestion.title}</h4>

          <ul>
            {currentQuestion.options.map((option: Option) => (
              <li key={option.id}>
                <input
                  type="checkbox"
                  name="option"
                  checked={selectedOptionIds.includes(option.id)}
                  onChange={() => handleOptionChange(option.id)}
                />
                <label
                  style={{
                    color: showResults
                      ? option.correct
                        ? "green"
                        : selectedOptionIds.includes(option.id)
                        ? "red"
                        : "white"
                      : "white",
                  }}
                >
                  {option.text_option}
                </label>
              </li>
            ))}
          </ul>
          {showResults ? (
            <div>
              <p>{isCorrect ? "Correct!" : "Incorrect!"}</p>
              <p>{currentQuestion.explanation}</p>
              {currentQuestionIndex + 1 < qcm.questions.length && (
                <button onClick={handleNextQuestion}>Next Question</button>
              )}
              {currentQuestionIndex + 1 === qcm.questions.length && (
                <button onClick={handleNextQuestion}>Fini</button>
              )}
            </div>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
      )}
      {!currentQuestion && <p>QCM complété !</p>}
    </div>
  );
}
