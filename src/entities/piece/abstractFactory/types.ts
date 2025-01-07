import * as THREE from 'three'
import { Piece } from '../single'

export interface IPiecesAbstractFactory {
    createPieceFrom3dObject: (object: THREE.Group | THREE.Mesh) => Piece
}
