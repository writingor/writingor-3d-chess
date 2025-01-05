import { PlayerColor } from '@shared/configs/player/color'
import { IPlayer } from './types'

const event = new CustomEvent('PlayerEarnedNewWeight')

export class Player implements IPlayer {
    private color: PlayerColor
    private isPlaying: boolean
    private earnedWeights: number[]
    private earnedNewWeightEvent: CustomEvent

    constructor(color: PlayerColor, isPlaying: boolean = false) {
        this.color = color
        this.isPlaying = isPlaying
        this.earnedWeights = []
        this.earnedNewWeightEvent = event
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

    addEarnedWeight(earnedWeight: number) {
        this.earnedWeights.push(earnedWeight)
        window.dispatchEvent(this.getEarnedNewWeightEvent())
    }

    getEarnedNewWeightEvent(): CustomEvent {
        return this.earnedNewWeightEvent
    }

    getEarnedWeights(): number[] {
        return this.earnedWeights
    }
}
