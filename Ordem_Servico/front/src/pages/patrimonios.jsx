import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import ModalPatrimonios from "../modal/patrimonios";
import { FaTrash, FaPlus } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import axios from "axios";

export default function Patrimonios() {
    const name = "Patrimônios";
    const [dados, setDados] = useState([]);
    const [filtroNi, setFiltroNi] = useState("");
    const [filtroDescricao, setFiltroDescricao] = useState("");
    const [formVisivel, setFormVisivel] = useState(false);
    const [patrimonioSelecionado, setPatrimonioSelecionado] = useState(null);
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
                const response = await axios.get("http://127.0.0.1:8000/api/patrimonios", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDados(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error.response?.data || error.message);
            }
        };
        fetchData();
    }, [token, refresh]);

    const apagar = async (id) => {
        if (window.confirm("Deseja realmente apagar?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/patrimonio/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRefresh(!refresh);
            } catch (error) {
                console.error("Erro ao apagar patrimônio:", error.response?.data || error.message);
            }
        }
    };

    const criar = async (patrimonio) => {
        const formData = new FormData();
        formData.append("ni", patrimonio.ni);
        formData.append("descricao", patrimonio.descricao);
        formData.append("localizacao", patrimonio.localizacao);
        if (patrimonio.media) {
            formData.append("media", patrimonio.media);
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/patrimonios", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setRefresh(!refresh);
        } catch (error) {
            console.error("Erro ao criar patrimônio:", error.response?.data || error.message);
        }
    };

    const atualizar = async (patrimonio) => {
        const formData = new FormData();
        formData.append("ni", patrimonio.ni);
        formData.append("descricao", patrimonio.descricao);
        formData.append("localizacao", patrimonio.localizacao);
        if (patrimonio.media instanceof File) {
            formData.append("media", patrimonio.media);
        }

        try {
            await axios.post(`http://127.0.0.1:8000/api/patrimonio/${patrimonio.id}?_method=PUT`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setRefresh(!refresh);
        } catch (error) {
            console.error("Erro ao atualizar patrimônio:", error.response?.data || error.message);
        }
    };

    const filtrarDados = () => {
        return dados.filter((dado) =>
            (filtroNi ? dado.ni?.includes(filtroNi) : true) &&
            (filtroDescricao ? dado.descricao?.toLowerCase().includes(filtroDescricao.toLowerCase()) : true)
        );
    };

    return (
        <>
            <Header name={name} />
            <div className="container mx-auto p-4 mt-30 text-center">
                <h2 className="text-5xl font-bold mb-4 text-amber-50">Lista de Patrimônios</h2>

                <div className="flex flex-col items-center">
                    <FaPlus
                        className="text-amber-50 cursor-pointer text-3xl mb-3"
                        onClick={() => {
                            setFormVisivel(true);
                            setPatrimonioSelecionado(null);
                        }}
                    />
                </div>

                <ModalPatrimonios
                    isOpen={formVisivel}
                    onClose={() => setFormVisivel(false)}
                    patrimonioSelecionado={patrimonioSelecionado}
                    criar={criar}
                    atualizar={atualizar}
                />

                <div className="flex flex-col items-center gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Buscar pelo NI..."
                        value={filtroNi}
                        onChange={(e) => setFiltroNi(e.target.value)}
                        className="border rounded px-2 py-1 w-80 text-amber-50 "
                    />
                    <input
                        type="text"
                        placeholder="Buscar por descrição..."
                        value={filtroDescricao}
                        onChange={(e) => setFiltroDescricao(e.target.value)}
                        className="border rounded px-2 py-1 w-80 text-amber-50"
                    />
                </div>

                <table className="w-full mt-4 border-collapse border border-amber-50 text-amber-50">
                    <thead>
                        <tr className="bg-transparent">
                            <th className="border p-2">Ações</th>
                            <th className="border p-2">NI</th>
                            <th className="border p-2">Descrição</th>
                            <th className="border p-2">Localização</th>
                            <th className="border p-2">Mídia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrarDados().map((dado) => (
                            <tr key={dado.id} className="border">
                                <td className="border p-2 flex gap-2 justify-center">
                                    <FaTrash className="text-amber-50 cursor-pointer hover:text-[#aaaaaa]" onClick={() => apagar(dado.id)} />
                                    <MdCreate
                                        className="text-amber-50 cursor-pointer hover:text-[#aaaaaa]"
                                        onClick={() => {
                                            setFormVisivel(true);
                                            setPatrimonioSelecionado(dado);
                                        }}
                                    />
                                </td>
                                <td className="border p-2">{dado.ni}</td>
                                <td className="border p-2">{dado.descricao}</td>
                                <td className="border p-2">{dado.localizacao?.nome || "-"}</td>
                                <td className="border p-2">
                                    {dado.media ? (
                                        <img
                                            src={`http://127.0.0.1:8000${dado.media}`}
                                            alt="Mídia do patrimônio"
                                            className="w-20 h-20 object-cover mx-auto"
                                        />
                                    ) : (
                                        "Sem imagem"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    );
}
