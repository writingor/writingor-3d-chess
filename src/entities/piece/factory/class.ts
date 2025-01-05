import * as THREE from 'three'
import { Piece } from '../single'
import { PieceType } from '../single/types'
import { initialCells } from '@shared/configs/pieces/initialCells'
import { createPieceName } from '../single/utils'
import { PlayerColor } from '@shared/configs/player/color'

export class PieceFactory {
    static create(type: PieceType, color: PlayerColor, index: number = 1, object: THREE.Group | THREE.Mesh): Piece {
        let name = createPieceName(color, type, index)
        let cell = initialCells[color][type]

        return new Piece(type, name, cell[index - 1], color, object, false, false)
    }
}
