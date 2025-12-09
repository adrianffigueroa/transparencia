import React from 'react'
import { Badge } from '@/app/components/ui/badge'
import downloadIcon from '@/public/assets/mynaui_download.svg'
import Image from 'next/image'

const CardBoletin = () => {
  return (
    <section className="flex flex-col gap-2 border border-black rounded-md p-2 mb-2">
      <div className="flex flex-row items-center justify-between">
        <div className="text-black text-lg font-normal">Boletín oficial edición Nº277</div>
        <div className="text-black">27-07-05</div>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 text-black">
          <Badge variant="outline" className="border-blue-500">
            Decreto
          </Badge>
          <Badge variant="outline" className="border-blue-500">
            Ordenanza
          </Badge>
          <Badge variant="outline" className="border-blue-500">
            Resolución
          </Badge>
        </div>
        <div className="flex flex-row items-center gap-2">
          <button className="text-blue-500 bg-transparent border-none ">Ver</button>
          <a href="#" download>
            <Image src={downloadIcon} alt="Ícono de descarga" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default CardBoletin
