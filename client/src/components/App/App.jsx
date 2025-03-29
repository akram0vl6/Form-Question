import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Auth from "../../pages/Auth/Auth";
import Question from "../../pages/Question/Question";
import AddQuestion from "../../pages/createQuestion";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <header>
        <div className="header">
          <div className="container">
            <nav className="navbar">
              <ul>
                <li>
                  <Link to="/">Главная</Link>
                </li>
                <li>
                  <Link to="/questions">Вопросы</Link>
                </li>
                <li>
                  <Link to="/add">Добавить вопрос</Link>
                </li>
                <li>
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                    >
                      Выход из аккаунта
                    </button>
                  ) : (
                    <Link to="/login">Вход/Регистрация</Link>
                  )}
                </li>
              </ul>
            </nav>

            <div className="content">
              <Routes>
                <Route path="/" element={<h1>Добро пожаловать!</h1>} />
                <Route path="/questions" element={<Question />} />
                <Route path="/add" element={<AddQuestion />} />
                <Route
                  path="/login"
                  element={<Auth setIsAuthenticated={setIsAuthenticated} />}
                />
              </Routes>
            </div>
          </div>
        </div>
      </header>
    </Router>
  );
}

export default App;
