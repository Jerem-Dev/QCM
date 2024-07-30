import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  const { id } = useParams();
  const [qcm, setQcm] = useState<QCM>({
    id: 0,
    title: "",
    questions: [],
  });

  useEffect(() => {
    const fetchQcm = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/qcms/${id}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("An error occurred");
        }
        const data = await response.json();
        console.log(data);
        setQcm(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchQcm();
  }, [id]);

  return (
    <div>
      <h2>Answer QCM</h2>
      <h3>{qcm.title}</h3>
      <ul>
        {qcm.questions?.map((question: any) => (
          <li key={question.id}>
            <h4>{question.title}</h4>
            <p>{question.explanation}</p>
            <ul>
              {question.options?.map((option: any) => (
                <li key={option.id}>
                  <input type="checkbox" />
                  <label>{option.text_option}</label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button>Submit</button>
    </div>
  );
}
