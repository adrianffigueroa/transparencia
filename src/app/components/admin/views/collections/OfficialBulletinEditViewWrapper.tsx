'use client'
import dynamic from 'next/dynamic'
import React from 'react'

const OfficialBulletinEditView = dynamic(
  () => import('@/app/components/admin/views/collections/OfficialBulletinEditView'),
  {
    ssr: false,
  },
)

const OfficialBulletinEditViewWrapper = (props: any) => {
  return <OfficialBulletinEditView {...props} />
}

export default OfficialBulletinEditViewWrapper
