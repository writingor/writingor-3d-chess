import { PieceType } from '@shared/configs/pieces/types'
import { Piece, TPieceProps } from '../base'

export class Bishop extends Piece {
    constructor(baseProps: TPieceProps) {
        super(
            PieceType.BISHOP,
            baseProps.name,
            baseProps.cell,
            baseProps.color,
            baseProps.object,
            (baseProps.isSelected = false),
            (baseProps.isEaten = false)
        )
    }
}
