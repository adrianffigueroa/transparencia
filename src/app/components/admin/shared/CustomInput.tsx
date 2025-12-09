import React from 'react'
import { cn } from '@/lib/utils'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

interface CustomInputProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder?: string
  type?: 'text' | 'textarea'
  className?: string
  inputClassName?: string
  disabled?: boolean
  required?: boolean
}

const CustomInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
  inputClassName,
  disabled = false,
  required = false,
}: CustomInputProps) => {
  const baseInputClasses = cn(
    'border border-gray-200 rounded-lg px-4 pt-6 pb-2',
    'focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500',
    'placeholder:text-gray-300',
    'shadow-md',
    inputClassName,
  )

  const labelClasses = 'absolute left-4 top-2 text-xs text-gray-400 font-normal pointer-events-none'

  return (
    <div className={cn('relative flex flex-col', className)}>
      <label className={labelClasses}>{label}</label>
      {type === 'textarea' ? (
        <Textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(baseInputClasses, 'min-h-[120px] resize-none pt-8')}
        />
      ) : (
        <Input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(baseInputClasses, 'text-base h-auto')}
        />
      )}
    </div>
  )
}

export default CustomInput
