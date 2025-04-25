import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import ModalOrdemServico from "../modal/ordemservico";
import { FaTrash, FaPlus } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import axios from "axios";

export default function Ordens() {
    const name = "Ordens de Serviço";
    const [dados, setDados] = useState([]);
    const [filtroSn, setFiltroSn] = useState("");
    const [filtroResponsavel, setFiltroResponsavel] = useState("");
    const [formVisivel, setFormVisivel] = useState(false);
    const [ordemSelecionada, setOrdemSelecionada] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [tabelaVisivel, setTabelaVisivel] = useState(true);
    const [manutentores, setManutentores] = useState([]);
    const [ambientes, setAmbientes] = useState([]);
    const [patrimonios, setPatrimonios] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    useEffect(() => {
        if (!user) navigate("/error");
    }, [user, navigate]);

    useEffect(() => {
        if (!token) return;
        const fetchData = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/ordens/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDados(res.data);
            } catch (error) {
                console.error("Erro ao buscar ordens:", error.response?.data || error.message);
            }
        };
        fetchData();
    }, [token, refresh]);

    const fetchRelacionados = async () => {
        try {
            const [resM, resA, resP, resU] = await Promise.all([
                axios.get("http://127.0.0.1:8000/api/manutentores/", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("http://127.0.0.1:8000/api/ambientes/", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("http://127.0.0.1:8000/api/patrimonios/", { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            setManutentores(resM.data);
            setAmbientes(resA.data);
            setPatrimonios(resP.data);
        } catch (error) {
            console.error("Erro ao buscar dados relacionados:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        if (token) fetchRelacionados();
    }, [token]);

    const apagar = async (id) => {
        if (window.confirm("Deseja apagar esta ordem de serviço?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/ordem/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRefresh(!refresh);
            } catch (error) {
                console.error("Erro ao apagar ordem:", error.response?.data || error.message);
            }
        }
    };

    const criar = async (ordem) => {
        try {
            if (!ordem || !ordem.sn || !ordem.sn[0] || !ordem.descricao) {
                return;
            }

            const ordemExistente = dados.find(dado => dado.sn === ordem.sn[0]);
            if (ordemExistente) {
                alert("Já existe uma ordem com este SN.");
                return;
            }

            const dadosOrdem = {
                ...ordem,
                sn: ordem.sn[0],
            };

            await axios.post("http://127.0.0.1:8000/api/ordens/", dadosOrdem, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setRefresh(!refresh);
        } catch (error) {
            console.error("Erro ao criar ordem:", error.response?.data || error.message);
        }
    };

    const atualizar = async (ordem) => {
        try {
            if (!ordem || !ordem.id) return;

            const res = await axios.put(`http://127.0.0.1:8000/api/ordem/${ordem.id}/`, ordem, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setRefresh(!refresh);
        } catch (error) {
            console.error("Erro ao atualizar ordem:", error.response?.data || error.message);
        }
    };

    const filtrarDados = () => {
        return dados.filter((dado) =>
            (filtroSn ? dado.sn?.includes(filtroSn) : true) &&
            (filtroResponsavel ? dado.responsavel?.toLowerCase().includes(filtroResponsavel.toLowerCase()) : true)
        );
    };

    return (
        <>
            <Header name={name} />
            <div className="container mx-auto p-6 mt-20 text-center text-white">
                <h2 className="text-5xl font-bold mb-8 drop-shadow">Ordens de Serviço</h2>

                <div className="flex items-center justify-center mb-6 gap-6">
                    <FaPlus
                        className="text-white hover:text-purple-400 text-4xl cursor-pointer transition drop-shadow-sm"
                        onClick={() => {
                            setFormVisivel(true);
                            setOrdemSelecionada(null);
                        }}
                    />
                </div>

                <ModalOrdemServico
                    isOpen={formVisivel}
                    onClose={() => setFormVisivel(false)}
                    ordemSelecionada={ordemSelecionada}
                    criar={criar}
                    atualizar={atualizar}
                    manutentores={manutentores}
                    ambientes={ambientes}
                    patrimonios={patrimonios}
                    usuarios={usuarios}
                />

                <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por SN..."
                        value={filtroSn}
                        onChange={(e) => setFiltroSn(e.target.value)}
                        className="px-4 py-2 rounded bg-gray-800 text-white border border-purple-500 focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                        type="text"
                        placeholder="Buscar por Responsável..."
                        value={filtroResponsavel}
                        onChange={(e) => setFiltroResponsavel(e.target.value)}
                        className="px-4 py-2 rounded bg-gray-800 text-white border border-purple-500 focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                <button
                    disabled={isLoading}
                    onClick={() => setFormVisivel(true)}
                >
                </button>

                {tabelaVisivel && (
                    <div className="overflow-x-auto border border-purple-400 rounded-xl">
                        <table className="w-full text-white bg-gray-800">
                            <thead>
                                <tr className="bg-gray-800 text-purple-100 border-b border-purple-400 text-sm md:text-base">
                                    <th className="p-4 border-r border-purple-400">Ações</th>
                                    <th className="p-4 border-r border-purple-400">SN</th>
                                    <th className="p-4 border-r border-purple-400">Descrição</th>
                                    <th className="p-4 border-r border-purple-400">Status</th>
                                    <th className="p-4 border-r border-purple-400">Prioridade</th>
                                    <th className="p-4 border-r border-purple-400">Responsável</th>
                                    <th className="p-4 border-r border-purple-400">Abertura</th>
                                    <th className="p-4 border-r border-purple-400">Fechamento</th>
                                    <th className="p-4 border-r border-purple-400">Ambiente</th>
                                    <th className="p-4 border-r border-purple-400">Manutentor</th>
                                    <th className="p-4">Funcionário</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrarDados().map((ordem) => (
                                    <tr key={ordem.id} className="hover:bg-gray-900 transition text-xs md:text-sm">
                                        <td className="p-3 flex justify-center gap-4 border-t border-purple-400 border-r">
                                            <FaTrash
                                                className="text-white hover:text-purple-400 cursor-pointer text-lg"
                                                onClick={() => apagar(ordem.id)}
                                            />
                                            <MdCreate
                                                className="text-white hover:text-purple-400 cursor-pointer text-lg"
                                                onClick={() => {
                                                    setFormVisivel(true);
                                                    setOrdemSelecionada(ordem);
                                                }}
                                            />
                                        </td>
                                        <td className="p-3 border-t border-purple-400 border-r">{ordem.sn}</td>
                                        <td className="p-3 border-t border-purple-400 border-r">{ordem.descricao}</td>
                                        <td className="p-3 border-t border-purple-400 border-r">{ordem.status}</td>
                                        <td className="p-3 border-t border-purple-400 border-r">{ordem.prioridade}</td>
                                        <td className="p-3 border-t border-purple-400 border-r">{ordem.responsavel}</td>
                                        <td className="p-3 border-t border-purple-400 border-r">
                                            {ordem.abertura ? new Date(ordem.abertura).toLocaleString() : "-"}
                                        </td>
                                        <td className="p-3 border-t border-purple-400 border-r">
                                            {ordem.fechamento ? new Date(ordem.fechamento).toLocaleString() : "-"}
                                        </td>
                                        <td className="p-3 border-t border-purple-400 border-r">
                                            {ordem.ambiente ? ordem.ambiente.nome : "-"}
                                        </td>
                                        <td className="p-3 border-t border-purple-400 border-r">
                                            {ordem.manutentor ? ordem.manutentor.nome : "-"}
                                        </td>
                                        <td className="p-3 border-t border-purple-400">
                                            {ordem.funcionario ? ordem.funcionario.nome : "-"}
                                        </td>
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