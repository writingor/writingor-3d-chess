import './styles.css'
import React, { useEffect, useState } from 'react'
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
import { EarnedWeightsWidgetProps } from './types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

let isInited = false

export const EarnedWeightsWidget: React.FC<EarnedWeightsWidgetProps> = ({ players, ...props }) => {
    const [_, setTriggerReRender] = useState<number>(0)

    const whiteWeights = players.white.getEarnedWeights()
    const blackWeights = players.black.getEarnedWeights()

    function handlePlayerEarnedNewWeightEvent() {
        setTriggerReRender(Math.random())
    }

    useEffect(() => {
        if (!isInited) {
            isInited = true
            window.addEventListener(players.black.getEarnedNewWeightEvent().type, handlePlayerEarnedNewWeightEvent)
        }
    }, [])

    const data = {
        labels: Array(Math.max(whiteWeights.length, blackWeights.length)).fill(''),
        datasets: [
            {
                label: `White (${whiteWeights.length} moves)`,
                data: whiteWeights,
                borderColor: '#f2ece6',
                backgroundColor: 'transparent',
                tension: 0.4
            },
            {
                label: `Black (${blackWeights.length} moves)`,
                data: blackWeights,
                borderColor: '#4d382c',
                backgroundColor: 'transparent',
                tension: 0.4
            }
        ]
    }

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Earned Weights Progression'
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
