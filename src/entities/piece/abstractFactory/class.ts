import * as THREE from 'three'
import { PieceFactory } from '../factory'
import { Piece } from '../single'
import { IPiecesAbstractFactory } from './types'
import { PlayerColor } from '@shared/configs/player/color'
import { PieceType } from '@shared/configs/pieces/types'

export class PiecesAbstractFactory implements IPiecesAbstractFactory {
    createPieceFrom3dObject(object: THREE.Group | THREE.Mesh): Piece {
        let piece: Piece | null = null

        switch (object.name) {
            /**
             * White Pieces
             */
            case 'WhiteKing1':
                piece = PieceFactory.create(object, 1, PieceType.KING, PlayerColor.WHITE)
                break

            case 'WhiteQueen1':
                piece = PieceFactory.create(object, 1, PieceType.QUEEN, PlayerColor.WHITE)
                break

            case 'WhiteRook1':
                piece = PieceFactory.create(object, 1, PieceType.ROOK, PlayerColor.WHITE)
                break

            case 'WhiteRook2':
                piece = PieceFactory.create(object, 2, PieceType.ROOK, PlayerColor.WHITE)
                break

            case 'WhiteKnight1':
                piece = PieceFactory.create(object, 1, PieceType.KNIGHT, PlayerColor.WHITE)
                break

            case 'WhiteKnight2':
                piece = PieceFactory.create(object, 2, PieceType.KNIGHT, PlayerColor.WHITE)
                break

            case 'WhiteBishop1':
                piece = PieceFactory.create(object, 1, PieceType.BISHOP, PlayerColor.WHITE)
                break

            case 'WhiteBishop2':
                piece = PieceFactory.create(object, 2, PieceType.BISHOP, PlayerColor.WHITE)
                break

            case 'WhitePawn1':
                piece = PieceFactory.create(object)
                break

            case 'WhitePawn2':
                piece = PieceFactory.create(object, 2)
                break

            case 'WhitePawn3':
                piece = PieceFactory.create(object, 3)
                break

            case 'WhitePawn4':
                piece = PieceFactory.create(object, 4)
                break

            case 'WhitePawn5':
                piece = PieceFactory.create(object, 5)
                break

            case 'WhitePawn6':
                piece = PieceFactory.create(object, 6)
                break

            case 'WhitePawn7':
                piece = PieceFactory.create(object, 7)
                break

            case 'WhitePawn8':
                piece = PieceFactory.create(object, 8)
                break

            /**
             * Black Pieces
             */
            case 'BlackKing1':
                piece = PieceFactory.create(object, 1, PieceType.KING, PlayerColor.BLACK)
                break

            case 'BlackQueen1':
                piece = PieceFactory.create(object, 1, PieceType.QUEEN, PlayerColor.BLACK)
                break

            case 'BlackRook1':
                piece = PieceFactory.create(object, 1, PieceType.ROOK, PlayerColor.BLACK)
                break

            case 'BlackRook2':
                piece = PieceFactory.create(object, 2, PieceType.ROOK, PlayerColor.BLACK)
                break

            case 'BlackKnight1':
                piece = PieceFactory.create(object, 1, PieceType.KNIGHT, PlayerColor.BLACK)
                break

            case 'BlackKnight2':
                piece = PieceFactory.create(object, 2, PieceType.KNIGHT, PlayerColor.BLACK)
                break

            case 'BlackBishop1':
                piece = PieceFactory.create(object, 1, PieceType.BISHOP, PlayerColor.BLACK)
                break

            case 'BlackBishop2':
                piece = PieceFactory.create(object, 2, PieceType.BISHOP, PlayerColor.BLACK)
                break

            case 'BlackPawn1':
                piece = PieceFactory.create(object, 1, PieceType.PAWN, PlayerColor.BLACK)
                break

            case 'BlackPawn2':
                piece = PieceFactory.create(object, 2, PieceType.PAWN, PlayerColor.BLACK)
                break

            case 'BlackPawn3':
                piece = PieceFactory.create(object, 3, PieceType.PAWN, PlayerColor.BLACK)
                break

            case 'BlackPawn4':
                piece = PieceFactory.create(object, 4, PieceType.PAWN, PlayerColor.BLACK)
                break

            case 'BlackPawn5':
                piece = PieceFactory.create(object, 5, PieceType.PAWN, PlayerColor.BLACK)
                break

            case 'BlackPawn6':
                piece = PieceFactory.create(object, 6, PieceType.PAWN, PlayerColor.BLACK)
                break

            case 'BlackPawn7':
                piece = PieceFactory.create(object, 7, PieceType.PAWN, PlayerColor.BLACK)
                break

            case 'BlackPawn8':
                piece = PieceFactory.create(object, 8, PieceType.PAWN, PlayerColor.BLACK)
                break

            default:
                break
        }

        return piece as Piece
    }
}
