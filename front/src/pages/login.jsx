import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bars } from "react-loading-icons";

export default function Login() {
  const navigate = useNavigate();

  const [fadeOut, setFadeOut] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 z-50 flex items-center justify-center">
      <Bars fill="#D8B4FE" height="90px" />
    </div>
  );

  const logar = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: user,
        password: password,
      });

      localStorage.setItem("token", response.data.access);
      localStorage.setItem("user", JSON.stringify({ username: user }));

      setFadeOut(true);
      setTimeout(() => {
        navigate("/home");
      }, 1200);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Usuário ou senha incorretos!");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (registerData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("As senhas não coincidem!");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/registrar/comum/", {
        username: registerData.username,
        password: registerData.password,
      });

      alert("Cadastro realizado com sucesso! Faça login.");
      setRegisterData({ username: "", password: "", confirmPassword: "" });
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setError(
        error.response?.data?.detail ||
          "Erro ao criar conta. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gray-900 text-white flex flex-col md:flex-row items-center justify-center p-6 gap-10 transition-opacity duration-700 ${fadeOut ? "opacity-0" : "opacity-100"
        }`}
    >
      {isLoading && <LoadingOverlay />}

      {/* LOGIN */}
      <section className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center text-purple-400">
          LOGIN
        </h1>

        <form onSubmit={logar} className="flex flex-col gap-4">
          <div>
            <label className="text-lg">Nome de usuário:</label>
            <input
              type="text"
              className="w-full px-3 py-2 mt-1 rounded bg-white text-black focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Digite seu nome"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-lg">Senha:</label>
            <input
              type="password"
              className="w-full px-3 py-2 mt-1 rounded bg-white text-black focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 rounded transition cursor-pointer text-xl"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-purple-300 cursor-pointer hover:underline">
          Esqueci a senha
        </p>
      </section>

      {/* REGISTRO */}
      <section className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center text-purple-400">
          REGISTRAR
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={register} className="flex flex-col gap-4">
          <div>
            <label className="text-lg">Nome de usuário:</label>
            <input
              type="text"
              className="w-full px-3 py-2 mt-1 rounded bg-white text-black focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Digite seu nome"
              value={registerData.username}
              onChange={(e) =>
                setRegisterData({ ...registerData, username: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-lg">Senha:</label>
            <input
              type="password"
              className="w-full px-3 py-2 mt-1 rounded bg-white text-black focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Digite sua senha"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-lg">Confirmar senha:</label>
            <input
              type="password"
              className="w-full px-3 py-2 mt-1 rounded bg-white text-black focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Digite sua senha novamente"
              value={registerData.confirmPassword}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  confirmPassword: e.target.value,
                })
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 rounded transition cursor-pointer text-xl"
          >
            Registrar
          </button>
        </form>
      </section>
    </div>
  );
}
