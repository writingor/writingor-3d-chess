import * as THREE from "three";
import { DimentionsType } from "./types";

const defaultPositions: { [key: string]: { [key: string]: string[] } } = {
  white: {
    king: ["e1"],
    queen: ["d1"],
    rook: ["a1", "h1"],
    bishop: ["c1", "f1"],
    knight: ["b1", "g1"],
    pawn: ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
  },
  black: {
    king: ["e8"],
    queen: ["d8"],
    rook: ["a8", "h8"],
    bishop: ["c8", "f8"],
    knight: ["b8", "g8"],
    pawn: ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
  },
};

export class Piece {
  type: string;
  name: string;
  cell: string;
  isSelected: boolean;
  color: string;
  weight: number;
  isEaten: boolean;
  object: THREE.Group | THREE.Mesh | null;

  constructor(
    type: string,
    name: string,
    cell: string,
    position: { x: number; y: number; z: number },
    color: string,
    weight: number,
    isSelected: boolean = false,
    isEaten: boolean = false,
    object: THREE.Group | THREE.Mesh | null = null,
  ) {
    this.type = type;
    this.name = name;
    this.cell = cell;
    this.color = color;
    this.weight = weight;
    this.isSelected = isSelected;
    this.isEaten = isEaten;
    this.object = object;
  }

  setCell(cell: string) {
    this.cell = cell;
  }

  setIsSelected(isSelected: boolean) {
    this.isSelected = isSelected;

    if (this.object && this.object instanceof THREE.Mesh) {
      if (
        isSelected &&
        this.object.material &&
        !Array.isArray(this.object.material)
      ) {
        this.object.material.color.set(0xff0000);
      } else {
        this.object.material.color.set(this.color);
      }
    }
  }

  setColor(newColor: string) {
    this.color = newColor;
  }

  eatPiece() {
    this.isEaten = true;
  }
}

export class PieceFactory {
  static create(
    type: "king" | "queen" | "rook" | "bishop" | "knight" | "pawn" = "pawn",
    color: "white" | "black" = "white",
    index: number = 1,
    object: THREE.Group | THREE.Mesh | null = null
  ): Piece {
    let name = `${color.charAt(0).toUpperCase() + color.slice(1)}${
      type.charAt(0).toUpperCase() + type.slice(1)
    }${index}`;

    let weight = 0

    switch (type) {
      case "king":
        weight = 100;
        break;
      case "queen":
        weight = 9;
        break;
      case "rook":
        weight = 5;
        break;
      case "bishop":
        weight = 3;
        break;
      case "knight":
        weight = 3;
        break;
      case "pawn":
        weight = 1;
        break;
    }

    let cell = defaultPositions[color][type];

    return new Piece(
      type,
      name,
      cell[index - 1],
      { x: 0, y: 0, z: 0 },
      color,
      weight,
      false,
      false,
      object,
    );
  }
}
