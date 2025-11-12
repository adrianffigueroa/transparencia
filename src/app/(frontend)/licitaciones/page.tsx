'use client'

import React from 'react'
import { SearchInput } from '@/app/components/SearchInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import CardLatestLicitaciones from '@/app/components/ui/CardLatestLicitaciones'
const handleSearch = (query: string) => {
  console.log('Buscando:', query)
}

const page = () => {
  return (
    <section className="grid grid-cols-1 px-10">
      <section className="mb-4">
        <h2 className="text-gradient-hero text-2xl font-semibold ">Licitaciones</h2>
        <p className="text-gray-500 text-lg font-normal ">
          Utiliza este buscador para localizar fácilmente los conjuntos de datos que necesites.
        </p>
        <div className="flex items-center justify-center gap-1 w-full mt-2">
          <SearchInput onSearch={handleSearch} className="rounded-tr-none" />
          <Select>
            <SelectTrigger className="flex text-gray-500 rounded-l-none rounded-r-md">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="2023" className="text-gray-500">
                2023
              </SelectItem>
              <SelectItem value="2024" className="text-gray-500">
                2024
              </SelectItem>
              <SelectItem value="2025" className="text-gray-500">
                2025
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>
      <section>
        <p className="text-gray-500 font-normal text-sm">Últimas publicaciones</p>
        <CardLatestLicitaciones />
        <CardLatestLicitaciones />
        <CardLatestLicitaciones />
      </section>
    </section>
  )
}

export default page
