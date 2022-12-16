import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: 'y',
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    }
  },
};
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const ReportBarChart = (incidentList) => {
  return <Bar options={options} data={incidentList.incidentList} height={300} />;
}

export default ReportBarChart
