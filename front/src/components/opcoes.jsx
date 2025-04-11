import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CgLogOff } from "react-icons/cg";
import { MdLogin } from "react-icons/md";

export default function Options() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!user) {
      navigate("/error");
    }
  }, [user, navigate]);

  const logout = () => {
    if (!user) {
      alert("Nenhum usuário está logado!");
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert(`Deslogado com sucesso, ${user}, volte sempre!`);
    navigate("/login");
  };

  return (
    <section className="mt-24 max-w-4xl mx-auto flex flex-col items-center gap-6 p-8 rounded-lg bg-gray-800 shadow-xl shadow-purple-800/30 border border-purple-500">
      {/* Mensagem de boas-vindas */}
      <p className="text-amber-50 text-5xl font-semibold drop-shadow-sm tracking-wide text-center">
        Bem-vindo, <span className="text-purple-400">{user}</span>!
      </p>

      <h2 className="text-amber-50 text-3xl font-bold border-b-2 border-purple-500 pb-2 mt-4 tracking-wider">
        MENU DE OPÇÕES
      </h2>

      {/* Ícones de ação */}
      <div className="flex gap-10 mt-6">
        <div className="flex flex-col items-center group cursor-pointer" onClick={logout}>
          <CgLogOff className="text-6xl text-amber-50 group-hover:text-purple-400 transition-all duration-300 drop-shadow-sm group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]" />
          <span className="mt-2 text-amber-100 text-lg group-hover:text-purple-300 transition-colors">Logout</span>
        </div>

        <div className="flex flex-col items-center group cursor-pointer" onClick={() => navigate("/login")}>
          <MdLogin className="text-6xl text-amber-50 group-hover:text-purple-400 transition-all duration-300 drop-shadow-sm group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]" />
          <span className="mt-2 text-amber-100 text-lg group-hover:text-purple-300 transition-colors">Login</span>
        </div>
      </div>
    </section>
  );
}