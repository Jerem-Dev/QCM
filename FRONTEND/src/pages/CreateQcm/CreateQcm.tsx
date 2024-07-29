import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
interface Option {
  text_option: string;
  correct: boolean;
}

interface Question {
  title: string;
  explanation?: string;
  options: Option[];
}

export default function CreateQcm() {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [title, setTitle] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      title: "",
      explanation: "",
      options: [
        { text_option: "", correct: false },
        { text_option: "", correct: false },
      ],
    },
  ]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: "",
        explanation: "",
        options: [
          { text_option: "", correct: false },
          { text_option: "", correct: false },
        ],
      },
    ]);
  };

  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({
      text_option: "",
      correct: false,
    });
    setQuestions(newQuestions);
  };

  const handleQcmTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    console.log(user?.id);
  };

  const handleQuestionTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].title = e.target.value;
    setQuestions(newQuestions);
  };

  const handleQuestionExplanationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].explanation = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
    optionIndex: number
  ) => {
    const { name, value, type, checked } = e.target;
    const newQuestions = [...questions];
    if (type === "checkbox") {
      newQuestions[questionIndex].options[optionIndex].correct = checked;
    } else {
      newQuestions[questionIndex].options[optionIndex].text_option = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/api/qcms/create-qcm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, questions }),
        }
      );
      if (response.ok) {
        setSuccess("QCM créé avec succès!");
        setError("");
        setTitle("");
        setQuestions([
          {
            title: "",
            explanation: "",
            options: [
              { text_option: "", correct: false },
              { text_option: "", correct: false },
            ],
          },
        ]);
      } else {
        throw new Error("Erreur lors de la création du QCM.");
      }
    } catch (error) {
      setError("Erreur lors de la création du QCM.");
      setSuccess("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Titre du QCM:</label>
        <input
          type="text"
          value={title}
          onChange={handleQcmTitleChange}
          required
        />
      </div>

      {questions.map((question, qIndex) => (
        <div key={qIndex}>
          <h3>Question {qIndex + 1}</h3>
          <div>
            <label>Titre de la question:</label>
            <input
              type="text"
              name="title"
              value={question.title}
              onChange={(e) => handleQuestionTitleChange(e, qIndex)}
              required
            />
          </div>
          <div>
            <label>Explication:</label>
            <input
              type="text"
              name="explanation"
              value={question.explanation || ""}
              onChange={(e) => handleQuestionExplanationChange(e, qIndex)}
            />
          </div>
          <div>
            <label>Options:</label>
            {question.options.map((option, oIndex) => (
              <div key={oIndex}>
                <input
                  type="text"
                  name="text_option"
                  value={option.text_option}
                  onChange={(e) => handleOptionChange(e, qIndex, oIndex)}
                  required
                />
                <label>
                  Correct
                  <input
                    type="checkbox"
                    name="correct"
                    checked={option.correct}
                    onChange={(e) => handleOptionChange(e, qIndex, oIndex)}
                  />
                </label>
              </div>
            ))}
            <button type="button" onClick={() => handleAddOption(qIndex)}>
              Ajouter une option
            </button>
          </div>
        </div>
      ))}
      <button type="button" onClick={handleAddQuestion}>
        Ajouter une question
      </button>
      <button type="submit">Créer QCM</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
}
