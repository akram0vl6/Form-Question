import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VuiVhod({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true); 
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Отправка...");

    try {
      const endpoint = isLogin
        ? "https://form2-2.onrender.com/api/login"
        : "https://form2-2.onrender.com/api/registration";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message || (isLogin ? " успешен!" : "успешна!"));
        if (result.token) {
          localStorage.setItem("authToken", result.token);
          setIsAuthenticated(true); 
          navigate("/questions");
        }
      } else {
        setMessage(result.message || "Ошибка");
      }
    } catch (error) {
      setMessage("Ошибка сети");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="fullName"
            placeholder="ФИО"
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password" 
          placeholder="Пароль"
          onChange={handleChange}
          required
        />
        <button type="submit">{isLogin ? "Войти" : "Зарегистрироваться"}</button>
      </form>
      <p>{message}</p>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Перейти к регистрации" : "Перейти ко входу"}
      </button>
    </div>
  );
}
