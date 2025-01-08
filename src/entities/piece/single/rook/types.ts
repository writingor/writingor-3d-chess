import { IPiece } from '../base'

export interface IRook extends IPiece {
    getIsMoved: () => boolean
    setIsMoved: (params: boolean) => void
}
