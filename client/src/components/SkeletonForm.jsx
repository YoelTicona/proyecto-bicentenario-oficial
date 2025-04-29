import React from 'react'

export default function SkeletonFormularioEvento() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>

      {/* Imagen */}
      <div className="w-full h-48 bg-gray-200 rounded mb-6"></div>

      {/* Título y Fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>

      {/* Hora */}
      <div className="h-10 bg-gray-200 rounded mb-6 w-1/3"></div>

      {/* Descripción */}
      <div className="h-24 bg-gray-200 rounded mb-6"></div>

      {/* Modalidad y Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>

      {/* Costo y Dirección */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>

      {/* Mapa */}
      <div className="h-60 bg-gray-200 rounded mb-6"></div>

      {/* Categoría */}
      <div className="h-10 bg-gray-200 rounded mb-6 w-1/2"></div>

      {/* Tags, Patrocinadores, Expositores */}
      <div className="h-10 bg-gray-200 rounded mb-4 w-3/4"></div>
      <div className="h-10 bg-gray-200 rounded mb-4 w-3/4"></div>
      <div className="h-10 bg-gray-200 rounded mb-4 w-3/4"></div>

      {/* Botón */}
      <div className="h-10 bg-gray-300 rounded w-1/3 mx-auto"></div>
    </div>
  )
}
