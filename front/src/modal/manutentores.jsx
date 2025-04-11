import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const ModalManutentor = ({
    isOpen = false,
    onClose = () => { },
    manutentorSelecionado,
    criar,
    atualizar,
}) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        id: "",
        sn: "",
        nome: "",
        area: "",
    });

    useEffect(() => {
        if (manutentorSelecionado) {
            setFormData({
                id: manutentorSelecionado.id || "",
                sn: manutentorSelecionado.sn || "",
                nome: manutentorSelecionado.nome || "",
                area: manutentorSelecionado.area || "",
            });
        } else {
            setFormData({
                id: "",
                sn: "",
                nome: "",
                area: "",
            });
        }
    }, [manutentorSelecionado]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (manutentorSelecionado) {
            atualizar({ ...manutentorSelecionado, ...formData });
        } else {
            criar(formData);
        }
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            id: "",
            sn: "",
            nome: "",
            area: "",
        });
        onClose();
    };

    const opcoesArea = [
        "Elétrica",
        "Mecânica",
        "Civil",
        "Tecnologia da Informação",
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#242424] bg-opacity-80 z-50">
            <div className="bg-zinc-900 p-6 rounded-xl shadow-xl w-[400px] text-center relative border border-amber-100">
                <button className="absolute top-2 right-2 text-amber-50 cursor-pointer" onClick={handleClose}>
                    <FaTimes />
                </button>
                <h2 className="text-3xl font-bold mb-4 text-amber-50">
                    {manutentorSelecionado ? "Editar Manutentor" : "Cadastrar Manutentor"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-amber-50">
                    <input
                        type="text"
                        name="sn"
                        placeholder="SN"
                        value={formData.sn}
                        onChange={handleChange}
                        className="border border-amber-100 p-2 rounded bg-transparent hover:border"
                        required
                    />

                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome do Manutentor"
                        value={formData.nome}
                        onChange={handleChange}
                        className="border border-amber-100 p-2 rounded bg-transparent hover:border"
                        required
                    />

                    <select
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className="border border-amber-50 bg-transparent cursor-pointer text-amber-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        required
                    >
                        <option value="" disabled className="text-gray-400 bg-amber-50">
                            Selecione a área
                        </option>
                        {opcoesArea.map((area) => (
                            <option key={area} value={area} className="text-black bg-amber-50 cursor-pointer">
                                {area}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-amber-50 p-2 rounded text-xl font-semibold transition-all cursor-pointer"
                    >
                        Salvar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModalManutentor;