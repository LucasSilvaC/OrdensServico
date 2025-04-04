import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  // Função de login
  const logar = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: user,
        password: password,
      });
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("user", user);
      navigate("/");
      alert(`Seja bem-vindo ao sistema, ${user}`);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Usuário ou senha incorretos!");
    }
  };

  // Função de registro
  const register = async (e) => {
    e.preventDefault();
    setError("");

    if (registerData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", {
        username: registerData.username,
        password: registerData.password,
      });

      alert("Cadastro realizado com sucesso! Faça login.");
      setRegisterData({ username: "", password: "", confirmPassword: "" });
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setError(
        error.response?.data?.detail || "Erro ao criar conta. Tente novamente."
      );
    }
  };

  return (
    <div className="flex justify-center gap-8 mt-60">
      {/* Login */}
      <section className="w-200 mx-auto flex flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-amber-50 text-5xl font-bold">LOGIN</h1>

        <form className="flex flex-col gap-4 items-center w-full" onSubmit={logar}>
          <div className="flex flex-col items-start w-120">
            <label className="text-amber-50 text-lg">Nome:</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 rounded bg-white text-black outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Digite seu nome"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col items-start w-120">
            <label className="text-amber-50 text-lg">Senha:</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 rounded bg-white text-black outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-120 bg-purple-500 hover:bg-purple-800 text-white font-bold py-2 rounded transition-colors cursor-pointer text-2xl"
          >
            Login
          </button>
        </form>

        <p className="text-amber-50 text-xl cursor-pointer hover:underline decoration-purple-500">
          Esqueci a senha
        </p>
      </section>

      {/* Registrar */}
      <section className="w-200 mx-auto flex flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-amber-50 text-5xl font-bold">REGISTRAR</h1>

        {error && <p className="text-red-500">{error}</p>}

        <form className="flex flex-col gap-4 items-center w-full" onSubmit={register}>
          <div className="flex flex-col items-start w-120">
            <label className="text-amber-50 text-lg">Nome:</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 rounded bg-white text-black outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Digite seu nome"
              value={registerData.username}
              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col items-start w-120">
            <label className="text-amber-50 text-lg">Senha:</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 rounded bg-white text-black outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Digite sua senha"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col items-start w-120">
            <label className="text-amber-50 text-lg">Confirmar senha:</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 rounded bg-white text-black outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Digite sua senha novamente"
              value={registerData.confirmPassword}
              onChange={(e) =>
                setRegisterData({ ...registerData, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-120 bg-purple-500 hover:bg-purple-800 text-white font-bold py-2 rounded transition-colors cursor-pointer text-2xl"
          >
            Registrar
          </button>
        </form>
      </section>
    </div>
  );
}