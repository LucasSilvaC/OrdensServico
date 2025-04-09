import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const ModalGestores = ({
    isOpen = false,
    onClose = () => {},
    gestorSelecionado,
    criar,
    atualizar,
}) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        id: "",
        ni: "",
        nome: "",
        area: "",
        cargo: "",
    });

    useEffect(() => {
        if (gestorSelecionado) {
            setFormData({
                id: gestorSelecionado.id || "",
                ni: gestorSelecionado.ni || "",
                nome: gestorSelecionado.nome || "",
                area: gestorSelecionado.area || "",
                cargo: gestorSelecionado.cargo || "",
            });
        } else {
            setFormData({
                id: "",
                ni: "",
                nome: "",
                area: "",
                cargo: "",
            });
        }
    }, [gestorSelecionado]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (gestorSelecionado) {
            atualizar({ ...gestorSelecionado, ...formData });
        } else {
            criar(formData);
        }
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            id: "",
            ni: "",
            nome: "",
            area: "",
            cargo: "",
        });
        onClose();
    };

    const opcoesCargo = [
        "Diretor",
        "Coordenador Pedagógico",
        "Coordenador Técnico",
        "Orientador de práticas profissionais",
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#242424] bg-opacity-80 z-50">
            <div className="bg-zinc-900 p-6 rounded-xl shadow-xl w-[400px] text-center relative border border-amber-100">
                <button className="absolute top-2 right-2 text-amber-50 cursor-pointer" onClick={handleClose}>
                    <FaTimes />
                </button>
                <h2 className="text-3xl font-bold mb-4 text-amber-50">
                    {gestorSelecionado ? "Editar Gestor" : "Cadastrar Gestor"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-amber-50">
                    <input
                        type="text"
                        name="ni"
                        placeholder="NI"
                        value={formData.ni}
                        onChange={handleChange}
                        className="border border-amber-100 p-2 rounded bg-transparent"
                        required
                    />

                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome do Gestor"
                        value={formData.nome}
                        onChange={handleChange}
                        className="border border-amber-100 p-2 rounded bg-transparent"
                        required
                    />

                    <input
                        type="text"
                        name="area"
                        placeholder="Área"
                        value={formData.area}
                        onChange={handleChange}
                        className="border border-amber-100 p-2 rounded bg-transparent"
                        required
                    />

                    <select
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleChange}
                        className="border border-amber-100 p-2 rounded bg-transparent"
                        required
                    >
                        <option value="" className="text-[#242424]">Selecione o cargo</option>
                        {opcoesCargo.map((cargo) => (
                            <option key={cargo} value={cargo} className="text-[#242424]">
                                {cargo}
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

export default ModalGestores;
