import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import ModalPatrimonios from "../modal/patrimonios";
import { FaTrash, FaPlus } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import axios from "axios";
import { LuFileJson } from "react-icons/lu";

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
    const [ambientes, setAmbientes] = useState([]);

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

    useEffect(() => {
        const fetchAmbientes = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://127.0.0.1:8000/api/ambientes", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAmbientes(response.data);
            } catch (error) {
                console.error("Erro ao buscar ambientes:", error.response?.data || error.message);
            }
        };
        fetchAmbientes();
    }, []);

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
        const niExiste = dados.some((item) => item.ni === patrimonio.ni);
        if (niExiste) {
            alert("Já existe um patrimônio com esse NI.");
        }

        const formData = new FormData();
        formData.append("ni", patrimonio.ni);
        formData.append("descricao", patrimonio.descricao);
        formData.append("localizacao", patrimonio.localizacao?.id || patrimonio.localizacao);
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

    const handleImportarJson = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);

                for (const item of jsonData) {
                    if (!item.ni || !item.descricao || !item.localizacao) {
                        console.warn("Item ignorado (faltando campos):", item);
                        continue;
                    }

                    const ambiente = ambientes.find(
                        (a) => a.nome.trim().toLowerCase() === item.localizacao.trim().toLowerCase()
                    );

                    const formData = new FormData();
                    formData.append("ni", String(item.ni));
                    formData.append("descricao", item.descricao);
                    formData.append("localizacao", ambiente.id);

                    await axios.post("http://127.0.0.1:8000/api/patrimonios", formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    });
                }

                alert("Importação concluída!");
                setRefresh((r) => !r);
            } catch (error) {
                console.error("Erro ao importar JSON:", error.response?.data || error);
                alert("Erro ao importar. Tente novamente ou verifique os dados.");
            }
        };
        reader.readAsText(file);
    };

    const atualizar = async (patrimonio) => {
        const niExiste = dados.some((item) => item.ni === patrimonio.ni);
        if (niExiste) {
            alert("Já existe um patrimônio com esse NI.");
        }

        const formData = new FormData();
        formData.append("ni", patrimonio.ni);
        formData.append("descricao", patrimonio.descricao);
        formData.append("localizacao", patrimonio.localizacao?.id || patrimonio.localizacao);
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

                <div className="flex items-center justify-center gap-3 text-4xl text-amber-50">
                    <FaPlus
                        className="cursor-pointer mb-8 mt-5  hover:text-[#aaaaaa]"
                        onClick={() => {
                            setFormVisivel(true);
                            setPatrimonioSelecionado(null);
                        }}
                    />
                    <input
                        type="file"
                        accept=".json"
                        style={{ display: "none" }}
                        id="import-json"
                        onChange={handleImportarJson}
                    />

                    <LuFileJson
                        className="cursor-pointer mb-8 mt-5 hover:text-amber-200"
                        onClick={() => document.getElementById("import-json").click()}
                    />
                </div>

                <ModalPatrimonios
                    isOpen={formVisivel}
                    onClose={() => setFormVisivel(false)}
                    patrimonioSelecionado={patrimonioSelecionado}
                    criar={criar}
                    atualizar={atualizar}
                    ambientes={ambientes}
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
                    <tr className="bg-zinc-800">
                            <th className="border p-3">Ações</th>
                            <th className="border p-3">NI</th>
                            <th className="border p-3">Descrição</th>
                            <th className="border p-3">Localização</th>
                            <th className="border p-3">Mídia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrarDados().map((dado) => (
                            <tr key={dado.id} className="border text-base">
                                <td className="border p-3">
                                    <div className="flex gap-4 justify-center items-center text-3xl">
                                        <FaTrash
                                            className="cursor-pointer hover:text-[#aaaaaa] transition"
                                            onClick={() => apagar(dado.id)}
                                        />
                                        <MdCreate
                                            className="cursor-pointer hover:text-[#aaaaaa] transition"
                                            onClick={() => {
                                                setFormVisivel(true);
                                                setPatrimonioSelecionado(dado);
                                            }}
                                        />
                                    </div>
                                </td>
                                <td className="border p-3">{dado.ni}</td>
                                <td className="border p-3">{dado.descricao}</td>
                                <td className="border p-3">
                                    {dado.localizacao_obj && dado.localizacao_obj.nome
                                        ? dado.localizacao_obj.nome
                                        : `ID: ${dado.localizacao || "-"}`}
                                </td>
                                <td className="border p-3">
                                    {dado.media ? (
                                        <img
                                            src={`http://127.0.0.1:8000${dado.media}`}
                                            alt="Mídia do patrimônio"
                                            className="w-20 h-20 object-cover mx-auto rounded shadow"
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
