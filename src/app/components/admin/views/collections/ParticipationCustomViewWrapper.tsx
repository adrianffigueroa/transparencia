'use client'
import dynamic from 'next/dynamic'

const ParticipationCustomView = dynamic(
  () => import('@/app/components/admin/views/collections/ParticipationListView'),
  {
    ssr: false,
  },
)

export default ParticipationCustomView
