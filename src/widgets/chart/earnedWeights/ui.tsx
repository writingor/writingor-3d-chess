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
import { PlayerColor } from '@entities/chart/earnedWeights/types'

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

let isInited = false

export const EarnedWeightsWidget: React.FC = () => {
    const [whiteWeights, setWhiteWeights] = useState<number[]>([])
    const [blackWeights, setBlackWeights] = useState<number[]>([])

    const sumWeights = (numbers: number[]): number => {
        return numbers.reduce((accumulator, currentValue) => {
            return accumulator + currentValue
        }, 0)
    }

    useEffect(() => {
        if (!isInited) {
            const handleNewWeightEarned = (event: CustomEvent) => {
                const { color, weight } = event.detail

                switch (color) {
                    case PlayerColor.BLACK:
                        setBlackWeights((prevWeights) => [...prevWeights, sumWeights([...prevWeights, weight])])
                        break
                    case PlayerColor.WHITE:
                        setWhiteWeights((prevWeights) => [...prevWeights, sumWeights([...prevWeights, weight])])
                        break
                    default:
                        break
                }
            }

            window.addEventListener('NewWeightEarned', handleNewWeightEarned)

            // Cleanup the event listener when component unmounts
            return () => {
                window.removeEventListener('NewWeightEarned', handleNewWeightEarned)
            }
        }

        isInited = true
    }, [])

    // Create the chart data structure
    const data = {
        labels: Array(Math.max(whiteWeights.length, blackWeights.length)).fill(''),
        datasets: [
            {
                label: `White (${whiteWeights.length} moves)`,
                data: whiteWeights,
                borderColor: '#f2ece6',
                backgroundColor: 'transparent',
                fill: true,
                tension: 0.4
            },
            {
                label: `Black (${blackWeights.length} moves)`,
                data: blackWeights,
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
