import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const ModalArea = ({
    isOpen = false,
    onClose = () => {},
    areaSelecionada,
    criar,
    atualizar,
}) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        id: "",
        nome: "",
    });

    useEffect(() => {
        if (areaSelecionada) {
            setFormData({
                id: areaSelecionada.id || "",
                nome: areaSelecionada.nome || "",
            });
        } else {
            setFormData({
                id: "",
                nome: "",
            });
        }
    }, [areaSelecionada]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (areaSelecionada) {
            atualizar({ ...areaSelecionada, ...formData });
        } else {
            criar(formData);
        }
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            id: "",
            nome: "",
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#242424] bg-opacity-80 z-50">
            <div className="bg-zinc-900 p-6 rounded-xl shadow-xl w-[400px] text-center relative border border-white">
                <button className="absolute top-2 right-2 text-white cursor-pointer" onClick={handleClose}>
                    <FaTimes />
                </button>
                <h2 className="text-3xl font-bold mb-4 text-white">
                    {areaSelecionada ? "Editar Área" : "Cadastrar Área"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white">
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome da Área"
                        value={formData.nome}
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

export default ModalArea;