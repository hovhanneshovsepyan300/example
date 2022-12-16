import React from 'react'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bubble } from 'react-chartjs-2'

ChartJS.register(LinearScale, PointElement, Tooltip, Legend)

export const options = {
  scales: {
    y: {
      ticks: {
        beginAtZero: true,
        display: false,
      },
      grid: {
        borderColor: 'black',
        display: false,
      },
    },
    x: {
      ticks: {
        beginAtZero: true,
        display: false,
      },
      grid: {
        borderColor: 'black',
        display: false
      }
    },
  },
  plugins: {
    legend: {
      display: false
    },
  },
  elements: {
    arc: {
      borderWidth: 0
    }
  }
}

const ReportBubbleChart = (incidentList) => {
  return <Bubble options={options} data={incidentList.incidentList} width={653} height={236} />
}

export default ReportBubbleChart;
