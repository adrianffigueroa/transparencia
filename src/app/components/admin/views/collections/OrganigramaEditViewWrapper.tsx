'use client'
import dynamic from 'next/dynamic'
import React from 'react'

const OrganigramaEditView = dynamic(
  () => import('@/app/components/admin/views/collections/OrganigramaEditView'),
  {
    ssr: false,
  },
)

const OrganigramaEditViewWrapper = (props: any) => {
  return <OrganigramaEditView {...props} />
}

export default OrganigramaEditViewWrapper
