import * as THREE from 'three'
import { Piece } from '../single'
import { initialCells } from '@shared/configs/pieces/initialCells'
import { PlayerColor } from '@shared/configs/player/color'
import { PieceType } from '@shared/configs/pieces/types'
import { createPieceName } from '@shared/utils/pieces/createPieceName'

export class PieceFactory {
    static create(
        object: THREE.Group | THREE.Mesh,
        index: number = 1,
        type: PieceType = PieceType.PAWN,
        color: PlayerColor = PlayerColor.WHITE
    ): Piece {
        let name = createPieceName(color, type, index)
        let cell = initialCells[color][type]

        switch (type) {
            case PieceType.KING:
                break

            default:
                break
        }

        return new Piece(type, name, cell[index - 1], color, object, false, false)
    }
}
