import * as THREE from 'three'
import { IPiece, PieceColor, PieceType } from './types'

export class Piece implements IPiece {
    type: PieceType
    name: string
    cell: string
    isSelected: boolean
    color: PieceColor
    isEaten: boolean
    object: THREE.Group | THREE.Mesh

    constructor(
        type: PieceType,
        name: string,
        cell: string,
        color: PieceColor,
        object: THREE.Group | THREE.Mesh,
        isSelected: boolean = false,
        isEaten: boolean = false
    ) {
        this.type = type
        this.name = name
        this.cell = cell
        this.color = color
        this.isSelected = isSelected
        this.isEaten = isEaten
        this.object = object
    }

    setCell(cell: string) {
        this.cell = cell
    }

    switchColor() {
        if (this.object && this.object instanceof THREE.Mesh) {
            const material = this.object.material as THREE.MeshBasicMaterial
            material.color.set(this.isSelected ? 'gray' : this.color === PieceColor.BLACK ? 'black' : 'white')
        }
    }

    setIsSelected(isSelected: boolean) {
        this.isSelected = isSelected
        this.switchColor()
    }

    eatPiece() {
        this.isEaten = true
    }
}
