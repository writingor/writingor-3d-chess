import * as THREE from "three";
import { Piece } from "../single";
import { PieceType, PieceColor } from "../single/types";
import { initialCells } from "@shared/configs/pieces/initialCells";
import { createPieceName } from "../single/utils";

export class PieceFactory {
  static create(
    type: PieceType,
    color: PieceColor,
    index: number = 1,
    object: THREE.Group | THREE.Mesh
  ): Piece {
    let name = createPieceName(color, type, index)
    let cell = initialCells[color][type];

    return new Piece(type, name, cell[index - 1], color, object, false, false);
  }
}
