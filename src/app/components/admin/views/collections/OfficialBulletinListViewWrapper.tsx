'use client'
import dynamic from 'next/dynamic'
import React from 'react'

const OfficialBulletinListView = dynamic(
  () => import('@/app/components/admin/views/collections/OfficialBulletinListView'),
  {
    ssr: false,
  },
)

const OfficialBulletinListViewWrapper = (props: any) => {
  return <OfficialBulletinListView {...props} />
}

export default OfficialBulletinListViewWrapper
