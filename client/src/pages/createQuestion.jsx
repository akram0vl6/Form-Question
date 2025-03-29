import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Question/Question.css";

function AddQuestion() {
  const [formData, setFormData] = useState({
    title: "",
    answer: "",
    category: "",
    difficulty: "",
    comments: [],
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("Пожалуйста, войдите в свой аккаунт.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("Пожалуйста, войдите в свой аккаунт.");
      return;
    }

    setMessage("Отправка...");

    try {
      const response = await fetch(
        "https://form2-2.onrender.com/api/createQuestion",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message || "Вопрос успешно добавлен!");
        setFormData({
          title: "",
          answer: "",
          category: "",
          difficulty: "",
          comments: [],
        });
      } else {
        setMessage(
          result.message || "Произошла ошибка при добавлении вопроса."
        );
      }
    } catch (error) {
      setMessage("Ошибка сети. Попробуйте позже.");
    }
  };

  if (!localStorage.getItem("authToken")) {
    return (
      <div className="add-question-container">
        <p style={{ color: "red" }}>
          Вы не авторизованы. Пожалуйста, войдите в аккаунт.
        </p>
        <button onClick={() => navigate("/login")}>Перейти ко входу</button>
      </div>
    );
  }

  return (
    <div className="add-question-container">
      <h2>Добавить новый вопрос</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Вопрос</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="answer">Ответ</label>
          <input
            type="text"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="category">Категория</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="difficulty">Сложность</label>
          <input
            type="text"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Добавить вопрос</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddQuestion;
