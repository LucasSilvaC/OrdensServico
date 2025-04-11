import React from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-amber-50 flex flex-col items-center justify-center p-6 text-center">
      {/* Ícone animado */}
      <div className="mb-6 animate-spin-slow">
        <Settings size={100} strokeWidth={1.5} color="#a855f7" />
      </div>

      {/* Mensagem principal */}
      <h1 className="text-5xl font-bold text-purple-400 drop-shadow mb-4">
        Acesso Negado
      </h1>
      <p className="text-lg text-gray-300 max-w-lg mb-8">
        Você não tem permissão para acessar esta página ou funcionalidade.
        Verifique suas credenciais ou entre em contato com o administrador.
      </p>

      {/* Botão de voltar */}
      <button
        onClick={() => navigate("/")}
        className="bg-purple-500 cursor-pointer hover:bg-purple-800 text-white font-semibold py-2 px-6 rounded transition duration-300 shadow hover:shadow-lg"
      >
        Voltar para o Início
      </button>
    </div>
  );
}