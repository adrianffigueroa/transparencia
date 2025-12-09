'use client'

import { AdvancedSearch } from '@/app/components/front/AdvancedSearch'
import CardBoletin from '@/app/components/front/CardBoletin'
import { SearchInput } from '@/app/components/SearchInput'
import React from 'react'

const page = () => {
  const handleSearch = (query: string) => {
    console.log('Buscando:', query)
  }
  const handleAdvancedSearch = (filters: any) => {
    console.log('Búsqueda avanzada:', filters)
    // Lógica de búsqueda con filtros (dateFrom, dateTo, filterBy)
  }

  return (
    <section className="grid grid-cols-1 px-10">
      <section>
        <h2 className="text-gradient-hero text-2xl font-semibold ">Boletín oficial</h2>
        <p className="text-gray-500 text-lg font-normal">
          Accedé a todas las publicaciones oficiales del municipio, con actualizaciones permanentes
          y de acceso libre.
        </p>
      </section>
      <section>
        <SearchInput onSearch={handleSearch} />
        <AdvancedSearch onSearch={handleAdvancedSearch} className="" />
        <p className="text-gray-500 font-normal text-sm">Últimas publicaciones</p>
        <CardBoletin />
        <CardBoletin />
        <CardBoletin />
      </section>
    </section>
  )
}

export default page
