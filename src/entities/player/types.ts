import { PlayerColor } from '@shared/configs/player/color'

export interface IPlayer {
    setColor: (value: PlayerColor) => void
    getColor: () => PlayerColor

    setIsPlaying: (value: boolean) => void
    getIsPlaying: () => boolean

    addEarnedWeight: (value: number) => void
    getEarnedWeights: () => number[]
    getEarnedNewWeightEvent: () => CustomEvent
}
