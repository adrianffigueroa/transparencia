import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'

const EditTable = () => {
  return (
    <div className="p-10 bg-white rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="shadow-lg border-2 border-red-500">
            <TableCell className="font-medium">1</TableCell>
            <TableCell>John</TableCell>
            <TableCell>Doe</TableCell>
            <TableCell>Q4V8a@example.com</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default EditTable
