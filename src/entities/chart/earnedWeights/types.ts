export enum PlayerColor {
    BLACK = 'black',
    WHITE = 'white'
}

export interface EarnedWeights {
    black: number[]
    white: number[]
}

export interface IEarnedWeights {
    players: EarnedWeights
    appendWeight: (color: PlayerColor, weight: number) => void
    getTotalWeight: (color: PlayerColor) => number
    getWeights: (color: PlayerColor) => number[]
}
