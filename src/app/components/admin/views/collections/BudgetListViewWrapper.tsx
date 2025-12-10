'use client'
import dynamic from 'next/dynamic'
import React from 'react'

const BudgetListView = dynamic(
  () => import('@/app/components/admin/views/collections/BudgetListView'),
  {
    ssr: false,
  },
)

const BudgetListViewWrapper = (props: any) => {
  return <BudgetListView {...props} />
}

export default BudgetListViewWrapper
