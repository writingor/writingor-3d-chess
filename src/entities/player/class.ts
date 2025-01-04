import { PlayerColor } from '@shared/types/player/color'
import { IPlayer } from './types'

export class Player implements IPlayer {
    private color: PlayerColor
    private isPlaying: boolean

    constructor(color: PlayerColor) {
        this.color = color
        this.isPlaying = false
    }

    setColor(color: PlayerColor): void {
        this.color = color
    }

    getColor(): PlayerColor {
        return this.color
    }

    setIsPlaying(isPlaying: boolean): void {
        this.isPlaying = isPlaying
    }

    getIsPlaying(): boolean {
        return this.isPlaying
    }
}
