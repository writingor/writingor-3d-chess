import { PieceType } from '@shared/configs/pieces/types'
import { PlayerColor } from '@shared/configs/player/color'
import * as THREE from 'three'

export type TPieceProps = {
    name: string
    cell: string
    color: PlayerColor
    object: THREE.Group | THREE.Mesh
    isSelected?: boolean
    isEaten?: boolean
}

export type TPiece = TPieceProps & {
    type: PieceType
}

export interface IPiece extends TPiece {
    setCell: (params: string) => void
    setIsSelected: (params: boolean) => void
    setIsEaten: (param?: boolean) => void
}
