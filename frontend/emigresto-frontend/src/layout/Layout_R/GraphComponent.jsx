import {
  CategoryScale, Chart as ChartJS, Legend, LinearScale,
  LineElement, PointElement, Title, Tooltip
} from 'chart.js'
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { API } from '../../services/apiServices'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const getWeek = () => {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  return Array.from({length:7}, (_,i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate()+i)
    return d.toISOString().split('T')[0]
  })
}
const days = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']

export default function GraphComponent() {
  const [dataSet, setDataSet] = useState([])
  const weekDates = getWeek()

  useEffect(() => {
    API.reservation.list()
      .then(res => setDataSet(res.results))
      .catch(() => {/* silent */})
  }, [])

  const counts = weekDates.map(date =>
    dataSet.filter(r => r.date===date).length
  )

  const data = {
    labels: days,
    datasets: [{
      label: 'Réservations',
      data: counts,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.3)',
      tension: 0.3,
    }]
  }

  const options = {
    scales: {
      y: { beginAtZero:true, ticks:{stepSize:1} },
      x: { title:{display:false} }
    },
    plugins: { legend:{position:'top'} }
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <h2 className="text-lg font-semibold mb-2 text-center">Semaine</h2>
      <div className="h-48"><Line data={data} options={options} /></div>
    </div>
  )
}
