import { IPiece } from "../piece";
import * as THREE from "three";

export interface PiecesInterface { black: { [key: string]: IPiece }, white: { [key: string]: IPiece } }

export interface CellInterface {
    [key: string]: {
        name: string;
        initialColor: string;
        isAllowed: boolean;
        object: THREE.Mesh
    },
}
