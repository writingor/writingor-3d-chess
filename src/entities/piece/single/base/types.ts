import { PieceType } from '@shared/configs/pieces/types'
import { PlayerColor } from '@shared/configs/player/color'
import * as THREE from 'three'

export interface IPiece {
    type: PieceType
    name: string
    cell: string
    isSelected: boolean
    color: PlayerColor
    object: THREE.Group | THREE.Mesh | null
    isEaten: boolean
    setCell: (params: string) => void
    setIsSelected: (params: boolean) => void
    setIsEaten: (param?: boolean) => void
}
