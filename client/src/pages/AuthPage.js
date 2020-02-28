import React, { useState, useEffect, useContext } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/AuthContext";

export const AuthPage = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const { loading, error, request, clearError} = useHttp()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  const changeHandler = e => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value})
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form})
      console.log("TCL: registerHandler -> data", data)

    } catch {

    }
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId)
    } catch {

    }
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Сократи ссылку</h1>
        <div className="col s12">
          <div className="card blue darken-1">
            <div className="card-content white-text">
              <span className="card-title">Авторизация</span>
              <div>
              <div className="input-field">
                  <input
                  placeholder="Введите email"
                  id="email"
                  type="text"
                  name="email"
                  className="yellow-input"
                  onChange={changeHandler}
                  />
                  <label htmlFor="first_name">Email</label>
              </div>
              <div className="input-field">
                  <input
                  placeholder="Введите пароль"
                  id="password"
                  type="password"
                  name="password"
                  className="yellow-input"
                  onChange={changeHandler}
                  />
                  <label htmlFor="first_name">Пароль</label>
              </div>
              </div>
            </div>
            <div className="card-action">
              <button
                className="btn yellow darken-4"
                style={{ marginRight: 10}}
                onClick={loginHandler}
                disabled={loading}
              >
                Войти
              </button>
              <button
                className="btn grey lighten-1 black-text"
                onClick={registerHandler}
                disabled={loading}
              >
                Регистрация
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
