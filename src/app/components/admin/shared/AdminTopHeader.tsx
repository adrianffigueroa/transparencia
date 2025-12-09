import React from 'react'

const AdminTopHeader = () => {
  return (
    // Usamos 'pl-0' o un padding que coincida con tu contenido
    // Quitamos bordes y fondos para que parezca texto en la página
    <div className="flex flex-col items-start bg-white mt-4">
      <h2 className="text-2xl font-bold text-blue-500">Portal de Transparencia</h2>

      {/* Opcional: Un separador o badge */}
      <p className="  rounded text-lg text-black font-semibold ">Panel Administrador</p>
    </div>
  )
}

export default AdminTopHeader
