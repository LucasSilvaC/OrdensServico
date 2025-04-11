import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import ModalArea from "../modal/areas";
import { FaTrash, FaPlus } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import axios from "axios";

export default function Area() {
    const name = "Área";
    const [dados, setDados] = useState([]);
    const [filtroNome, setFiltroNome] = useState("");
    const [formVisivel, setFormVisivel] = useState(false);
    const [areaSelecionada, setAreaSelecionada] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [tabelaVisivel, setTabelaVisivel] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    useEffect(() => {
        if (!user) {
            navigate("/error");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!token) return;
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/areas/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDados(response.data);
            } catch (error) {
                console.error("Erro ao buscar áreas:", error.response?.data || error.message);
            }
        };
        fetchData();
    }, [token, refresh]);

    const apagar = async (id) => {
        if (window.confirm("Deseja realmente apagar esta área?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/area/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRefresh(!refresh);
            } catch (error) {
                console.error("Erro ao apagar área:", error.response?.data || error.message);
            }
        }
    };

    const criar = async (dados) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/areas/", {
                nome: dados.nome,
            });
            console.log("Área criada com sucesso!", response.data);
        } catch (error) {
            console.error("Erro ao criar área: ", error.response?.data || error.message);
        }
    };

    const atualizar = async (area) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/area/${area.id}/`, area, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setRefresh(!refresh);
        } catch (error) {
            console.error("Erro ao atualizar área:", error.response?.data || error.message);
        }
    };

    const filtrarDados = () => {
        return dados.filter((dado) =>
            filtroNome ? dado.nome?.toLowerCase().includes(filtroNome.toLowerCase()) : true
        );
    };

    return (
        <>
            <Header name={name} />
            <div className="container mx-auto p-6 mt-20 text-center text-amber-50">
                <h2 className="text-5xl font-bold mb-8 text-amber-50 drop-shadow">Lista de Áreas</h2>

                <div className="flex flex-col items-center mb-6">
                    <FaPlus
                        className="text-amber-50 hover:text-purple-400 text-4xl cursor-pointer transition drop-shadow-sm"
                        onClick={() => {
                            setFormVisivel(true);
                            setAreaSelecionada(null);
                        }}
                    />
                </div>

                <ModalArea
                    isOpen={formVisivel}
                    onClose={() => setFormVisivel(false)}
                    areaSelecionada={areaSelecionada}
                    criar={criar}
                    atualizar={atualizar}
                />

                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={filtroNome}
                        onChange={(e) => setFiltroNome(e.target.value)}
                        className="px-4 py-2 rounded bg-gray-800 text-amber-50 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                <button
                    onClick={() => setTabelaVisivel(!tabelaVisivel)}
                    className="mb-6 px-6 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded shadow-md transition cursor-pointer text-xl"
                >
                    {tabelaVisivel ? "Ocultar Tabela" : "Mostrar Tabela"}
                </button>

                {tabelaVisivel && (
                    <div className="overflow-x-auto border border-purple-400 rounded-xl">
                        <table className="w-full rounded-xl text-amber-100 bg-gray-800">
                            <thead>
                                <tr className="bg-gray-800 text-purple-100 border-b border-purple-400 text-xl">
                                    <th className="p-4 border-r border-purple-400">Ações</th>
                                    <th className="p-4">Nome</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrarDados().map((dado) => (
                                    <tr
                                        key={dado.id}
                                        className="hover:bg-gray-900 transition-all duration-300"
                                    >
                                        <td className="p-3 flex justify-center gap-4 border-t border-purple-400 border-r">
                                            <FaTrash
                                                className="text-amber-50 hover:text-purple-400 cursor-pointer text-xl"
                                                onClick={() => apagar(dado.id)}
                                            />
                                            <MdCreate
                                                className="text-amber-50 hover:text-purple-400 cursor-pointer text-xl"
                                                onClick={() => {
                                                    setFormVisivel(true);
                                                    setAreaSelecionada(dado);
                                                }}
                                            />
                                        </td>
                                        <td className="p-3 border-t border-purple-400">{dado.nome}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}