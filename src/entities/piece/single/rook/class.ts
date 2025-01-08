import { PieceType } from '@shared/configs/pieces/types'
import { Piece, TPieceProps } from '../base'
import { IRook } from './types'

export class Rook extends Piece implements IRook {
    private isMoved: boolean

    constructor(baseProps: TPieceProps) {
        super(
            PieceType.ROOK,
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
