import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import ModalAmbientes from "../modal/ambientes";
import { FaTrash, FaPlus } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import { BsFiletypeXlsx } from "react-icons/bs";
import axios from "axios";
import * as XLSX from "xlsx";

export default function Ambientes() {
    const name = "Ambientes";
    const [ambientes, setAmbientes] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [filtroSig, setFiltroSig] = useState("");
    const [filtroDescricao, setFiltroDescricao] = useState("");
    const [ambienteSelecionado, setAmbienteSelecionado] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate("/error");
    }, [user]);

    useEffect(() => {
        const fetchAmbientes = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/ambientes/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAmbientes(res.data);
            } catch (error) {
                console.error("Erro ao buscar ambientes:", error.response?.data || error.message);
            }
        };
        if (token) fetchAmbientes();
    }, [token, refresh]);

    const criar = async (gestor) => {
        try {
            await axios.post("http://127.0.0.1:8000/api/ambientes/", gestor, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setRefresh(!refresh);
        } catch (error) {
            console.error("Erro ao criar ambiente:", error.response?.data || error.message);
        }
    };

    const atualizar = async (ambiente) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/ambiente/${ambiente.id}/`, ambiente, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setRefresh(!refresh);
        } catch (error) {
            console.error("Erro ao atualizar ambiente:", error.response?.data || error.message);
        }
    };

    const apagar = async (id) => {
        if (window.confirm("Deseja apagar este ambiente?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/ambiente/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRefresh(!refresh);
            } catch (error) {
                console.error("Erro ao apagar ambiente:", error.response?.data || error.message);
            }
        }
    };

    const salvar = async (ambiente) => {
        const payload = {
            sig: ambiente.sig,
            descricao: ambiente.descricao,
            ni: ambiente.ni,
            responsavel: ambiente.responsavel,
        };
        try {
            if (ambiente.id) {
                await axios.put(`http://127.0.0.1:8000/api/ambiente/${ambiente.id}/`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            } else {
                await axios.post(`http://127.0.0.1:8000/api/ambientes/`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            }
            setIsModalOpen(false);
            setAmbienteSelecionado(null);
            setRefresh(!refresh);
        } catch (error) {
            console.error("Erro ao salvar ambiente:", error.response?.data || error.message);
        }
    };

    const handleImportarXlsx = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            for (const item of jsonData) {
                const payload = {
                    sig: item.sig,
                    descricao: item.descricao,
                    ni: item.ni,
                    responsavel: item.responsavel,
                };
                try {
                    await axios.post("http://127.0.0.1:8000/api/ambientes/", payload, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                } catch (error) {
                    console.error("Erro ao importar ambiente:", error.response?.data || error.message);
                }
            }

            setRefresh(!refresh);
            alert("Importação finalizada!");
        } catch (err) {
            console.error("Erro ao processar arquivo:", err);
            alert("Erro ao importar arquivo.");
        }
    };

    const filtrados = ambientes.filter((a) =>
        (filtroSig ? String(a.sig).includes(filtroSig) : true) &&
        (filtroDescricao ? a.descricao?.toLowerCase().includes(filtroDescricao.toLowerCase()) : true)
    );

    return (
        <>
            <Header name={name} />
            <div className="container mx-auto p-6 mt-20 text-center text-white">
                <h2 className="text-5xl font-bold mb-8 text-white drop-shadow">Lista de Ambientes</h2>

                <div className="flex items-center mb-6 justify-center gap-6">
                    <FaPlus
                        className="text-white hover:text-purple-400 text-4xl cursor-pointer transition drop-shadow-sm"
                        onClick={() => {
                            setIsModalOpen(true);
                            setAmbienteSelecionado(null);
                        }}
                    />
                    <label htmlFor="xlsxUpload">
                        <BsFiletypeXlsx className="text-white hover:text-purple-400 text-4xl cursor-pointer transition drop-shadow-sm" />
                    </label>
                    <input
                        id="xlsxUpload"
                        type="file"
                        accept=".xlsx"
                        onChange={handleImportarXlsx}
                        className="hidden"
                    />
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por Sigla..."
                        value={filtroSig}
                        onChange={(e) => setFiltroSig(e.target.value)}
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
                                <th className="p-4 border-r border-purple-400">Sigla</th>
                                <th className="p-4 border-r border-purple-400">Descrição</th>
                                <th className="p-4 border-r border-purple-400">NI</th>
                                <th className="p-4">Responsável</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.map((amb) => (
                                <tr key={amb.id} className="hover:bg-gray-900 transition-all duration-300">
                                    <td className="p-3 flex justify-center gap-4 border-t border-purple-400 border-r">
                                        <FaTrash className="text-white hover:text-purple-400 cursor-pointer text-xl" onClick={() => apagar(amb.id)} />
                                        <MdCreate
                                            className="text-white hover:text-purple-400 cursor-pointer text-xl"
                                            onClick={() => {
                                                setAmbienteSelecionado(amb);
                                                setIsModalOpen(true);
                                            }}
                                        />
                                    </td>
                                    <td className="p-3 border-t border-purple-400 border-r">{amb.sig}</td>
                                    <td className="p-3 border-t border-purple-400 border-r">{amb.descricao}</td>
                                    <td className="p-3 border-t border-purple-400 border-r">{amb.ni}</td>
                                    <td className="p-3 border-t border-purple-400">{amb.responsavel}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ModalAmbientes
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ambienteSelecionado={ambienteSelecionado}
                criar={criar}
                atualizar={atualizar}
            />
            <Footer />
        </>
    );
}
