import { PlayerColor, IEarnedWeights } from './types'

export class EarnedWeights implements IEarnedWeights {
    players: {
        black: number[]
        white: number[]
    }

    constructor() {
        this.players = {
            black: [],
            white: []
        }
    }

    /**
     * Append a weight for the given color.
     * @param color - The color of the player (black or white).
     * @param weight - The weight to append.
     */
    appendWeight(color: PlayerColor, weight: number): void {
        switch (color) {
            case PlayerColor.BLACK:
                this.players.black.push(weight)
                break
            case PlayerColor.WHITE:
                this.players.white.push(weight)
                break
            default:
                break
        }

        window.dispatchEvent(
            new CustomEvent('NewWeightEarned', {
                detail: { color, weight }
            })
        )
    }

    /**
     * Get the total weight for each player color.
     * @param color - The color of the player.
     * @returns The total weight of the player.
     */
    getTotalWeight(color: PlayerColor): number {
        switch (color) {
            case PlayerColor.BLACK:
                return this.players.black.reduce((acc, curr) => acc + curr, 0)
            case PlayerColor.WHITE:
                return this.players.white.reduce((acc, curr) => acc + curr, 0)
            default:
                throw new Error('Invalid player color')
        }
    }

    /**
     * Get the list of weights for the given player color.
     * @param color - The color of the player.
     * @returns The list of weights for the player.
     */
    getWeights(color: PlayerColor): number[] {
        switch (color) {
            case PlayerColor.BLACK:
                return [...this.players.black]
            case PlayerColor.WHITE:
                return [...this.players.white]
            default:
                throw new Error('Invalid player color')
        }
    }
}
