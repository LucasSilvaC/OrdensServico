import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalOrdemServico from "../modal/ordemservico";
import { FaPlus } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

export default function OrdemServico() {
    const name = "Ordem Serviço";
    const [ordens, setOrdens] = useState([]);
    const [formVisivel, setFormVisivel] = useState(false);
    const [ordemSelecionada, setOrdemSelecionada] = useState(null);
    const [responsaveis, setResponsaveis] = useState([]);
    const [ambientes, setAmbientes] = useState([]);
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

        const carregarDados = async () => {
            try {
                const [ordensRes, responsaveisRes, ambientesRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/ordens", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://127.0.0.1:8000/api/responsaveis", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://127.0.0.1:8000/api/ambientes", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setOrdens(ordensRes.data);
                setResponsaveis(responsaveisRes.data);
                setAmbientes(ambientesRes.data);
            } catch (erro) {
                console.error("Erro ao carregar dados:", erro.response?.data || erro.message);
            }
        };

        carregarDados();
    }, [token, refresh]);

    const criar = async (novaOrdem) => {
        try {
            await axios.post("http://127.0.0.1:8000/api/ordens", novaOrdem, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRefresh(!refresh);
        } catch (erro) {
            console.error("Erro ao criar ordem:", erro.response?.data || erro.message);
        }
    };

    const atualizar = async (ordemAtualizada) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/ordens/${ordemAtualizada.id}`, ordemAtualizada, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRefresh(!refresh);
        } catch (erro) {
            console.error("Erro ao atualizar ordem:", erro.response?.data || erro.message);
        }
    };

    return (
        <>
            <Header name={name} />
            <div className="container mx-auto p-4 text-center text-amber-50 mt-20">
                <h2 className="text-5xl font-bold mb-8 uppercase">Chamados</h2>

                <div className="flex items-center justify-center gap-3 text-4xl text-amber-50 mb-8">
                    <FaPlus
                        className="cursor-pointer hover:text-[#aaaaaa]"
                        onClick={() => {
                            setFormVisivel(true);
                            setOrdemSelecionada(null);
                        }}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full mt-4 border-collapse border border-amber-50 text-amber-50">
                        <thead>
                            <tr className="bg-zinc-800">
                                <th className="p-2 border-b border-amber-100">ID</th>
                                <th className="p-2 border-b border-amber-100">Descrição</th>
                                <th className="p-2 border-b border-amber-100">Status</th>
                                <th className="p-2 border-b border-amber-100">Prioridade</th>
                                <th className="p-2 border-b border-amber-100">Responsável</th>
                                <th className="p-2 border-b border-amber-100">Ambiente</th>
                                <th className="p-2 border-b border-amber-100">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordens.map((ordem) => (
                                <tr key={ordem.id} className="border-b border-zinc-700 hover:bg-zinc-800">
                                    <td className="p-2">{ordem.id}</td>
                                    <td className="p-2">{ordem.descricao}</td>
                                    <td className="p-2">{ordem.status}</td>
                                    <td className="p-2">{ordem.prioridade}</td>
                                    <td className="p-2">{ordem.responsavel?.nome || "—"}</td>
                                    <td className="p-2">{ordem.ambiente?.nome || "—"}</td>
                                    <td className="p-2">
                                        <button
                                            className="hover:text-blue-400"
                                            onClick={() => {
                                                setOrdemSelecionada(ordem);
                                                setFormVisivel(true);
                                            }}
                                        >
                                            <MdCreate size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <ModalOrdemServico
                    isOpen={formVisivel}
                    onClose={() => setFormVisivel(false)}
                    ordemSelecionada={ordemSelecionada}
                    criar={criar}
                    atualizar={atualizar}
                    responsaveis={responsaveis}
                    ambientes={ambientes}
                />
            </div>
        </>
    );
}
