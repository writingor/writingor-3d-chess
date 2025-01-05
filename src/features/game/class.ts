import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { ChessBoard } from '@entities/chessboard'
import { Chess } from 'chess.js'
import { IPiece } from '@entities/piece/single/types'
import { gsap } from 'gsap'
import { pieceWeights } from '@shared/configs/pieces/weights'
import { Players } from './types'
import { Player } from '@entities/player'
import { PlayerColor } from '@shared/configs/player/color'

export class Game {
    private chess: Chess
    private chessBoard: ChessBoard
    private players: Players
    private currentColor: PlayerColor

    constructor(chessBoard: ChessBoard) {
        this.chess = new Chess()
        this.chessBoard = chessBoard
        this.players = {
            white: new Player(PlayerColor.WHITE, true),
            black: new Player(PlayerColor.BLACK)
        }
        this.currentColor = PlayerColor.WHITE
    }

    init() {
        this.chessBoard.init()
    }

    getPlayers(): Players {
        return this.players
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
        if (this.currentColor !== PlayerColor.WHITE) return
        this.chessBoard.unselectPieces()

        const piece = this.chessBoard.getPieceByObject(object)
        if (!piece || piece.color !== PlayerColor.WHITE) return

        piece.setIsSelected(true)
        this.chessBoard.setSelectedPieceUUID(object.uuid)

        this.displayAvailableCells()
    }

    /**
     *
     * @param cellName
     * @returns
     */
    eatPiece(cellName: string) {
        const piece = this.chessBoard.getPieceByCell(cellName)

        if (piece) {
            piece.setIsEaten()
            this.chessBoard.removePiece(piece.object as THREE.Group)
        }

        this.players[this.currentColor].addEarnedWeight(piece ? pieceWeights[piece.type] : 0)
    }

    /**
     *
     * @param piece
     * @param cell
     * @returns
     */
    doNececcaryActionsOnMove(piece: IPiece, cell: THREE.Group | THREE.Mesh) {
        if (!piece.object) return

        this.eatPiece(cell.name)
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
            alert('Game over!')
        }
    }

    /**
     *
     * @param fen
     * @returns
     */
    async fetchComputerMove(fen: string): Promise<string | null> {
        const response = await fetch('https://chess-api.com/v1', {
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
            return data
        }

        return null
    }

    /**
     *
     * @returns
     */
    async computerMove() {
        const move = await this.fetchComputerMove(this.chess.fen())
        if (!move) return

        // @ts-ignore
        const from = typeof move === 'string' ? move.slice(0, 2) : move.from
        // @ts-ignore
        const to = typeof move === 'string' ? move.slice(-2) : move.to

        const cell = this.chessBoard.scene.getObjectByName(to)
        if (!cell) return

        const piece = this.chessBoard?.getPieceByCell(from)
        if (!piece || !piece.object) return

        this.doNececcaryActionsOnMove(piece, cell as THREE.Mesh)
    }

    /**
     *
     * @param cellName
     * @returns
     */
    humanMove(cellName: string): boolean {
        if (!this.chessBoard.selectedPieceUUID) return false

        const piece = this.chessBoard.getPieceByUUID(this.chessBoard.selectedPieceUUID)
        if (!piece) return false

        const cell = this.chessBoard.cells[cellName]
        if (!cell || !cell.object || !cell.isAllowed) return false

        this.doNececcaryActionsOnMove(piece, cell.object)

        return true
    }

    async move(cellName: string) {
        const humanMoved = this.humanMove(cellName)

        if (humanMoved) {
            this.currentColor = PlayerColor.BLACK
            await this.computerMove()
            this.currentColor = PlayerColor.WHITE
        }
    }

    /**
     * Select Piece
     * and move it on selected cell
     *
     * @param event THREE JS Click event
     * @returns no value
     */
    async play(event: ThreeEvent<PointerEvent>) {
        if (
            this.chess.isGameOver() ||
            this.currentColor !== PlayerColor.WHITE ||
            this.chessBoard.getIsFirst3DProcessing() ||
            !(event.object instanceof THREE.Mesh || event.object instanceof THREE.Group)
        ) {
            return
        }

        this.chessBoard.setIsFirst3DProcessing(true)

        const piece = this.chessBoard.getPieceByObject(event.object)

        if (piece) {
            // if a piece was clicked
            if (piece.color === PlayerColor.WHITE) {
                this.selectPiece(event.object)
                //
            } else {
                // else if this is a black piece was clicked
                await this.move(piece.cell)
            }
            //
        } else if (event.object?.parent?.name === 'Grid') {
            // else if a cell was clicked
            await this.move(event.object.name)
        }

        setTimeout(() => {
            this.chessBoard?.setIsFirst3DProcessing(false)
        }, 100)
    }
}
