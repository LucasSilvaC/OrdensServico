import { useNavigate } from "react-router-dom";

export default function Header({ name }) {
    const navigate = useNavigate();
    return (
        <header className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-500">

            <h1 className="text-4xl text-amber-50 font-bold">{name}</h1>
            <nav>
                <ul className="flex gap-10 text-amber-50 text-3xl">
                    <li className="cursor-pointer hover:text-[#aaaaaa]" onClick={() => {
                        navigate("/");
                    }}>Home</li>
                    <li className="cursor-pointer hover:text-[#aaaaaa]" onClick={() => {
                        navigate("/patrimonios");
                    }}>Patrimônios</li>
                    <li className="cursor-pointer hover:text-[#aaaaaa]" onClick={() => {
                        navigate("/ambientes");
                    }}>Ambientes</li>
                    <li className="cursor-pointer hover:text-[#aaaaaa]" onClick={() => {
                        navigate("/manutentores");
                    }}>Manutentores</li>
                    <li className="cursor-pointer hover:text-[#aaaaaa]" onClick={() => {
                        navigate("/responsaveis");
                    }}>Responsáveis</li>
                    <li className="cursor-pointer hover:text-[#aaaaaa]" onClick={() => {
                        navigate("/historicos");
                    }}>Históricos</li>
                          <li className="cursor-pointer hover:text-[#aaaaaa]" onClick={() => {
                        navigate("/gestores");
                    }}>Gestores</li>
                </ul>
            </nav>
        </header>
    );
}
