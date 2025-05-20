import React from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function Modal({ isOpen, onClose, evento }) {
    if (!isOpen || !evento) return null;

    const handleBackdropClick = (e) => {
        if (e.target.id === "modal-backdrop") onClose();
    };

    return (
        <div
            id="modal-backdrop"
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
            onClick={handleBackdropClick}
        >
            <div className="bg-[#fffef8] rounded-lg shadow-lg relative max-w-3xl w-full mx-4 my-6 max-h-[90vh] overflow-y-auto border border-yellow-700">
                {/* Botón cerrar */}
                <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
                    onClick={onClose}
                >
                    <X size={24} />
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-bold text-center mb-4 text-yellow-900">
                        {evento.titulo}
                    </h2>

                    <p className="text-gray-800 text-sm mb-4 text-justify">
                        {evento.descripcion}
                    </p>
                    {evento.video && (
                        <section className="flex justify-center animate-fade-in relative">
                            <Link
                            href={evento.video}
                            target="_blank"
                            rel="noopener noreferrer"   
                            className="relative w-full max-w-xl"
                            >
                            <img
                                src={evento.imagen}
                                alt="Video del Bicentenario"
                                className="w-full h-auto rounded-xl shadow-lg hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black bg-opacity-50 rounded-full p-4">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4.5 3.5l11 6.5-11 6.5v-13z" />
                                </svg>
                                </div>
                            </div>
                            </Link>
                        </section>
                      
                    )}

                    <section className="flex justify-center animate-fade-in py-2">
                        {evento.fuente && (
                            <p className="text-sm text-center text-blue-600 underline">
                                <Link href={evento.fuente} target="_blank" rel="noopener noreferrer">
                                    Ver fuente
                                </Link>
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
