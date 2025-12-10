import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import Image from 'next/image'
import editIcon from '@/public/assets/editIcon.png'
import deleteIcon from '@/public/assets/deleteIcon.png'

type Column = {
  key: string
  label: string
  width?: string
}

type Props = {
  columns: Column[]
  data: Record<string, any>[]
  onEdit?: (row: Record<string, any>) => void
  onDelete?: (row: Record<string, any>) => void
  renderActions?: (row: Record<string, any>) => React.ReactNode
}

const EditTable: React.FC<Props> = ({ columns, data, onEdit, onDelete, renderActions }) => {
  return (
    <div className="p-10 bg-white rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.width}>
                {column.label}
              </TableHead>
            ))}
            {(onEdit || onDelete || renderActions) && <TableHead>Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center text-gray-500 py-8">
                No hay datos para mostrar
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={row.id || index} className="shadow-sm border-b hover:bg-gray-50">
                {columns.map((column) => (
                  <TableCell key={column.key} className="font-medium">
                    {row[column.key] ?? '-'}
                  </TableCell>
                ))}
                {(onEdit || onDelete || renderActions) && (
                  <TableCell>
                    {renderActions ? (
                      renderActions(row)
                    ) : (
                      <div className="flex gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="bg-transparent border-none hover:cursor-pointer font-medium text-sm"
                          >
                            <Image src={editIcon} alt="Editar" width={20} height={20} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="bg-transparent border-none hover:cursor-pointer font-medium text-sm"
                          >
                            <Image src={deleteIcon} alt="Eliminar" width={20} height={20} />
                          </button>
                        )}
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default EditTable
