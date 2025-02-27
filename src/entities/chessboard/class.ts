import * as THREE from 'three'
import { ICell, PiecesInterface } from './types'
import { defaultPieces } from './configs'
import { PiecesAbstractFactory } from '@entities/piece/abstractFactory/class'
import { IPiecesAbstractFactory } from '@entities/piece/abstractFactory/types'
import { TCellName } from '@shared/types/cell'
import { IKing, IPiece, IRook } from '@entities/piece'

/**
 * Contenxt to Manage
 * Pieces and Cells
 */
export class ChessBoard {
    scene: THREE.Group
    cells: ICell
    pieces: PiecesInterface
    selectedPieceUUID: string
    private isFirst3DProcessing: boolean
    piecesPlacedEvent: Event
    fenMap: { [key: string]: string }
    piecesAbstractFactory: IPiecesAbstractFactory

    constructor(scene: THREE.Group | null = null) {
        this.scene = scene as THREE.Group
        this.cells = {}
        this.pieces = defaultPieces
        this.isFirst3DProcessing = false
        this.piecesAbstractFactory = new PiecesAbstractFactory()
        this.selectedPieceUUID = ''
        this.piecesPlacedEvent = new CustomEvent('PicesPlacedOnStart')
        this.fenMap = {
            king: 'K',
            queen: 'Q',
            rook: 'R',
            bishop: 'B',
            knight: 'N',
            pawn: 'P'
        }
    }

    /**
     * The `init` function sets the rotation of the scene, fills the chessboard, and dispatches an
     * event for pieces being placed at the start.
     */
    init() {
        this.scene.rotation.set(0, 1.58, 0)
        this.fillChessBoard(this.scene)
        this.dispatchEventPiecesPlacedOnStart()
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

    /**
     * The `getFEN` function in TypeScript generates a FEN string representation of the current chess
     * board state.
     * @returns The `getFEN()` function returns a FEN (Forsyth-Edwards Notation) string representing
     * the current state of a chess board. The FEN string includes the positions of the pieces on the
     * board, the active color to move, castling availability, en passant target square, halfmove
     * clock, and fullmove number.
     */
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

    setIsFirst3DProcessing = (isFirst3DProcessing: boolean) => {
        this.isFirst3DProcessing = isFirst3DProcessing
    }

    getIsFirst3DProcessing() {
        return this.isFirst3DProcessing
    }

    setSelectedPieceUUID = (selectedPieceUUID: string) => {
        this.selectedPieceUUID = selectedPieceUUID
    }

    getPieceByUUID = (uuid: string) => {
        let found: IPiece | IKing | IRook | null = null

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

    removePiece(objectToRemove: THREE.Mesh | THREE.Group) {
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

        return found as IPiece
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

    /**
     * The function `movePieceToRoot` moves a given object to the root of the scene after a delay of
     * 200 milliseconds.
     * @param {THREE.Group | THREE.Mesh} object - The `object` parameter in the `movePieceToRoot`
     * function is expected to be either a `THREE.Group` or a `THREE.Mesh` object. This function is
     * designed to move the provided object to the root of the scene after a delay of 200 milliseconds.
     */
    movePieceToRoot(object: THREE.Group | THREE.Mesh) {
        setTimeout(() => {
            if (this.scene) {
                this.scene.getObjectByProperty('name', 'Grid')?.add(object)

                let cell = this.scene.getObjectByProperty('name', this.getPieceByObject(object)?.cell)

                if (cell) {
                    object.position.set(cell.position.x, cell.position.y + 0.5, cell.position.z)
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
        Object.values(this.cells).forEach((cell) => {
            const material = cell.object.material

            if (Array.isArray(material)) {
                material.forEach((m) => {
                    if (m && 'color' in m && m.color instanceof THREE.Color) {
                        ;(m.color as THREE.Color).set(cell.initialColor)
                    }
                })
            } else {
                if (material && 'color' in material && material.color instanceof THREE.Color) {
                    ;(material.color as THREE.Color).set(cell.initialColor)
                }
            }

            cell.isAllowed = false
        })
    }

    selectCells(availableCells: string[]) {
        Object.values(this.cells).forEach((cell) => {
            if (availableCells.includes(cell.name)) {
                const material = cell.object.material

                if (Array.isArray(material)) {
                    material.forEach((m) => {
                        if (m && 'color' in m && m.color instanceof THREE.Color) {
                            ;(m.color as THREE.Color).set('#7786b8')
                        }
                    })
                } else {
                    if (material && 'color' in material && material.color instanceof THREE.Color) {
                        ;(material.color as THREE.Color).set('#7786b8')
                    }
                }

                cell.isAllowed = true
            }
        })
    }

    /**
     * HighLight cells
     */
    highlightCells(availableMoves: string[]) {
        this.unselectCells()
        this.selectCells(availableMoves)
    }

    /**
     * The function `createCells` generates a grid of 3D squares based on the bounding box of a given
     * mesh object.
     * @param {THREE.Group | THREE.Mesh} object - The `object` parameter in the `createCells` function
     * is expected to be either a `THREE.Group` or a `THREE.Mesh`. The function first checks if the
     * object is an instance of `THREE.Mesh` before proceeding with creating cells based on the
     * geometry of the mesh.
     */
    createCells(object: THREE.Group | THREE.Mesh) {
        if (!(object instanceof THREE.Mesh)) return

        if (object.isMesh && object.geometry) {
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
                            color: isBlack ? '#4d382c' : '#f2ece6'
                        })
                        const square = new THREE.Mesh(geometry, material)

                        square.position.set(xPos, 0, zPos) // Set the position of each square
                        square.name = squareName

                        object.add(square) // Add the square to the object

                        this.cells[square.name] = {
                            initialColor: isBlack ? '#4d382c' : '#f2ece6',
                            object: square,
                            isAllowed: false,
                            name: square.name
                        }

                        // Create the edges geometry and material for the border effect
                        const edges = new THREE.EdgesGeometry(geometry)
                        const edgesMaterial = new THREE.LineBasicMaterial({
                            color: isBlack ? '#57433e' : '#d1b8b2',
                            opacity: 0.1
                        })
                        const edgesMesh = new THREE.LineSegments(edges, edgesMaterial)

                        edgesMesh.scale.set(0.85, 0.85, 0.85)

                        // Position the edges exactly on top of the square (no need to scale)
                        edgesMesh.position.set(xPos, 0.05, zPos) // Keep the position centered with the square

                        // Add the edges (border) to the object
                        object.add(edgesMesh)
                    }
                }
            }
        }
    }

    getCellNameForRookInCastling(kingsCellName: TCellName): TCellName {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        return `${files.indexOf(kingsCellName[0]) < 4 ? 'd' : 'f'}${kingsCellName[1]}`
    }

    getClosestBorderCellNameInRow(cellName: TCellName): TCellName {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        return `${files.indexOf(cellName[0]) < 4 ? 'a' : 'h'}${cellName[1]}`
    }

    getRookForCastling(cellName: TCellName): IPiece | null {
        return this.getPieceByCell(this.getClosestBorderCellNameInRow(cellName))
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
