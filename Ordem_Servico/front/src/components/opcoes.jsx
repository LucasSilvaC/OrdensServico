import { useNavigate } from "react-router-dom";
import { CgLogOff } from "react-icons/cg";
import { MdLogin } from "react-icons/md";

export default function Options() {
    const navigate = useNavigate();
    const user = localStorage.getItem("user"); 

    const logout = () => {
        if (!user) {  
            alert("Nenhum usuário está logado!");
            return;
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");  
        alert(`Deslogado com sucesso, ${user}`);
        navigate("/login");
    };

    return (
        <section className="mt-20 max-w-200 mx-auto flex flex-col items-center gap-4 p-4 rounded">
             {user ? (
                <p className="text-amber-50 text-6xl">Bem-vindo, {user}!</p>
            ) : (
                <p className="text-red-500 text-2xl">Você não está logado.</p>
            )}
            <h1 className="text-amber-50 text-3xl font-bold mt-8">MENU</h1>
            <div className="flex gap-4 mt-8">
                <CgLogOff
                    className="text-6xl cursor-pointer text-amber-50 transition-transform duration-300 hover:-translate-y-1"
                    onClick={logout}
                />
                <MdLogin
                    className="text-6xl cursor-pointer text-amber-50 transition-transform duration-300 hover:-translate-y-1"
                    onClick={() => navigate("/login")}
                />
            </div>
        </section>
    );
}
