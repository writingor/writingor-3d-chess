import { PieceType } from '@shared/configs/pieces/types'
import { Piece, TPieceProps } from '../base'

export class Queen extends Piece {
    constructor(baseProps: TPieceProps) {
        super(
            PieceType.QUEEN,
            baseProps.name,
            baseProps.cell,
            baseProps.color,
            baseProps.object,
            (baseProps.isSelected = false),
            (baseProps.isEaten = false)
        )
    }
}
