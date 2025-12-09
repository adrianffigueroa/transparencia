import React, { useEffect } from 'react'
import EditTable from '../../shared/EditTable'
import { ar } from 'vitest/dist/chunks/reporters.d.DL9pg5DB.js'

interface Props {
  header: string[]
  data: string
}

const OfficialBulletinListView = () => {
  useEffect(() => {
    console.log('OfficialBulletinListView mounted')
    const fetchData = async () => {
      try {
        const res = await fetch('/api/official_bulletin')
        const json = await res.json()
        console.log('Fetched data:', json)
        console.log('Doc:', json.docs)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])
  return <EditTable />
}

export default OfficialBulletinListView
