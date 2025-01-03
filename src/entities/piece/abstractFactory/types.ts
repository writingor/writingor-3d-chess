import * as THREE from "three";
import { IPiece } from "../single";

export interface IPiecesAbstractFactory {
    createPieceFrom3dObject: (object: THREE.Group | THREE.Mesh) => IPiece
}
