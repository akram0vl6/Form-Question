import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import "./Question.css";

function Question() {
  const [vopu, setVopu] = useState([]);
  const [otevetuuu, setOtevetuuu] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all"); // Категория по умолчанию

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
    setVopu([]); // Сбрасываем старые вопросы
    setSkip(0); // Сбрасываем skip
    setHasMore(true); // Сбрасываем флаг загрузки
    loadMoreQuestions(0); // Загружаем вопросы для новой категории
  }, [selectedCategory]); // Перезагружаем при изменении категории

  const loadMoreQuestions = async (newSkip) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://form2-2.onrender.com/api/getAllQuestions?skip=${newSkip}&category=${
          selectedCategory === "all" ? "" : selectedCategory
        }`
      );
      const data = await response.json();
      console.log("Полученные вопросы:", data);

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setVopu((prev) => [...prev, ...data]);
        setSkip(newSkip + 5);
      }
    } catch (error) {
      console.error("Ошибка загрузки вопросов:", error);
    }

    setLoading(false);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 &&
      !loading
    ) {
      loadMoreQuestions(skip);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [skip, loading]);

  const sendAnswer = async (index, questionId, userAnswer) => {
    if (!isAuthenticated) {
      alert("Ты не вошел в аккаунт!");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `https://form2-2.onrender.com/api/addComment/${questionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ koment: userAnswer }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Комментарий отправлен успешно", result);
        setVopu((prevVopu) =>
          prevVopu.map((item) =>
            item._id === questionId
              ? { ...item, koment: [...(item.koment || []), userAnswer] }
              : item
          )
        );
        setOtevetuuu((prev) => ({ ...prev, [index]: "" }));
      } else {
        console.error("Ошибка при отправке комментария", result.message);
      }
    } catch (error) {
      console.error("Ошибка при отправке ответа на сервер", error);
    }
  };

  const checkAnswer = (index, questionId) => {
    const userAnswer = (otevetuuu[index] || "").trim();
    if (userAnswer) {
      sendAnswer(index, questionId, userAnswer);
    }
  };

  const deleteComment = async (questionId, commentIndex) => {
    if (!isAuthenticated) {
      alert("Ты не вошел в аккаунт!");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `https://form2-2.onrender.com/api/deleteComment/${questionId}/${commentIndex}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setVopu((prevVopu) =>
          prevVopu.map((item) =>
            item._id === questionId
              ? {
                  ...item,
                  koment: item.koment.filter(
                    (_, index) => index !== commentIndex
                  ),
                }
              : item
          )
        );
      } else {
        console.error("Ошибка при удалении комментария", result.message);
      }
    } catch (error) {
      console.error("Ошибка при удалении комментария", error);
    }
  };

  return (
    <div className="vopros-container">
      <h2>Выберите категорию:</h2>
      <div className="category-buttons">
        <button className="category-btn" onClick={() => setSelectedCategory("all")}>Все</button>
        <button className="category-btn" onClick={() => setSelectedCategory("История")}>История</button>
        <button className="category-btn" onClick={() => setSelectedCategory("Алгебра")}>Алгебра</button>
      </div>

      <h3>
        {selectedCategory === "all"
          ? "Все вопросы"
          : selectedCategory === "История"
          ? "Вопросы по Истории"
          : selectedCategory === "Алгебра"
          ? "Вопросы по Алгебре"
          : "Неизвестная категория"}
      </h3>

      {vopu.length > 0 ? (
        vopu.map((item, index) => (
          <div key={index} className="vopros-item">
            <p>
              <strong>Вопрос:</strong> {item.title}
            </p>
            {isAuthenticated ? (
              <>
                <input
                  type="text"
                  placeholder="Введите ответ"
                  value={otevetuuu[index] || ""}
                  onChange={(e) =>
                    setOtevetuuu({ ...otevetuuu, [index]: e.target.value })
                  }
                />
                <ul>
                  {item.koment && item.koment.length > 0 ? (
                    item.koment.map((comment, i) => (
                      <div className="komment" key={i}>
                        <li>{comment}</li>
                        <MdDelete
                          className="delete-btn"
                          onClick={() => deleteComment(item._id, i)}
                        />
                      </div>
                    ))
                  ) : (
                    <li>Комментариев пока нет</li>
                  )}
                </ul>
                <button onClick={() => checkAnswer(index, item._id)}>
                  Отправить ответ
                </button>
              </>
            ) : (
              <p className="error-message">
                🔒 Ты не авторизован. Войди в аккаунт, чтобы ответить на
                вопросы.
              </p>
            )}
          </div>
        ))
      ) : (
        <p>Загрузка вопросов...</p>
      )}

      {loading && <p className="loading-message">Загружаем ещё вопросы...</p>}
    </div>
  );
}

export default Question;
