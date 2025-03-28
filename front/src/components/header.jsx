import { useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";

export default function Header() {
    const navigate = useNavigate(); 
    return (
        <header className="bg-[#f09239] p-4 flex items-center justify-start gap-6">
            <IoHomeOutline className="text-white text-5xl cursor-pointer" />
            <ul className="flex gap-6 text-white text-lg">
                <li className="cursor-pointer hover:text-gray-600" onClick={() => navigate("/")}>Opcao1</li>
                <li className="cursor-pointer hover:text-gray-600" onClick={() => navigate("/")}>Opcao2</li>
                <li className="cursor-pointer hover:text-gray-600" onClick={() => navigate("/")}>Opcao3</li>
                <li className="cursor-pointer hover:text-gray-600" onClick={() => navigate("/")}>Opcao4</li>
            </ul>
        </header>
    );
}
