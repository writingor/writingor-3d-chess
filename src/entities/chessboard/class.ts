import * as THREE from 'three'
import { CellInterface, PiecesInterface } from './types'
import { IPiece } from '@entities/piece/single/types'
import { defaultPieces } from './configs'
import { PiecesAbstractFactory } from '@entities/piece/abstractFactory/class'
import { IPiecesAbstractFactory } from '@entities/piece/abstractFactory/types'

export class ChessBoard {
    scene: THREE.Group | null = null
    cells: CellInterface = {}
    pieces: PiecesInterface = defaultPieces
    selectedPieceUUID: string = ''
    isFirstObjectFound: boolean = false
    piecesPlacedEvent: Event = new CustomEvent('PicesPlacedOnStart')
    fenMap: { [key: string]: string } = {
        king: 'K',
        queen: 'Q',
        rook: 'R',
        bishop: 'B',
        knight: 'N',
        pawn: 'P'
    }
    piecesAbstractFactory: IPiecesAbstractFactory

    constructor() {
        this.piecesAbstractFactory = new PiecesAbstractFactory()
    }

    dispatchEventPiecesPlacedOnStart() {
        window.dispatchEvent(this.piecesPlacedEvent)
    }

    addPieceToFenBoard(piece: IPiece, color: string, board: string[][]) {
        if (!piece.isEaten) {
            const column = piece.cell.charAt(0),
                row = parseInt(piece.cell.charAt(1)),
                rowIndex = 8 - row,
                pieceSymbol = this.fenMap[piece.type.toLowerCase()] ?? '',
                columnIndex = column.charCodeAt(0) - 97,
                symbol = color === 'black' ? pieceSymbol.toLowerCase() : pieceSymbol

            board[rowIndex][columnIndex] = symbol
        }
    }

    getFEN() {
        const board = Array(8)
            .fill('')
            .map(() => Array(8).fill(''))

        Object.values(this.pieces.black).forEach((piece: IPiece) => this.addPieceToFenBoard(piece, 'black', board))
        Object.values(this.pieces.white).forEach((piece: IPiece) => this.addPieceToFenBoard(piece, 'white', board))

        const fenString = board
            .map((row) => {
                let emptyCount = 0,
                    rowString = ''

                for (const cell of row) {
                    if (cell === '') {
                        emptyCount++
                    } else {
                        if (emptyCount > 0) {
                            rowString += emptyCount
                            emptyCount = 0
                        }
                        rowString += cell
                    }
                }

                if (emptyCount > 0) {
                    rowString += emptyCount
                }

                return rowString
            })
            .join('/')

        return `${fenString} w KQkq - 0 1`
    }

    setScene = (scene: THREE.Group | null) => {
        this.scene = scene
    }

    setIsFirstObjectFound = (isFirstObjectFound: boolean) => {
        this.isFirstObjectFound = isFirstObjectFound
    }

    setSelectedPieceUUID = (selectedPieceUUID: string) => {
        this.selectedPieceUUID = selectedPieceUUID
    }

    getPieceByUUID = (uuid: string) => {
        let found: IPiece | null = null

        for (let color of ['white', 'black'] as ('white' | 'black')[]) {
            for (let pieceKey in this.pieces[color]) {
                let piece = this.pieces[color][pieceKey]

                if (!piece.isEaten && piece.object && piece.object.uuid === uuid) {
                    found = piece
                    break
                }
            }

            if (found) break
        }

        return found
    }

    getPieceByCell = (cell: string) => {
        let found: IPiece | null = null

        for (let color of ['white', 'black'] as ('white' | 'black')[]) {
            for (let pieceKey in this.pieces[color]) {
                let piece = this.pieces[color][pieceKey]

                if (!piece.isEaten && piece.object && piece.cell === cell) {
                    found = piece
                    break
                }
            }

            if (found) break
        }

        return found
    }

    removePiece(objectToRemove) {
        if (objectToRemove.parent) {
            objectToRemove.parent.remove(objectToRemove)
        } else {
            this.scene?.remove(objectToRemove)
        }
    }

    getSelectedPiece = () => {
        let found: IPiece | null = null

        for (let color of ['white', 'black'] as ('white' | 'black')[]) {
            for (let pieceKey in this.pieces[color]) {
                let piece = this.pieces[color][pieceKey]

                if (piece.isSelected) {
                    found = piece
                    break
                }
            }

            if (found) break
        }

        return found
    }

