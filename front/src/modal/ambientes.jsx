import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const ModalAmbiente = ({
    isOpen = false,
    onClose = () => { },
    ambienteSelecionado,
    criar,
    atualizar,
}) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        id: "",
        sig: "",
        descricao: "",
        ni: "",
        responsavel: "",
    });

    useEffect(() => {
        if (ambienteSelecionado) {
            setFormData({
                id: ambienteSelecionado.id || "",
                sig: ambienteSelecionado.sig || "",
                descricao: ambienteSelecionado.descricao || "",
                ni: ambienteSelecionado.ni || "",
                responsavel: ambienteSelecionado.responsavel || "",
            });
        } else {
            setFormData({
                id: "",
                sig: "",
                descricao: "",
                ni: "",
                responsavel: "",
            });
        }
    }, [ambienteSelecionado]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (ambienteSelecionado) {
            atualizar(formData);
        } else {
            criar(formData);
        }
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            id: "",
            sig: "",
            descricao: "",
            ni: "",
            responsavel: "",
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-start justify-center z-50 bg-black bg-opacity-50 pt-10">
            <div className="bg-zinc-900 p-6 rounded-xl shadow-xl w-[400px] text-center relative border border-white mt-60">
                <button className="absolute top-2 right-2 text-white cursor-pointer" onClick={handleClose}>
                    <FaTimes />
                </button>
                <h2 className="text-3xl font-bold mb-4 text-white">
                    {ambienteSelecionado ? "Editar Ambiente" : "Cadastrar Ambiente"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white">
                    <input
                        type="text"
                        name="sig"
                        placeholder="Sigla"
                        value={formData.sig}
                        onChange={handleChange}
                        className="border border-white p-2 rounded bg-transparent hover:border"
                        required
                    />
                    <input
                        type="text"
                        name="descricao"
                        placeholder="Descrição"
                        value={formData.descricao}
                        onChange={handleChange}
                        className="border border-white p-2 rounded bg-transparent hover:border"
                        required
                    />
                    <input
                        type="text"
                        name="ni"
                        placeholder="NI"
                        value={formData.ni}
                        onChange={handleChange}
                        className="border border-white p-2 rounded bg-transparent hover:border"
                        required
                    />
                    <input
                        type="text"
                        name="responsavel"
                        placeholder="Responsável"
                        value={formData.responsavel}
                        onChange={handleChange}
                        className="border border-white p-2 rounded bg-transparent hover:border"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded text-xl font-semibold transition-all cursor-pointer"
                    >
                        Salvar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModalAmbiente;