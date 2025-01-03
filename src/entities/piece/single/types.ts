import * as THREE from "three";

// Enum for Piece Types
export enum PieceType {
  KING = "king",
  QUEEN = "queen",
  ROOK = "rook",
  BISHOP = "bishop",
  KNIGHT = "knight",
  PAWN = "pawn",
}

// Enum for Piece Colors
export enum PieceColor {
  WHITE = "white",
  BLACK = "black",
}

// Interface for the Piece Object
export interface IPiece {
  type: PieceType;
  name: string;
  cell: string;
  isSelected: boolean;
  color: PieceColor;
  object: THREE.Group | THREE.Mesh | null;
  isEaten: boolean;
}
