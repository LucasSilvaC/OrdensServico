import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

const ModalManutentor = ({
    isOpen = false,
    onClose = () => { },
    manutentorSelecionado,
    criar,
    atualizar,
    areas = [],
    gestores = [],
}) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        id: "",
        sn: "",
        nome: "",
        email: "",
        area: "",
        gestor: "",
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (manutentorSelecionado) {
            setFormData({
                id: manutentorSelecionado.id || "",
                sn: manutentorSelecionado.sn || "",
                nome: manutentorSelecionado.nome || "",
                email: manutentorSelecionado.nome || "",
                area: manutentorSelecionado.area?.id || manutentorSelecionado.area || "",
                gestor: manutentorSelecionado.gestor?.id || manutentorSelecionado.gestor || "",
            });
        } else {
            setFormData({
                id: "",
                sn: "",
                nome: "",
                area: "",
                gestor: "",
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
            atualizar(formData);
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
            email: "",
            area: "",
            gestor: "",
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
                    {manutentorSelecionado ? "Editar Manutentor" : "Cadastrar Manutentor"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white">
                    <input
                        type="text"
                        name="sn"
                        placeholder="SN"
                        value={formData.sn}
                        onChange={handleChange}
                        className="border border-white p-2 rounded bg-transparent hover:border"
                        required
                    />

                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome do Manutentor"
                        value={formData.nome}
                        onChange={handleChange}
                        className="border border-white p-2 rounded bg-transparent hover:border"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border border-white p-2 rounded bg-transparent hover:border"
                        required
                    />

                    <select
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className="border border-white p-2 rounded bg-transparent hover:border text-white"
                        required
                    >
                        <option value="" disabled>Selecione a área</option>
                        {areas.map((area) => (
                            <option key={area.id} value={area.id} className="text-black bg-white">
                                {area.nome}
                            </option>
                        ))}
                    </select>

                    <select
                        name="gestor"
                        value={formData.gestor}
                        onChange={handleChange}
                        className="border border-white p-2 rounded bg-transparent hover:border text-white"
                        required
                    >
                        <option value="" disabled>Selecione o gestor</option>
                        {gestores.map((gestor) => (
                            <option key={gestor.id} value={gestor.id} className="text-black bg-white">
                                {gestor.nome}
                            </option>
                        ))}
                    </select>

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

export default ModalManutentor;