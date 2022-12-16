import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  indexAxis: 'y',
  scales: {
    xAxes: {
      stacked: true,
      display: false,
      barThickness: 60,
    },
    y: {
      stacked: true,
    },
  },
  elements: {
    bar: {
      borderWidth: 0,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
      },
    },
  },
}

const ReportStackedChart = incidentList => {
  return (
    <Bar
      options={options}
      data={incidentList.incidentList}
      width={653}

    />
  )
}

export default ReportStackedChart
