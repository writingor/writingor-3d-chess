import * as THREE from 'three'
import { IPiece } from './types'
import { PlayerColor } from '@shared/configs/player/color'
import { PieceType } from '@shared/configs/pieces/types'
import { TCellName } from '@shared/types/cell'

export abstract class Piece implements IPiece {
    type: PieceType
    name: string
    cell: string
    isSelected: boolean
    color: PlayerColor
    isEaten: boolean
    object: THREE.Group | THREE.Mesh

    constructor(
        type: PieceType,
        name: string,
        cell: string,
        color: PlayerColor,
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

    setCell(cell: TCellName) {
        this.cell = cell
    }

    /**
     * The function `switchColor` changes the color of a THREE.Mesh object based on whether it is
     * selected or not.
     */
    switchColor(): void {
        if (this.object && this.object instanceof THREE.Mesh) {
            const material = this.object.material as THREE.MeshBasicMaterial
            material.color.set(this.isSelected ? '#8aa5ff' : this.color)
        }
    }

    /**
     * The function `setIsSelected` sets the `isSelected` property and then calls the `switchColor`
     * method.
     * @param {boolean} isSelected
     */
    setIsSelected(isSelected: boolean) {
        this.isSelected = isSelected
        this.switchColor()
    }

    setIsEaten(value: boolean = true) {
        this.isEaten = value
    }
}
