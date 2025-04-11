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
                localizacao: patrimonioSelecionado.localizacao || "",
                media: null, // só atualiza com nova imagem
            });

            if (patrimonioSelecionado.media) {
                setImagePreview(`http://127.0.0.1:8000${patrimonioSelecionado.media}`);
            } else {
                setImagePreview("../media/teste.png");
            }
        } else {
            setFormData({
                id: "",
                ni: "",
                descricao: "",
                localizacao: "",
                media: null,
            });
            setImagePreview("../media/teste.png");
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

                const objectUrl = URL.createObjectURL(file);
                setImagePreview(objectUrl);
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

    const handleClose = () => {
        setFormData({
            id: "",
            ni: "",
            descricao: "",
            localizacao: "",
            media: null,
        });
        setImagePreview("../media/teste.png");
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#242424]">
            <div className="bg-transparent p-4 rounded-lg shadow-lg w-120 text-center relative">
                <button className="absolute top-2 right-2 text-amber-50 cursor-pointer" onClick={handleClose}>
                    <FaTimes />
                </button>
                <h2 className="text-4xl font-bold mb-4 text-amber-50">
                    {patrimonioSelecionado ? "Editar Patrimônio" : "Cadastrar Patrimônio"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2 text-amber-50">
                    <input
                        type="text"
                        name="ni"
                        placeholder="NI"
                        value={formData.ni}
                        onChange={handleChange}
                        className="border p-2 rounded text-amber-50"
                        required
                    />

                    <input
                        type="text"
                        name="descricao"
                        placeholder="Descrição"
                        value={formData.descricao}
                        onChange={handleChange}
                        className="border p-2 rounded text-amber-50"
                        required
                    />

                    <select
                        name="localizacao"
                        value={formData.localizacao}
                        onChange={handleChange}
                        className="border p-2 rounded border-amber-50"
                        required
                    >
                        <option value="" className="text-[#242424]">Selecione o ambiente</option>
                        {ambientes.map((amb) => (
                            <option key={amb.id} value={amb.id} className="text-[#242424]">
                                {amb.nome}
                            </option>
                        ))}
                    </select>

                    <input
                        type="file"
                        name="media"
                        onChange={handleChange}
                        className="border p-2 rounded text-amber-50"
                    />

                    <button type="submit" className="bg-purple-500 text-amber-50 p-2 rounded hover:bg-purple-700 cursor-pointer text-2xl">
                        Salvar
                    </button>
                </form>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-amber-50">Pré-visualização:</h3>
                    <div className="flex justify-center mt-2">
                        <img src={imagePreview} alt="Foto do Patrimônio" className="w-70 h-70 object-cover border rounded text-amber-50" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalPatrimonios;