import React, { useState, useEffect } from "react";

export default function ModalOrdemServico({
    isOpen,
    onClose,
    ordemSelecionada,
    criar,
    atualizar,
    ambientes,
    responsaveis,
}) {
    const [dados, setDados] = useState({
        descricao: "",
        status: "INI",
        prioridade: "M",
        ambiente: "",
        manutentor: "",
        responsavel: "",
    });

    useEffect(() => {
        if (ordemSelecionada) {
            setDados({
                descricao: ordemSelecionada.descricao || "",
                status: ordemSelecionada.status || "INI",
                prioridade: ordemSelecionada.prioridade || "M",
                ambiente: ordemSelecionada.ambiente?.id || "",
                manutentor: ordemSelecionada.manutentor?.id || "",
                responsavel: ordemSelecionada.responsavel?.id || "",
            });
        } else {
            setDados({
                descricao: "",
                status: "INI",
                prioridade: "M",
                ambiente: "",
                manutentor: "",
                responsavel: "",
            });
        }
    }, [ordemSelecionada]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDados({ ...dados, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dadosFormatados = {
            ...dados,
            ambiente: parseInt(dados.ambiente),
            manutentor: parseInt(dados.manutentor),
            responsavel: dados.responsavel ? parseInt(dados.responsavel) : null,
        };

        if (ordemSelecionada) {
            atualizar({ ...dadosFormatados, id: ordemSelecionada.id });
        } else {
            criar(dadosFormatados);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white text-black p-6 rounded-lg w-[500px]">
                <h2 className="text-xl font-bold mb-4">
                    {ordemSelecionada ? "Editar Ordem" : "Nova Ordem"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="descricao"
                        placeholder="Descrição"
                        className="w-full p-2 border"
                        value={dados.descricao}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="status"
                        className="w-full p-2 border"
                        value={dados.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="INI">Iniciada</option>
                        <option value="AND">Em Andamento</option>
                        <option value="FIN">Finalizada</option>
                        <option value="CAN">Cancelada</option>
                    </select>

                    <select
                        name="prioridade"
                        className="w-full p-2 border"
                        value={dados.prioridade}
                        onChange={handleChange}
                        required
                    >
                        <option value="A">Alta</option>
                        <option value="M">Média</option>
                        <option value="B">Baixa</option>
                    </select>

                    <select
                        name="ambiente"
                        className="w-full p-2 border"
                        value={dados.ambiente}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione um ambiente</option>
                        {ambientes.map((amb) => (
                            <option key={amb.id} value={amb.id}>
                                {amb.nome}
                            </option>
                        ))}
                    </select>

                    <select
                        name="manutentor"
                        className="w-full p-2 border"
                        value={dados.manutentor}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione um manutentor</option>
                        {responsaveis.map((resp) => (
                            <option key={resp.id} value={resp.id}>
                                {resp.nome}
                            </option>
                        ))}
                    </select>

                    <select
                        name="responsavel"
                        className="w-full p-2 border"
                        value={dados.responsavel}
                        onChange={handleChange}
                    >
                        <option value="">Sem responsável</option>
                        {responsaveis.map((resp) => (
                            <option key={resp.id} value={resp.id}>
                                {resp.nome}
                            </option>
                        ))}
                    </select>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-purple-500 hover:bg-purple-700 text-amber-50 font-bold px-4 py-2 rounded cursor-pointer"
                        >
                            {ordemSelecionada ? "Atualizar" : "Criar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}