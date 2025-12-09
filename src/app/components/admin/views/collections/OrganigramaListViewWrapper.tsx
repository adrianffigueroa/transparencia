'use client'
import dynamic from 'next/dynamic'
import React from 'react'

const OrganigramaListView = dynamic(
  () => import('@/app/components/admin/views/collections/OrganigramaListView'),
  {
    ssr: false,
  },
)

const OrganigramaListViewWrapper = (props: any) => {
  return <OrganigramaListView {...props} />
}

export default OrganigramaListViewWrapper
