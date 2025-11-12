'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { FaChevronLeft } from 'react-icons/fa'

const BackButton = () => {
  const router = useRouter()
  return (
    <div className="mb-2">
      <button className="border-0 bg-white" onClick={() => router.back()}>
        <div className="flex items-center gap-2 bg-transparent">
          <FaChevronLeft className="text-gray-500 w-4 h-4" />
          <span className="bg-transparenttext-sm text-gray-500">Volver</span>
        </div>
      </button>
    </div>
  )
}

export default BackButton
