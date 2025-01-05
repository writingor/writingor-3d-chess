import { PlayerColor } from '@shared/configs/player/color'
import { PieceType } from './types'

export function createPieceName(color: PlayerColor, type: PieceType, index: number) {
    return `${color.charAt(0).toUpperCase() + color.slice(1)}${type.charAt(0).toUpperCase() + type.slice(1)}${index}`
}
