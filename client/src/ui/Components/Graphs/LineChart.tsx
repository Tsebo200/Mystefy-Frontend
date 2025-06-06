import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import styles from './DoughnutChart.module.scss';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Total Waste Loss per Item Type',
       font: {
          size: 15,
        },
    },
  },

 scales: {
    x: {
      grid: {
        display: false, // remove vertical grid lines
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false, // remove horizontal grid lines
      },
      suggestedMax: 10, // optional for better spacing
      ticks: {
        stepSize: 1000,
      },
    },
},


};

export function LineChart() {
  const [totals, setTotals] = useState({
    Packaging: 0,
    Ingredients: 0,
    Fragrance: 0,
    BatchFinishedProducts: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotals = async () => {
      const endpoints = {
        Packaging: 'http://localhost:5167/api/WasteLossRecordPackaging',
        Ingredients: 'http://localhost:5167/api/WasteLossRecordIngredients',
        Fragrance: 'http://localhost:5167/api/WasteLossRecordFragrance',
        BatchFinishedProducts: 'http://localhost:5167/api/WasteLossRecordBatchFinishedProducts',
      };

      const newTotals: any = {};

      for (const [key, url] of Object.entries(endpoints)) {
        try {
          const response = await fetch(url);
          const data = await response.json();
          const total = data.reduce((sum: number, item: any) => sum + item.quantityLoss, 0);
          newTotals[key] = total;
        } catch (error) {
          console.error(`Error fetching ${key} data:`, error);
          newTotals[key] = 0;
        }
      }

      setTotals(newTotals);
      setLoading(false); // done loading
    };

    fetchTotals();
  }, []);

  const labels = Object.keys(totals);
  const data = {
    labels,
    datasets: [
      {
        label: 'Total Quantity Loss',
        data: Object.values(totals),
        backgroundColor: [
          '#B8222F',
          '#3C0806',
          '#69171E',
          '#8F1D27',
        ],
      },
    ],
  };

  return (
  <div style={{ height: '1000px', width: '100%' }}>
      {loading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
          <p>Loading chart...</p>
        </div>
      ) : (
        <Bar options={options} data={data} />
      )}
    </div>
  )
}
