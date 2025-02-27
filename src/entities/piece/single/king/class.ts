import { PieceType } from '@shared/configs/pieces/types'
import { Piece, TPieceProps } from '../base'
import { IKing } from './types'

export class King extends Piece implements IKing {
    private isMoved: boolean

    constructor(baseProps: TPieceProps) {
        super(
            PieceType.KING,
            baseProps.name,
            baseProps.cell,
            baseProps.color,
            baseProps.object,
            (baseProps.isSelected = false),
            (baseProps.isEaten = false)
        )

        this.isMoved = false
    }

    getIsMoved(): boolean {
        return this.isMoved
    }

    setIsMoved(isMoved: boolean): void {
        this.isMoved = isMoved
    }
}
