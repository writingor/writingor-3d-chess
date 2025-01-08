import { PieceType } from '@shared/configs/pieces/types'
import { Piece, TPieceProps } from '../base'

export class Knight extends Piece {
    constructor(baseProps: TPieceProps) {
        super(
            PieceType.KNIGHT,
            baseProps.name,
            baseProps.cell,
            baseProps.color,
            baseProps.object,
            (baseProps.isSelected = false),
            (baseProps.isEaten = false)
        )
    }
}
