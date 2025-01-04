import './styles.css'
import React from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const EarnedWeightsWidget: React.FC = () => {
    const whiteData = [20, 100, 40, 0, 1]
    const blackData = [10, 1000, 100, 20, 10, 120]

    // Create the chart data structure
    const data = {
        labels: Array(Math.max(whiteData.length, blackData.length)).fill(''),
        datasets: [
            {
                label: 'White',
                data: whiteData,
                borderColor: '#f2ece6',
                backgroundColor: 'transparent',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Black',
                data: blackData,
                borderColor: '#4d382c',
                backgroundColor: 'transparent',
                fill: true,
                tension: 0.4
            }
        ]
    }

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Earned Weights'
            },
            tooltip: {
                mode: 'nearest' as const,
                intersect: false
            }
        },
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true
            }
        }
    }

    return (
        <div className="earnedWeightsChart">
            <Line data={data} options={options} />
        </div>
    )
}

export default EarnedWeightsWidget