    getPieceByObject = (object: THREE.Group | THREE.Mesh) => {
        let found: IPiece | null = null

        for (let color of ['white', 'black'] as ('white' | 'black')[]) {
            for (let pieceKey in this.pieces[color]) {
                let piece = this.pieces[color][pieceKey]

                if (piece.object === object) {
                    found = piece
                    break
                }
            }

            if (found) break
        }

        return found
    }

    movePieceToRoot = (object: THREE.Group | THREE.Mesh) => {
        setTimeout(() => {
            if (this.scene) {
                this.scene.getObjectByProperty('name', 'Grid')?.add(object)

                let cell = this.scene.getObjectByProperty('name', this.getPieceByObject(object)?.cell)

                if (cell) {
                    object.position.set(cell.position.x, cell.position.y, cell.position.z)
                }
            }
        }, 200)
    }

    unselectPieces = () => {
        for (let color of ['white', 'black'] as ('white' | 'black')[]) {
            for (let pieceKey in this.pieces[color]) {
                let piece = this.pieces[color][pieceKey]

                if (piece.isSelected) {
                    piece.setIsSelected(false)
                }
            }
        }
    }

    unselectCells() {
        Object.values(this?.cells).forEach((cell) => {
            cell.object.material.color.set(cell.initialColor)
            cell.isAllowed = false
        })
    }

    selectCells(availableCells) {
        Object.values(this.cells).forEach((cell) => {
            if (availableCells.includes(cell.name)) {
                cell.object.material.color.set(0xff0000)
                cell.isAllowed = true
            }
        })
    }

    /**
     * HighLight cells
     */
    highlightCells(availableMoves) {
        this.unselectCells()
        this.selectCells(availableMoves)
    }

    createCells = (object: THREE.Group | THREE.Mesh) => {
        if (!(object instanceof THREE.Mesh)) return

        if (object.isMesh && object.geometry) {
            // Ensure the bounding box is computed
            object.geometry.computeBoundingBox()
            const boundingBox = object.geometry.boundingBox
            if (boundingBox) {
                const width = boundingBox.max.x - boundingBox.min.x
                const depth = boundingBox.max.z - boundingBox.min.z

                // Determine the size of each square based on the width and depth
                const squareSize = Math.min(width, depth) / 8 // 8x8 grid, so divide by 8

                const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].reverse()
                const numbers = [1, 2, 3, 4, 5, 6, 7, 8]

                // Create the squares as 3D meshes and add them to the array
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        const xPos = (col - 3.5) * squareSize // Center the grid on the X-axis
                        const zPos = (3.5 - row) * squareSize // Center the grid on the Z-axis

                        // Determine the color based on row and column (alternate squares)
                        const isBlack = (row + col) % 2 === 0

                        const squareName = `${letters[col]}${numbers[7 - row]}`

                        // Create a 3D square using THREE.BoxGeometry
                        const geometry = new THREE.BoxGeometry(squareSize, 0.1, squareSize)
                        const material = new THREE.MeshBasicMaterial({
                            color: isBlack ? 'black' : 'white'
                        })
                        const square = new THREE.Mesh(geometry, material)

                        square.position.set(xPos, 0, zPos) // Set the position of each square
                        square.name = squareName

                        object.add(square)

                        this.cells[square.name] = {
                            initialColor: isBlack ? 'black' : 'white',
                            object: square,
                            isAllowed: false,
                            name: square.name
                        }
                    }
                }
            }
        }
    }

    /**
     * Find in a scene Pieces and place they in the
     * root of scene
     *
     * Find in a scene chessboard grid and fill it
     * with cell objects
     *
     * @param object ThreeJS scene
     */
    fillChessBoard = (object: THREE.Group | THREE.Mesh) => {
        /**
         * Clone material to change
         * color directly
         */
        if (object instanceof THREE.Mesh) {
            if (object.material) {
                object.material = Array.isArray(object.material)
                    ? object.material.map((material) => material.clone())
                    : object.material.clone()
            }
        }

        /**
         * Switch by
         * model.glb object names
         */
        switch (object.name) {
            case 'Grid':
                this.createCells(object)
                break

            default:
                const piece = this.piecesAbstractFactory.createPieceFrom3dObject(object)

                if (piece) {
                    this.pieces[piece.color][piece.name.toLowerCase().replace(piece.name, '')] = piece
                    this.movePieceToRoot(piece.object as THREE.Mesh)
                }
                break
        }

        /**
         * Repeact for childrens
         */
        object.children.forEach((child: any) => {
            this.fillChessBoard(child)
        })
    }
}
