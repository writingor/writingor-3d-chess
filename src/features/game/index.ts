import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { ChessBoard } from '@entities/chessboard'
import { Chess } from 'chess.js'
import { IPiece, PieceColor } from '@entities/piece/single/types'
import { gsap } from 'gsap'
import { EarnedWeights } from '@entities/chart/earnedWeights'
import { PlayerColor } from '@entities/chart/earnedWeights/types'
import { pieceWeights } from '@shared/configs/pieces/weights'

export class Game {
    chessBoard: ChessBoard
    chess: Chess
    earnedWeights: EarnedWeights

    constructor(chessBoard: ChessBoard) {
        this.chessBoard = chessBoard
        this.chess = new Chess()
        this.earnedWeights = new EarnedWeights()
    }

    /**
     *
     * @param chessBoard
     */
    setChessBoard(chessBoard: ChessBoard) {
        this.chessBoard = chessBoard

        window.addEventListener('PicesPlacedOnStart', () => {
            if (!this.chessBoard) return
            this.chess.load(this.chessBoard.getFEN())
        })
    }

    /**
     * Delay to prevent simultaneous selection of multiple objects in Three.js click event.
     *
     * When clicking on objects in Three.js, if there's no delay, all objects in the vector
     * might be selected at once. This delay helps ensure that the first object selection is
     * processed before any further interactions can occur.
     *
     * The delay is set to 100ms to allow processing of the first object before resetting the
     * `isFirst3DProcessing` flag.
     */
    delayAfterClick() {
        setTimeout(() => {
            this.chessBoard?.setIsFirst3DProcessing(false)
        }, 100)
    }

    /**
     *
     * @param piece
     * @returns
     */
    getAvailableMoves(piece: IPiece): string[] {
        const moves = this.chess.moves({ verbose: true })
        const validMoves = moves.filter((move) => move.from === piece.cell)

        return validMoves.map((move) => move.to)
    }

    /**
     *
     * @returns
     */
    displayAvailableCells() {
        this.chessBoard.highlightCells(this.getAvailableMoves(this.chessBoard.getSelectedPiece()))
    }

    /**
     * Select current Piece
     *
     * @param object
     * @returns
     */
    selectPiece(object: THREE.Group | THREE.Mesh) {
        this.chessBoard.unselectPieces()

        const piece = this.chessBoard.getPieceByObject(object)
        if (!piece || piece.color === 'black') return

        this.chessBoard.setIsFirst3DProcessing(true)

        piece.setIsSelected(true)
        this.chessBoard.setSelectedPieceUUID(object.uuid)

        this.displayAvailableCells()
        this.delayAfterClick()
    }

    /**
     *
     * @param cellName
     * @returns
     */
    eatPiece(cellName: string, playedColor: PieceColor) {
        const piece = this.chessBoard.getPieceByCell(cellName)

        if (piece) {
            piece.setIsEaten()
            this.chessBoard.removePiece(piece.object as THREE.Mesh)
        }

        this.earnedWeights.appendWeight(
            playedColor === PieceColor.WHITE ? PlayerColor.WHITE : PlayerColor.BLACK,
            piece ? pieceWeights[piece.type] : 0
        )
    }

    /**
     *
     * @param piece
     * @param cell
     * @returns
     */
    doNececcaryActionsOnMove(piece: IPiece, cell: THREE.Group | THREE.Mesh) {
        if (!piece.object) return

        this.eatPiece(cell.name, piece.color)
        this.chess.move({ from: piece.cell, to: cell.name })

        gsap.to(piece.object.position, {
            x: cell.position.x,
            y: cell.position.y + 0.5,
            z: cell.position.z,
            duration: 0.5,
            ease: 'power1.inOut'
        })

        piece.setIsSelected(false)
        piece.setCell(cell.name)

        this.chessBoard.setSelectedPieceUUID('')
        this.chessBoard.unselectCells()

        if (this.chess.isGameOver()) {
            console.log('Game over!')
        }
    }

    /**
     *
     * @param fen
     * @returns
     */
    async fetchComputerMove(fen: string): Promise<string | null> {
        const response = await fetch('http://ws.chess-api.online/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fen: fen,
                depth: 10
            })
        })

        if (response.ok) {
            const data = await response.json()
            return data.bestMove
        }

        return null
    }

    /**
     *
     * @returns
     */
    async computerMove() {
        const fen = this.chess.fen()
        const move = await this.fetchComputerMove(fen)
        if (!move) return

        const from = move?.slice(0, 2)
        const to = move?.slice(-2)

        const cell = this.chessBoard.scene.getObjectByName(to)
        if (!cell) return

        const piece = this.chessBoard?.getPieceByCell(from)
        if (!piece || !piece.object) return

        this.doNececcaryActionsOnMove(piece, cell as THREE.Mesh)
    }

    /**
     * Move piece to selected cell
     *
     * @param object
     * @returns
     */
    async movePiece(cellOnCanvas: THREE.Group | THREE.Mesh) {
        if (!this.chessBoard.selectedPieceUUID) return

        const piece = this.chessBoard.getPieceByUUID(this.chessBoard.selectedPieceUUID)
        if (!piece) return

        const cell = this.chessBoard.cells[cellOnCanvas.name]
        if (!cell || !cell.object || !cell.isAllowed) return

        this.chessBoard.setIsFirst3DProcessing(true)

        this.doNececcaryActionsOnMove(piece, cell.object)

        if (!this.chess.isGameOver()) {
            await this.computerMove()
        }

        this.delayAfterClick()
    }

    /**
     * Select Piece
     * and move it on selected cell
     *
     * @param event THREE JS Click event
     * @returns no value
     */
    play = (event: ThreeEvent<PointerEvent>) => {
        if (
            this.chess.isGameOver() ||
            this.chessBoard.getIsFirst3DProcessing() ||
            !(event.object instanceof THREE.Mesh || event.object instanceof THREE.Group)
        ) {
            return
        }

        if (this.chessBoard.getPieceByObject(event.object)) {
            // if a piece was clicked
            this.selectPiece(event.object)
            //
        } else if (event.object?.parent?.name === 'Grid') {
            // else if a cell was clicked
            this.movePiece(event.object)
        }
    }
}
