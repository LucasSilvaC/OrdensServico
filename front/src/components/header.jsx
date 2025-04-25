import { useNavigate } from "react-router-dom";

export default function Header({ name }) {
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Ordem Serviço", path: "/ordemservico" },
    { label: "Patrimônios", path: "/patrimonios" },
    { label: "Ambientes", path: "/ambientes" },
    { label: "Manutentores", path: "/manutentores" },
    { label: "Área", path: "/areas" },
    { label: "Gestores", path: "/gestores" },
  ];

  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-gray-900 shadow-lg shadow-purple-900/40 z-50">
      <h1 className="text-4xl text-white font-extrabold tracking-wide uppercase drop-shadow-md">
        {name}
      </h1>

      <nav className="mt-4 md:mt-0">
        <ul className="flex flex-wrap gap-6 text-white text-lg md:text-2xl font-medium transition-all">
          {navItems.map((item) => (
            <li
              key={item.path}
              className="cursor-pointer relative group"
              onClick={() => navigate(item.path)}
            >
              <span className="transition duration-300 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]">
                {item.label}
              </span>
              <div className="absolute left-0 bottom-0 h-[2px] w-0 bg-purple-500 transition-all duration-300 group-hover:w-full" />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}