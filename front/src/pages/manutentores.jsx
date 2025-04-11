import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import ModalManutentores from "../modal/manutentores";
import { FaTrash, FaPlus } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import { BsFiletypeXlsx } from "react-icons/bs";
import axios from "axios";
import * as XLSX from "xlsx";

export default function Manutentores() {
    const name = "Manutentores";
    const [dados, setDados] = useState([]);
    const [filtroSn, setFiltroSn] = useState("");
    const [filtroNome, setFiltroNome] = useState("");
    const [formVisivel, setFormVisivel] = useState(false);
    const [manutentorSelecionado, setManutentorSelecionado] = useState(null);
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
                const response = await axios.get("http://127.0.0.1:8000/api/manutentores/", {
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
                await axios.delete(`http://127.0.0.1:8000/api/manutentor/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRefresh(!refresh);
            } catch (error) {
                console.error("Erro ao apagar manutentor:", error.response?.data || error.message);
            }
        }
    };

    const criar = async (manutentor) => {
        const snExiste = dados.some((item) => item.sn === manutentor.sn);
        if (snExiste) {
            alert("Já existe um manutentor com esse SN.");
            return;
        }
        try {
            await axios.post("http://127.0.0.1:8000/api/manutentores/", manutentor, {
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
            await axios.put(`http://127.0.0.1:8000/api/manutentor/${manutentor.id}/`, manutentor, {
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
            (filtroSn ? dado.sn?.includes(filtroSn) : true) &&
            (filtroNome ? dado.nome?.toLowerCase().includes(filtroNome.toLowerCase()) : true)
        );
    };

    const handleImportarXlsx = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            for (const item of jsonData) {
                if (!item.sn || !item.nome || !item.email || !item.area || !item.gestor) {
                    console.warn("Item ignorado (faltando campos):", item);
                    continue;
                }

                const payload = {
                    sn: String(item.sn),
                    nome: item.nome,
                    email: item.email,
                    area: { nome: item.area },
                    gestor: { nome: item.gestor },
                };

                try {
                    await axios.post("http://127.0.0.1:8000/api/manutentores/", payload, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                } catch (error) {
                    console.error("Erro ao criar manutentor:", error.response?.data || error.message);
                }
            }

            alert("Importação concluída com sucesso!");
            setRefresh((r) => !r);
        } catch (error) {
            console.error("Erro ao processar arquivo XLSX:", error);
            alert("Erro ao importar. Verifique o arquivo.");
        }
    };

    return (
        <>
            <Header name={name} />
            <div className="container mx-auto p-6 mt-20 text-center text-amber-50">
                <h2 className="text-5xl font-bold mb-8 text-amber-50 drop-shadow">
                    Lista de Manutentores
                </h2>

                <div className="flex items-center mb-6 justify-center gap-6">
                    <FaPlus
                        className="text-amber-50 hover:text-purple-400 text-4xl cursor-pointer transition drop-shadow-sm"
                        onClick={() => {
                            setFormVisivel(true);
                            setManutentorSelecionado(null);
                        }}
                    />
                    <label htmlFor="xlsxUpload">
                        <BsFiletypeXlsx
                            className="text-amber-50 hover:text-purple-400 text-4xl cursor-pointer transition drop-shadow-sm"
                        />
                    </label>
                    <input
                        id="xlsxUpload"
                        type="file"
                        accept=".xlsx"
                        onChange={handleImportarXlsx}
                        className="hidden"
                    />
                </div>

                <ModalManutentores
                    isOpen={formVisivel}
                    onClose={() => setFormVisivel(false)}
                    manutentorSelecionado={manutentorSelecionado}
                    criar={criar}
                    atualizar={atualizar}
                />

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
                                    <th className="p-4 border-r border-purple-400">Email</th>
                                    <th className="p-4 border-r border-purple-400">Área</th>
                                    <th className="p-4">Gestor</th>
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
                                                    setManutentorSelecionado(dado);
                                                }}
                                            />
                                        </td>
                                        <td className="p-3 border-t border-purple-400 border-r">{dado.sn}</td>
                                        <td className="p-3 border-t border-purple-400 border-r">{dado.nome}</td>
                                        <td className="p-3 border-t border-purple-400 border-r">{dado.email}</td>
                                        <td className="p-3 border-t border-purple-400 border-r">{dado.area.nome}</td>
                                        <td className="p-3 border-t border-purple-400">{dado.gestor.nome}</td>
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
