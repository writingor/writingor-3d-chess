import { PlayerColor } from '@shared/configs/player/color'
import * as THREE from 'three'

// Enum for Piece Types
export enum PieceType {
    KING = 'king',
    QUEEN = 'queen',
    ROOK = 'rook',
    BISHOP = 'bishop',
    KNIGHT = 'knight',
    PAWN = 'pawn'
}

// Interface for the Piece Object
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
