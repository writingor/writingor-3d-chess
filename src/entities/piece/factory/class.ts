import * as THREE from 'three'
import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from '../single'
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
        let cell = initialCells[color][type][index - 1]
        let piece: Piece

        /**
         * Create Piece Object based on a specific type
         */
        switch (type) {
            case PieceType.KING:
                piece = new King({ name, cell, color, object })
                break

            case PieceType.QUEEN:
                piece = new Queen({ name, cell, color, object })
                break

            case PieceType.ROOK:
                piece = new Rook({ name, cell, color, object })
                break

            case PieceType.BISHOP:
                piece = new Bishop({ name, cell, color, object })
                break

            case PieceType.KNIGHT:
                piece = new Knight({ name, cell, color, object })
                break

            default:
                piece = new Pawn({ name, cell, color, object })
                break
        }

        return piece
    }
}
