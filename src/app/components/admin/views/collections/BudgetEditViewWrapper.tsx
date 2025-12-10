'use client'
import dynamic from 'next/dynamic'
import React from 'react'

const BudgetEditView = dynamic(
  () => import('@/app/components/admin/views/collections/BudgetEditView'),
  {
    ssr: false,
  },
)

const BudgetEditViewWrapper = (props: any) => {
  return <BudgetEditView {...props} />
}

export default BudgetEditViewWrapper
