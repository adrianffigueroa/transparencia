// src/app/components/CustomDrawer.tsx

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/app/components/ui/drawer'
import { Button } from '@/app/components/ui/button'
import { RxHamburgerMenu } from 'react-icons/rx'
import { IoMdClose } from 'react-icons/io'
import Link from 'next/link' // 2. Importa Link para la navegación
import hamburguerButton from '@/public/assets/tabler_menu-4.svg'
import Image from 'next/image'

const CustomDrawer = () => (
  <Drawer direction="right">
    {/* Este es el botón de hamburguesa (LuMenu) */}
    <DrawerTrigger asChild>
      <Button variant="ghost" size="icon" className="bg-transparent border-none">
        <Image src={hamburguerButton} alt="Botón de hamburguesa" />
      </Button>
    </DrawerTrigger>

    {/* 3. Aplica las clases de desenfoque y transparencia aquí */}
    <DrawerContent className="w-3/4 h-full bg-white/20 backdrop-blur-md">
      <DrawerTitle></DrawerTitle>
      {/* 4. Posiciona el botón de cierre (X) */}
      <DrawerClose asChild className="absolute top-4 right-4 z-10">
        <Button variant="ghost" size="icon" className="bg-transparent border-none">
          <IoMdClose size={24} className="text-purple-600" />
        </Button>
      </DrawerClose>

      {/* 5. Contenido del Drawer (basado en tu imagen) */}
      <div className="p-6 pt-16">
        <div className="font-bold text-violet-300 text-lg mb-10">
          <Link className="no-underline" href="/">
            LOGO
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-6">
          <Link
            href="/intendente"
            className="text-lg font-medium text-gray-900 hover:text-purple-600"
          >
            Intendente
          </Link>
          <Link
            href="/municipio"
            className="text-lg font-medium text-gray-900 hover:text-purple-600"
          >
            Municipio
          </Link>
          <Link href="/boletin" className="text-lg font-medium text-gray-900 hover:text-purple-600">
            Boletín oficial Nº 205
          </Link>
          <Link
            href="/contacto"
            className="text-lg font-medium text-gray-900 hover:text-purple-600"
          >
            Contacto
          </Link>
        </nav>
      </div>

      {/* 6. Ya no necesitamos DrawerHeader o DrawerFooter para este diseño */}
    </DrawerContent>
  </Drawer>
)

export default CustomDrawer
