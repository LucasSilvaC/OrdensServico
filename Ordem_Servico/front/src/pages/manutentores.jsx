import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import ModalManutentor from "../modal/manutentores"; 
import { FaTrash, FaPlus } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import axios from "axios";

export default function Manutentores() {
    const name = "Manutentores";
    const [dados, setDados] = useState([]);
    const [filtroNi, setFiltroNi] = useState("");
    const [filtroNome, setFiltroNome] = useState("");
    const [formVisivel, setFormVisivel] = useState(false);
    const [manutentorSelecionado, setManutentorSelecionado] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            alert("Faça login para acessar essa página");
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        if (!token) return;
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/manutentores", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDados(response.data);
            } catch (error) {
                console.error("Erro ao buscar manutentores:", error.response?.data || error.message);
            }
        };
        fetchData();
    }, [token, refresh]);

    const apagar = async (id) => {
        if (window.confirm("Deseja realmente apagar este manutentor?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/manutentor/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRefresh(!refresh);
            } catch (error) {
                console.error("Erro ao apagar manutentor:", error.response?.data || error.message);
            }
        }
    };

    const criar = async (manutentor) => {
        const niExiste = dados.some((item) => item.ni === manutentor.ni);
        if (niExiste) {
            alert("Já existe um manutentor com esse NI.");
            return;
        }
        try {
            await axios.post("http://127.0.0.1:8000/api/manutentores", manutentor, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setRefresh(!refresh);
        } catch (error) {
            console.error("Erro ao criar manutentor:", error.response?.data || error.message);
        }
    };

    const atualizar = async (manutentor) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/manutentor/${manutentor.id}`, manutentor, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setRefresh(!refresh);
        } catch (error) {
            console.error("Erro ao atualizar manutentor:", error.response?.data || error.message);
        }
    };

    const filtrarDados = () => {
        return dados.filter((dado) =>
            (filtroNi ? dado.ni?.includes(filtroNi) : true) &&
            (filtroNome ? dado.nome?.toLowerCase().includes(filtroNome.toLowerCase()) : true)
        );
    };

    return (
        <>
            <Header name={name} />
            <div className="container mx-auto p-4 mt-30 text-center">
                <h2 className="text-5xl font-bold mb-4 text-amber-50">Lista de Manutentores</h2>

                <div className="flex flex-col items-center">
                    <FaPlus
                        className="text-amber-50 cursor-pointer text-3xl mb-3"
                        onClick={() => {
                            setFormVisivel(true);
                            setManutentorSelecionado(null);
                        }}
                    />
                </div>

                <ModalManutentor
                    isOpen={formVisivel}
                    onClose={() => setFormVisivel(false)}
                    manutentorSelecionado={manutentorSelecionado}
                    criar={criar}
                    atualizar={atualizar}
                />

                <div className="flex flex-col items-center gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Buscar pelo NI..."
                        value={filtroNi}
                        onChange={(e) => setFiltroNi(e.target.value)}
                        className="border rounded px-2 py-1 w-80 text-amber-50"
                    />
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={filtroNome}
                        onChange={(e) => setFiltroNome(e.target.value)}
                        className="border rounded px-2 py-1 w-80 text-amber-50"
                    />
                </div>

                <table className="w-full mt-4 border-collapse text-amber-50">
                    <thead>
                        <tr className="bg-transparent">
                            <th className="border p-2">Ações</th>
                            <th className="border p-2">NI</th>
                            <th className="border p-2">Nome</th>
                            <th className="border p-2">Área</th>
                            <th className="border p-2">Gestor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrarDados().map((dado) => (
                            <tr key={dado.id} className="border">
                                <td className="border p-1 flex gap-2 justify-center">
                                    <FaTrash className="cursor-pointer text-3xl hover:text-[#aaaaaa]" onClick={() => apagar(dado.id)} />
                                    <MdCreate
                                        className="cursor-pointer text-3xl hover:text-[#aaaaaa]"
                                        onClick={() => {
                                            setFormVisivel(true);
                                            setManutentorSelecionado(dado);
                                        }}
                                    />
                                </td>
                                <td className="border p-2">{dado.ni}</td>
                                <td className="border p-2">{dado.nome}</td>
                                <td className="border p-2">{dado.area}</td>
                                <td className="border p-2">{dado.gestor?.nome || dado.gestor}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    );
}
