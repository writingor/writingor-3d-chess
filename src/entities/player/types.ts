import { PlayerColor } from '@shared/types/player/color'

export interface IPlayer {
    setColor: (value: PlayerColor) => void
    getColor: () => PlayerColor

    setIsPlaying: (value: boolean) => void
    getIsPlaying: () => boolean
}
