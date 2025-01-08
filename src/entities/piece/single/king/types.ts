import { IPiece } from '../base'

export interface IKing extends IPiece {
    getIsMoved: () => boolean
    setIsMoved: (params: boolean) => void
}
