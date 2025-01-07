import * as THREE from 'three'
import { PieceFactory } from '../factory'
import { IPiece } from '../single'
import { IPiecesAbstractFactory } from './types'
import { PlayerColor } from '@shared/configs/player/color'
import { PieceType } from '@shared/configs/pieces/types'

export class PiecesAbstractFactory implements IPiecesAbstractFactory {
    createPieceFrom3dObject(object: THREE.Group | THREE.Mesh): IPiece {
        let piece: IPiece | null = null

        switch (object.name) {
            /**
             * White Pieces
             */
            case 'WhiteKing1':
                piece = PieceFactory.create(PieceType.KING, PlayerColor.WHITE, 1, object)
                break

            case 'WhiteQueen1':
                piece = PieceFactory.create(PieceType.QUEEN, PlayerColor.WHITE, 1, object)
                break

            case 'WhiteRook1':
                piece = PieceFactory.create(PieceType.ROOK, PlayerColor.WHITE, 1, object)
                break

            case 'WhiteRook2':
                piece = PieceFactory.create(PieceType.ROOK, PlayerColor.WHITE, 2, object)
                break

            case 'WhiteKnight1':
                piece = PieceFactory.create(PieceType.KNIGHT, PlayerColor.WHITE, 1, object)
                break

            case 'WhiteKnight2':
                piece = PieceFactory.create(PieceType.KNIGHT, PlayerColor.WHITE, 2, object)
                break

            case 'WhiteBishop1':
                piece = PieceFactory.create(PieceType.BISHOP, PlayerColor.WHITE, 1, object)
                break

            case 'WhiteBishop2':
                piece = PieceFactory.create(PieceType.BISHOP, PlayerColor.WHITE, 2, object)
                break

            case 'WhitePawn1':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.WHITE, 1, object)
                break

            case 'WhitePawn2':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.WHITE, 2, object)
                break

            case 'WhitePawn3':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.WHITE, 3, object)
                break

            case 'WhitePawn4':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.WHITE, 4, object)
                break

            case 'WhitePawn5':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.WHITE, 5, object)
                break

            case 'WhitePawn6':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.WHITE, 6, object)
                break

            case 'WhitePawn7':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.WHITE, 7, object)
                break

            case 'WhitePawn8':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.WHITE, 8, object)
                break

            /**
             * Black Pieces
             */
            case 'BlackKing1':
                piece = PieceFactory.create(PieceType.KING, PlayerColor.BLACK, 1, object)
                break

            case 'BlackQueen1':
                piece = PieceFactory.create(PieceType.QUEEN, PlayerColor.BLACK, 1, object)
                break

            case 'BlackRook1':
                piece = PieceFactory.create(PieceType.ROOK, PlayerColor.BLACK, 1, object)
                break

            case 'BlackRook2':
                piece = PieceFactory.create(PieceType.ROOK, PlayerColor.BLACK, 2, object)
                break

            case 'BlackKnight1':
                piece = PieceFactory.create(PieceType.KNIGHT, PlayerColor.BLACK, 1, object)
                break

            case 'BlackKnight2':
                piece = PieceFactory.create(PieceType.KNIGHT, PlayerColor.BLACK, 2, object)
                break

            case 'BlackBishop1':
                piece = PieceFactory.create(PieceType.BISHOP, PlayerColor.BLACK, 1, object)
                break

            case 'BlackBishop2':
                piece = PieceFactory.create(PieceType.BISHOP, PlayerColor.BLACK, 2, object)
                break

            case 'BlackPawn1':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.BLACK, 1, object)
                break

            case 'BlackPawn2':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.BLACK, 2, object)
                break

            case 'BlackPawn3':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.BLACK, 3, object)
                break

            case 'BlackPawn4':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.BLACK, 4, object)
                break

            case 'BlackPawn5':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.BLACK, 5, object)
                break

            case 'BlackPawn6':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.BLACK, 6, object)
                break

            case 'BlackPawn7':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.BLACK, 7, object)
                break

            case 'BlackPawn8':
                piece = PieceFactory.create(PieceType.PAWN, PlayerColor.BLACK, 8, object)
                break

            default:
                break
        }

        return piece as IPiece
    }
}
