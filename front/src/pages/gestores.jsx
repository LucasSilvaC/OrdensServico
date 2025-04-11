import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import ModalGestores from "../modal/gestores";
import { FaTrash, FaPlus } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import axios from "axios";

export default function Gestores() {
    const name = "Gestores";
    const [dados, setDados] = useState([]);
    const [filtroSn, setFiltroSn] = useState("");
    const [filtroNome, setFiltroNome] = useState("");
    const [formVisivel, setFormVisivel] = useState(false);
    const [gestorSelecionado, setGestorSelecionado] = useState(null);
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
                const response = await axios.get("http://127.0.0.1:8000/api/gestores/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDados(response.data);
            } catch (error) {
                console.error("Erro ao buscar gestores:", error.response?.data || error.message);
            }
        };
        fetchData();
    }, [token, refresh]);

    const apagar = async (id) => {
        if (window.confirm("Deseja realmente apagar este gestor?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/gestor/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRefresh(!refresh);
            } catch (error) {
                console.error("Erro ao apagar gestor:", error.response?.data || error.message);
            }
        }
    };

    const criar = async (gestor) => {
        const snExiste = dados.some((item) => item.sn === gestor.sn);
        if (snExiste) {
            alert("Já existe um gestor com esse SN.");
            return;
        }
        try {
            await axios.post("http://127.0.0.1:8000/api/gestores/", gestor, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setRefresh(!refresh);
        } catch (error) {
            console.error("Erro ao criar gestor:", error.response?.data || error.message);
        }
    };

    const atualizar = async (gestor) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/gestor/${gestor.id}/`, gestor, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setRefresh(!refresh);
        } catch (error) {
            console.error("Erro ao atualizar gestor:", error.response?.data || error.message);
        }
    };

    const filtrarDados = () => {
        return dados.filter((dado) =>
            (filtroSn ? dado.sn?.includes(filtroSn) : true) &&
            (filtroNome ? dado.nome?.toLowerCase().includes(filtroNome.toLowerCase()) : true)
        );
    };

    return (
        <>
            <Header name={name} />
            <div className="container mx-auto p-6 mt-20 text-center text-amber-50">
                <h2 className="text-5xl font-bold mb-8 text-amber-50 drop-shadow">
                    Lista de Gestores
                </h2>

                <div className="flex flex-col items-center mb-6">
                    <FaPlus
                        className="text-amber-50 hover:text-purple-400 text-4xl cursor-pointer transition drop-shadow-sm"
                        onClick={() => {
                            setFormVisivel(true);
                            setGestorSelecionado(null);
                        }}
                    />
                </div>

                <ModalGestores
                    isOpen={formVisivel}
                    onClose={() => setFormVisivel(false)}
                    gestorSelecionado={gestorSelecionado}
                    criar={criar}
                    atualizar={atualizar}
                />

                {/* FILTROS */}
                <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Buscar pelo SN..."
                        value={filtroSn}
                        onChange={(e) => setFiltroSn(e.target.value)}
                        className="px-4 py-2 rounded bg-gray-800 text-amber-50 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={filtroNome}
                        onChange={(e) => setFiltroNome(e.target.value)}
                        className="px-4 py-2 rounded bg-gray-800 text-amber-50 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                {/* TABELA */}
                <button
                    onClick={() => setTabelaVisivel(!tabelaVisivel)}
                    className="mb-6 px-6 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded shadow-md transition cursor-pointer text-xl"
                >
                    {tabelaVisivel ? "Ocultar Tabela" : "Mostrar Tabela"}
                </button>

                {tabelaVisivel && (
                    <div className="overflow-x-auto transition-all duration-500 ease-in-out border border-purple-400 rounded-xl">
                        <table className="w-full rounded-xl overflow-hidden text-amber-100 bg-gray-800 cursor-pointer">
                            <thead>
                                <tr className="bg-gray-800 text-purple-100 border-b border-purple-400 text-xl">
                                    <th className="p-4 border-r border-purple-400">Ações</th>
                                    <th className="p-4 border-r border-purple-400">SN</th>
                                    <th className="p-4 border-r border-purple-400">Nome</th>
                                    <th className="p-4">Cargo</th>
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
                                                    setGestorSelecionado(dado);
                                                }}
                                            />
                                        </td>
                                        <td className="p-3 border-t border-purple-400 border-r">{dado.sn}</td>
                                        <td className="p-3 border-t border-purple-400 border-r">{dado.nome}</td>
                                        <td className="p-3 border-t border-purple-400">{dado.cargo}</td>
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