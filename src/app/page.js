"use client";

import { useEffect, useState } from "react";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import api from "@/utils/api";

export default function BlocoNotas() {
  const [notas, setNotas] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [edit, setEdit] = useState(null);

  const fetchNotas = async () => {
    const result = await api.get("/notas");
    setNotas(result.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (edit) {
        await api.put(`/notas/${edit}`, formData);
      } else {
        await api.post('/notas', formData);
      }
      setFormData({ title: "", description: "", deadline: "" });
      setEdit(null);
      fetchNotas();
    } catch (error) {
      console.error("Erro ao salvar nota", error);
    }
  };

  const handleInputChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (nota) => {
    setFormData({
      title: nota.title,
      description: nota.description,
      deadline: nota.deadline,
    });
    setEdit(nota.id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`notas/${id}`);
      fetchNotas();
    } catch (error) {
      console.error("Erro ao apagar nota", error);
    }
  };

  useEffect(() => {
    fetchNotas();
  }, []);

  return (
    <>
      <div className="w-full h-full bg-paper overflow-y-scroll flex flex-col items-center p-4.5">
        <form className="flex flex-col w-80 h-auto" onSubmit={handleSubmit}>
          <input
            className="w-full h-12 bg-white rounded-md p-3 mb-3 border border-gray-700"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Título da nota:"
            required
          />
          <input
            className="w-full h-12 bg-white rounded-md p-3 mb-3 border border-gray-700"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descrição da nota:"
            required
          />
          <input
            className="w-full h-12 bg-white rounded-md p-3 mb-3 border border-gray-700"
            type="text"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            placeholder="Prazo da nota:"
          />
          <button
            type="submit"
            className="w-full h-12 bg-indigo-700 rounded-xl text-white mb-20 hover:cursor-pointer active:bg-indigo-900"
          >
            {edit ? "Atualizar" : "Adicionar"}
          </button>
        </form>

        <div>
          {notas.map((nota) => {
            return (
              <div
                key={nota.id}
                className="w-80 h-auto bg-white rounded-lg p-5 border border-black mb-4"
              >
                <div className="flex w-full h-auto mb-2 font-semibold justify-between align-center">
                  <div>{nota.title}</div>
                  <div className="flex gap-0.5">
                    <button className="hover:cursor-pointer" onClick={() => handleEdit(nota)}>
                      <PencilSquareIcon width={25} stroke="#432DD7" />
                    </button>
                    <button className="hover:cursor-pointer" onClick={() => handleDelete(nota.id)}>
                      <XMarkIcon width={25} stroke="#FF0000" />
                    </button>
                  </div>
                </div>
                <div className="w-full min-h-14">{nota.description}</div>
                <div className="w-full h-auto ">Prazo: {nota.deadline}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
