import { Piece } from "../piece";
import * as THREE from "three";

export interface PiecesInterface { black: { [key: string]: Piece }, white: { [key: string]: Piece } }

export interface CellInterface {
    [key: string]: {
        name: string;
        initialColor: string;
        isAllowed: boolean;
        object: THREE.Mesh
    },
}
