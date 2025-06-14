import React from 'react'
import AlertComponent from '../../../../../frontend/emigresto-frontend/src/layout/Layout_R/AlertComponent'
import CalendarComponent from '../../../../../frontend/emigresto-frontend/src/layout/Layout_R/CalendarComponent'
import GraphComponent from '../../../../../frontend/emigresto-frontend/src/layout/Layout_R/GraphComponent'
import HistoryComponent from '../../../../../frontend/emigresto-frontend/src/layout/Layout_R/HistoryComponent'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <AlertComponent />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <HistoryComponent />
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <GraphComponent />
        </div>
        <div className="bg-white shadow rounded-lg p-4 md:col-span-2">
          <CalendarComponent />
        </div>
      </div>
    </div>
  )
}
