import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from 'axios';

const ModalOrdemServico = ({
    isOpen = false,
    onClose = () => { },
    ordemSelecionada,
    criar,
    atualizar,
    ambientes = [],
    patrimonios = [],
    manutentores = [],
    funcionarios = [],
}) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        id: "",
        descricao: "",
        abertura: "",
        fechamento: "",
        status: "",
        prioridade: "",
        patrimonio: "",
        ambiente: "",
        manutentor: "",
        funcionario: "",
        responsavel: "",
        sn: "",
    });

    useEffect(() => {
        if (ordemSelecionada) {
            setFormData({
                id: ordemSelecionada.id || "",
                descricao: ordemSelecionada.descricao || "",
                abertura: ordemSelecionada.abertura?.slice(0, 16) || "",
                fechamento: ordemSelecionada.fechamento?.slice(0, 16) || "",
                status: ordemSelecionada.status || "",
                prioridade: ordemSelecionada.prioridade || "",
                patrimonio: ordemSelecionada.patrimonio?.id || "",
                ambiente: ordemSelecionada.ambiente?.id || "",
                manutentor: ordemSelecionada.manutentor?.id || "",
                funcionario: ordemSelecionada.funcionario?.id || "",
                responsavel: ordemSelecionada.responsavel || "",
                sn: ordemSelecionada.sn || "",
            });
        } else {
            resetForm();
        }
    }, [ordemSelecionada]);

    const handleChange = (e) => {
        setOrdem({
            ...ordem,
            [e.target.name]: e.target.value, 
        });
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
            alert('Token de autenticação não encontrado');
            return;
        }

        if (!formData.ambiente || !formData.manutentor) {
            alert('Ambiente e Manutentor são obrigatórios');
            return;
        }

        if (Array.isArray(formData.sn)) {
            formData.sn = formData.sn[0];
        }

        if (!formData.sn) {
            alert('O campo SN é obrigatório');
            return;
        }

        console.log('Dados para enviar:', formData);

        try {
            const url = ordemSelecionada
                ? `http://127.0.0.1:8000/api/ordens/${formData.id}/`
                : 'http://127.0.0.1:8000/api/ordens/';

            const method = ordemSelecionada ? 'PUT' : 'POST';

            const dataToSend = ordemSelecionada ? formData : { ...formData, id: undefined };

            const response = await axios({
                method,
                url,
                data: dataToSend,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (ordemSelecionada) {
                if (atualizar) {
                    atualizar(response.data);
                }
            } else {
                if (criar) {
                    criar(response.data);
                }
            }

            handleClose();
        } catch (error) {
            console.error('Erro ao salvar ordem:', error.response || error);
            if (error.response && error.response.data) {
                console.log(error.response.data);
                alert(`Erro: ${error.response.data.detail || 'Falha ao salvar a ordem.'}`);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            id: "",
            descricao: "",
            abertura: "",
            fechamento: "",
            status: "",
            prioridade: "",
            patrimonio: "",
            ambiente: "",
            manutentor: "",
            funcionario: "",
            responsavel: "",
            sn: "",
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto py-10 px-4">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-3xl relative">
                <button
                    className="absolute top-5 right-5 text-gray-400 hover:text-purple-400 text-2xl"
                    onClick={handleClose}
                >
                    <FaTimes />
                </button>

                <h2 className="text-4xl font-bold mb-8 text-purple-400 text-center">
                    {ordemSelecionada ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 text-sm font-semibold">Descrição</label>
                            <input
                                type="text"
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-semibold">Responsável</label>
                            <input
                                type="text"
                                name="responsavel"
                                placeholder="Responsável"
                                value={formData.responsavel}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-semibold">Data de Abertura</label>
                            <input
                                type="datetime-local"
                                name="abertura"
                                value={formData.abertura}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-semibold">Data de Fechamento</label>
                            <input
                                type="datetime-local"
                                name="fechamento"
                                value={formData.fechamento}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-semibold">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500"
                                required
                            >
                                <option value="">Selecione o status</option>
                                <option value="INI">Iniciada</option>
                                <option value="AND">Em Andamento</option>
                                <option value="FIN">Finalizada</option>
                                <option value="CAN">Cancelada</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-semibold">Prioridade</label>
                            <select
                                name="prioridade"
                                value={formData.prioridade}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500"
                                required
                            >
                                <option value="">Selecione a prioridade</option>
                                <option value="A">Alta</option>
                                <option value="M">Média</option>
                                <option value="B">Baixa</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-semibold">Ambiente</label>
                            <select
                                value={ordem.ambiente || ''}
                                onChange={handleChange}
                                name="ambiente"
                            >
                                {ambientes.map((ambiente) => (
                                    <option key={ambiente.id} value={ambiente.id}>
                                        {ambiente.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-semibold">Patrimônio</label>
                            <select
                                name="patrimonio"
                                value={formData.patrimonio}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500"
                            >
                                <option value="">Selecione o patrimônio</option>
                                {patrimonios.map((pat) => (
                                    <option key={pat.id} value={pat.id} className="text-black">
                                        {pat.descricao}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-semibold">Manutentor</label>
                            <select
                                name="manutentor"
                                value={formData.manutentor}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500"
                                required
                            >
                                <option value="">Selecione o manutentor</option>
                                {manutentores.map((m) => (
                                    <option key={m.id} value={m.id} className="text-black">
                                        {m.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-semibold">Funcionário</label>
                            <input
                                type="text"
                                name="funcionario"
                                placeholder="Funcionário"
                                value={formData.funcionario}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-semibold">SN</label>
                            <input
                                type="text"
                                name="sn"
                                placeholder="SN"
                                value={formData.sn}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-purple-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-8">
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-lg text-white font-bold text-lg cursor-pointer"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalOrdemServico;