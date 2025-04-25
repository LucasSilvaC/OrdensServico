import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const ModalPatrimonios = ({
    isOpen = false,
    onClose = () => { },
    patrimonioSelecionado,
    criar,
    atualizar,
    ambientes = [],
}) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        id: "",
        ni: "",
        descricao: "",
        localizacao: "",
        media: null,
    });

    const [imagePreview, setImagePreview] = useState("../media/teste.png");

    useEffect(() => {
        if (patrimonioSelecionado) {
            setFormData({
                id: patrimonioSelecionado.id || "",
                ni: patrimonioSelecionado.ni || "",
                descricao: patrimonioSelecionado.descricao || "",
                localizacao: patrimonioSelecionado.localizacao?.id || "",
                media: null,
            });

            if (patrimonioSelecionado.media) {
                setImagePreview(`http://127.0.0.1:8000${patrimonioSelecionado.media}`);
            } else {
                setImagePreview("../media/teste.png");
            }
        } else {
            resetForm();
        }
    }, [patrimonioSelecionado]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            const file = files[0];
            if (file) {
                setFormData((prev) => ({
                    ...prev,
                    media: file,
                }));
                setImagePreview(URL.createObjectURL(file));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSend = { ...formData };
        if (patrimonioSelecionado) {
            atualizar({ ...patrimonioSelecionado, ...dataToSend });
        } else {
            criar(dataToSend);
        }
        handleClose();
    };

    const resetForm = () => {
        setFormData({
            id: "",
            ni: "",
            descricao: "",
            localizacao: "",
            media: null,
        });
        setImagePreview("../media/teste.png");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center overflow-y-auto pt-40">
            <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-2xl mx-4 relative h-150">
                <button
                    className="absolute top-4 right-4 text-white hover:text-red-400 text-xl"
                    onClick={handleClose}
                >
                    <FaTimes />
                </button>

                <h2 className="text-3xl font-bold mb-6 text-white text-center">
                    {patrimonioSelecionado ? "Editar Patrimônio" : "Cadastrar Patrimônio"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="ni"
                        placeholder="NI"
                        value={formData.ni}
                        onChange={handleChange}
                        className="px-4 py-2 rounded bg-gray-800 text-white border border-purple-500 focus:outline-none"
                        required
                    />

                    <input
                        type="text"
                        name="descricao"
                        placeholder="Descrição"
                        value={formData.descricao}
                        onChange={handleChange}
                        className="px-4 py-2 rounded bg-gray-800 text-white border border-purple-500 focus:outline-none"
                        required
                    />

                    <select
                        name="localizacao"
                        value={formData.localizacao}
                        onChange={handleChange}
                        className="px-4 py-2 rounded bg-gray-800 text-white border border-purple-500 focus:outline-none"
                        required
                    >
                        <option value="">Selecione o ambiente</option>
                        {ambientes.map((amb) => (
                            <option key={amb.id} value={amb.id} className="text-black">
                                {amb.descricao}
                            </option>
                        ))}
                    </select>

                    <input
                        type="file"
                        name="media"
                        onChange={handleChange}
                        className="text-white"
                    />

                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-800 transition text-white py-2 rounded text-xl font-semibold cursor-pointer"
                    >
                        Salvar
                    </button>
                </form>

                <div className="mt-6">
                    <h3 className="text-lg text-white mb-2 text-center">Pré-visualização:</h3>
                    <div className="flex justify-center">
                        <img
                            src={imagePreview}
                            alt="Imagem do Patrimônio"
                            className="w-40 h-40 object-cover border border-purple-400 rounded"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalPatrimonios;
