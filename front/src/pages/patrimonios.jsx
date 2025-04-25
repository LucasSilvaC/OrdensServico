import { LuFileJson } from "react-icons/lu";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import ModalPatrimonios from "../modal/patrimonios";
import { FaTrash, FaPlus } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import { BsFiletypeXlsx } from "react-icons/bs";
import axios from "axios";
import * as XLSX from "xlsx";

export default function Patrimonios() {
    const name = "Patrimônios";
    const [patrimonios, setPatrimonios] = useState([]);
    const [ambientes, setAmbientes] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [filtroNi, setFiltroNi] = useState("");
    const [filtroDescricao, setFiltroDescricao] = useState("");
    const [patrimonioSelecionado, setPatrimonioSelecionado] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtrados, setFiltrados] = useState([]);

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate("/error");
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patRes, ambRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/patrimonios/", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://127.0.0.1:8000/api/ambientes/", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setPatrimonios(patRes.data);
                setAmbientes(ambRes.data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error.response?.data || error.message);
            }
        };
        if (token) fetchData();
    }, [token, refresh]);

    useEffect(() => {
        const filtrarPatrimonios = () => {
            const dadosFiltrados = patrimonios.filter((p) => {
                const niMatch = p.ni.toLowerCase().includes(filtroNi.toLowerCase());
                const descricaoMatch = p.descricao.toLowerCase().includes(filtroDescricao.toLowerCase());
                return niMatch && descricaoMatch;
            });
            setFiltrados(dadosFiltrados);
        };

        filtrarPatrimonios();
    }, [filtroNi, filtroDescricao, patrimonios]);

    const criar = async (dados) => {
        try {
            const formData = new FormData();
            formData.append("ni", String(dados.ni));
            formData.append("descricao", dados.descricao);
            formData.append("localizacao", String(dados.localizacao));
    
            await axios.post("http://127.0.0.1:8000/api/patrimonios/", formData, {
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

    const atualizar = async (dados) => {
        try {
            const formData = new FormData();
            formData.append("ni", dados.ni);
            formData.append("descricao", dados.descricao);
            formData.append("localizacao", dados.localizacao);
            if (dados.media) formData.append("media", dados.media);

            await axios.put(`http://127.0.0.1:8000/api/patrimonio/${dados.id}/`, formData, {
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

    const apagar = async (id) => {
        if (window.confirm("Deseja apagar este patrimônio?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/patrimonio/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRefresh(!refresh);
            } catch (error) {
                console.error("Erro ao apagar patrimônio:", error.response?.data || error.message);
            }
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
                    if (!item.ni || !item.descricao || item.localizacao == null) {
                        console.warn("Item inválido ou incompleto:", item);
                        continue;
                    }

                    const localizacaoId = Array.isArray(item.localizacao) ? item.localizacao[0] : item.localizacao;
                    if (isNaN(localizacaoId)) {
                        console.warn("localizacao inválido:", item.localizacao);
                        continue;
                    }
    
                    const ambiente = ambientes.find((a) => a.id === localizacaoId);
                    if (!ambiente) {
                        console.warn("Ambiente não encontrado para ID:", localizacaoId);
                        continue;
                    }
    
                    const formData = new FormData();
                    formData.append("ni", item.ni);
                    formData.append("descricao", item.descricao);
                    formData.append("localizacao", String(ambiente.id)); 
    
                    await axios.post("http://127.0.0.1:8000/api/patrimonios/", formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    });
                }
    
                alert("Importação concluída com sucesso!");
                setRefresh((r) => !r);
            } catch (error) {
                console.error("Erro ao importar JSON:", error.response?.data || error);
                alert("Erro ao importar. Verifique o console.");
            }
        };
        reader.readAsText(file);
    };
    

    return (
        <>
            <Header name={name} />
            <div className="container mx-auto p-6 mt-20 text-center text-white">
                <h2 className="text-5xl font-bold mb-8 text-white drop-shadow">Lista de Patrimônios</h2>

                <div className="flex items-center mb-6 justify-center gap-6">
                    <FaPlus
                        className="text-white hover:text-purple-400 text-4xl cursor-pointer transition drop-shadow-sm"
                        onClick={() => {
                            setIsModalOpen(true);
                            setPatrimonioSelecionado(null);
                        }}
                    />
                    <label htmlFor="xlsxUpload">
                        <LuFileJson className="text-white hover:text-purple-400 text-4xl cursor-pointer transition drop-shadow-sm" />
                    </label>
                    <input
                        id="xlsxUpload"
                        type="file"
                        accept=".json"
                        onChange={handleImportarJson}
                        className="hidden"
                    />
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por NI..."
                        value={filtroNi}
                        onChange={(e) => setFiltroNi(e.target.value)}
                        className="px-4 py-2 rounded bg-gray-800 text-white border border-purple-500 focus:outline-none"
                    />
                    <input
                        type="text"
                        placeholder="Buscar por descrição..."
                        value={filtroDescricao}
                        onChange={(e) => setFiltroDescricao(e.target.value)}
                        className="px-4 py-2 rounded bg-gray-800 text-white border border-purple-500 focus:outline-none"
                    />
                </div>

                <div className="overflow-x-auto border border-purple-400 rounded-xl">
                    <table className="w-full text-white bg-gray-800">
                        <thead>
                            <tr className="bg-gray-800 text-purple-100 border-b border-purple-400 text-xl">
                                <th className="p-4 border-r border-purple-400">Ações</th>
                                <th className="p-4 border-r border-purple-400">NI</th>
                                <th className="p-4 border-r border-purple-400">Descrição</th>
                                <th className="p-4 border-r border-purple-400">Localização</th>
                                <th className="p-4">Imagem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-900 transition-all duration-300">
                                    <td className="p-3 flex justify-center gap-4 border-t border-purple-400 border-r">
                                        <FaTrash className="text-white hover:text-purple-400 cursor-pointer text-xl" onClick={() => apagar(p.id)} />
                                        <MdCreate
                                            className="text-white hover:text-purple-400 cursor-pointer text-xl"
                                            onClick={() => {
                                                setPatrimonioSelecionado(p);
                                                setIsModalOpen(true);
                                            }}
                                        />
                                    </td>
                                    <td className="p-3 border-t border-purple-400 border-r">{p.ni}</td>
                                    <td className="p-3 border-t border-purple-400 border-r">{p.descricao}</td>
                                    <td className="p-3 border-t border-purple-400 border-r">{p.localizacao?.descricao || "N/A"}</td>
                                    <td className="p-3 border-t border-purple-400">
                                        {p.media ? (
                                            <img src={`http://127.0.0.1:8000${p.media}`} alt="Imagem" className="w-12 h-12 object-cover mx-auto rounded" />
                                        ) : (
                                            "Sem imagem"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ModalPatrimonios
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                patrimonioSelecionado={patrimonioSelecionado}
                criar={criar}
                atualizar={atualizar}
                ambientes={ambientes}
            />
            <Footer />
        </>
    );
}