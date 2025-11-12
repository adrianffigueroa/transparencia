import React from 'react'
import { TiDocumentText } from 'react-icons/ti'

const CardLatest = () => {
  return (
    <div className="flex items-center gap-4 border-2 shadow-md border-white bg-gray-50 rounded-lg mb-5">
      <div className="flex">
        <TiDocumentText className="text-gray-500 text-3xl" />
      </div>
      <div className="flex flex-col">
        <h3 className="text-base font-semibold text-black">Boletín oficial municipal nº 205</h3>
        <span className="text-sm text-gray-500">24 de julio de 2025</span>
      </div>
    </div>
  )
}

export default CardLatest
