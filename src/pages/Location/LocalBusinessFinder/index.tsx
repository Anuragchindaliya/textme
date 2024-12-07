import React from 'react'
import MapComponent from './MapComponent'
import Sidebar from '@/pages/Notes/components/Sidebar'

const LocalBusinessFinder = () => {
  return (<div className=' h-full flex flex-col'>
    <div className='flex p-2'>
      <Sidebar/>
      <h1>Local Business Finder</h1>
    </div>
    <MapComponent />
  </div>
  )
}

export default LocalBusinessFinder