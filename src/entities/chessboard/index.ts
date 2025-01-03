import { PieceFactory, Piece } from "../piece";
import * as THREE from "three";
import { PiecesInterface } from "./types";

const defaultPieces: PiecesInterface = {
    black: {},
    white: {},
};

export class ChessBoard {
  scene: THREE.Group | null;
  cells: THREE.Mesh[];
  pieces: PiecesInterface;
  selectedPieceUUID: string;
  isFirstObjectFound: boolean;

  constructor(
    scene: THREE.Group | null = null,
    cells: THREE.Mesh[] = [],
    pieces: PiecesInterface = defaultPieces,
    selectedPieceUUID: string = '',
    isFirstObjectFound: boolean = false
    ) {
    this.pieces = pieces;
    this.cells = cells;
    this.scene = scene;
    this.selectedPieceUUID = selectedPieceUUID
    this.isFirstObjectFound = isFirstObjectFound
  }

  setScene = (scene: THREE.Group | null) => {
    this.scene = scene;
  };

  setIsFirstObjectFound = (isFirstObjectFound: boolean) => {
    this.isFirstObjectFound = isFirstObjectFound;
  };

  setSelectedPieceUUID = (selectedPieceUUID: string) => {
    this.selectedPieceUUID = selectedPieceUUID;
  };

  getPieceByUUID = (uuid: string) => {
    let found: Piece | null = null;

    for (let color of ["white", "black"] as ("white" | "black")[]) {
      for (let pieceKey in this.pieces[color]) {
        let piece = this.pieces[color][pieceKey];

        if (piece.object && piece.object.uuid === uuid) {
          found = piece;
          break;
        }
      }

      if (found) break;
    }

    return found;
  };

  getPieceByObject = (object: THREE.Group | THREE.Mesh) => {
    let found: Piece | null = null;

    for (let color of ["white", "black"] as ("white" | "black")[]) {
      for (let pieceKey in this.pieces[color]) {
        let piece = this.pieces[color][pieceKey];

        if (piece.object === object) {
          found = piece;
          break;
        }
      }

      if (found) break;
    }

    return found;
  };

  movePieceToRoot = (object: THREE.Group | THREE.Mesh) => {
    setTimeout(() => {
        if (this.scene) {
            this.scene.getObjectByProperty("name", "Grid")?.add(object);

            let cell = this.scene.getObjectByProperty("name", this.getPieceByObject(object)?.cell);

            if (cell) {
                object.position.set(cell.position.x, cell.position.y, cell.position.z);
            }
        }
    }, 200);
  };

  unselectPieces = () => {
    for (let color of ["white", "black"] as ("white" | "black")[]) {
      for (let pieceKey in this.pieces[color]) {
        let piece = this.pieces[color][pieceKey];

        if (piece.isSelected) {
          piece.setIsSelected(false);
        }
      }
    }
  };

  createCells = (object: THREE.Group | THREE.Mesh) => {
    if (!(object instanceof THREE.Mesh)) return

    if (object.isMesh && object.geometry) {
      // Ensure the bounding box is computed
      object.geometry.computeBoundingBox();
      const boundingBox = object.geometry.boundingBox;
      if (boundingBox) {
        const width = boundingBox.max.x - boundingBox.min.x;
        const depth = boundingBox.max.z - boundingBox.min.z;

        // Determine the size of each square based on the width and depth
        const squareSize = Math.min(width, depth) / 8; // 8x8 grid, so divide by 8

        const squares: THREE.Mesh[] = [];
        const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8];

        // Create the squares as 3D meshes and add them to the array
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const xPos = (col - 3.5) * squareSize; // Center the grid on the X-axis
            const zPos = (3.5 - row) * squareSize; // Center the grid on the Z-axis

            // Determine the color based on row and column (alternate squares)
            const isBlack = (row + col) % 2 === 0;

            const squareName = `${letters[col]}${numbers[7 - row]}`;

            // Create a 3D square using THREE.BoxGeometry
            const geometry = new THREE.BoxGeometry(squareSize, 0.1, squareSize);
            const material = new THREE.MeshBasicMaterial({
              color: isBlack ? "black" : "white",
            });
            const square = new THREE.Mesh(geometry, material);

            square.position.set(xPos, 0, zPos); // Set the position of each square
            square.name = squareName;

            squares.push(square); // Add the square mesh to the array
          }
        }

        squares?.forEach((i: THREE.Mesh) => {
            object.add(i);
            this.cells.push(i)
        });
      }
    }
  };

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
            object.material =
                Array.isArray(object.material)
                    ? object.material.map(material => material.clone())
                    : object.material.clone()
        }
    }

    /**
     * Switch by
     * model.glb object names
     */
    switch (object.name) {
      // white
      case "WhiteKing1":
        this.pieces.white.king = PieceFactory.create(
          "king",
          "white",
          1,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "WhiteQueen1":
        this.pieces.white.queen = PieceFactory.create(
          "queen",
          "white",
          1,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "WhiteRook1":
        this.pieces.white.rook1 = PieceFactory.create(
          "rook",
          "white",
          1,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "WhiteRook2":
        this.pieces.white.rook2 = PieceFactory.create(
          "rook",
          "white",
          2,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "WhiteKnight1":
        this.pieces.white.knight1 = PieceFactory.create(
          "knight",
          "white",
          1,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "WhiteKnight2":
        this.pieces.white.knight2 = PieceFactory.create(
          "knight",
          "white",
          2,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "WhiteBishop1":
        this.pieces.white.bishop1 = PieceFactory.create(
          "bishop",
          "white",
          1,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "WhiteBishop2":
        this.pieces.white.bishop2 = PieceFactory.create(
          "bishop",
          "white",
          2,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "WhitePawn1":
        this.pieces.white.pawn1 = PieceFactory.create(
          "pawn",
          "white",
          1,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "WhitePawn2":
        this.pieces.white.pawn2 = PieceFactory.create(
          "pawn",
          "white",
          2,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "WhitePawn3":
        this.pieces.white.pawn3 = PieceFactory.create(
          "pawn",
          "white",
          3,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "WhitePawn4":
        this.pieces.white.pawn4 = PieceFactory.create(
          "pawn",
          "white",
          4,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "WhitePawn5":
        this.pieces.white.pawn5 = PieceFactory.create(
          "pawn",
          "white",
          5,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "WhitePawn6":
        this.pieces.white.pawn6 = PieceFactory.create(
          "pawn",
          "white",
          6,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "WhitePawn7":
        this.pieces.white.pawn7 = PieceFactory.create(
          "pawn",
          "white",
          7,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "WhitePawn8":
        this.pieces.white.pawn8 = PieceFactory.create(
          "pawn",
          "white",
          8,
          object
        );
        this.movePieceToRoot(object);
        break;

      // black
      case "BlackKing1":
        this.pieces.black.king = PieceFactory.create(
          "king",
          "black",
          1,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "BlackQueen1":
        this.pieces.black.queen = PieceFactory.create(
          "queen",
          "black",
          1,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "BlackRook1":
        this.pieces.black.rook1 = PieceFactory.create(
          "rook",
          "black",
          1,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "BlackRook2":
        this.pieces.black.rook2 = PieceFactory.create(
          "rook",
          "black",
          2,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "BlackKnight1":
        this.pieces.black.knight1 = PieceFactory.create(
          "knight",
          "black",
          1,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "BlackKnight2":
        this.pieces.black.knight2 = PieceFactory.create(
          "knight",
          "black",
          2,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "BlackBishop1":
        this.pieces.black.bishop1 = PieceFactory.create(
          "bishop",
          "black",
          1,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "BlackBishop2":
        this.pieces.black.bishop2 = PieceFactory.create(
          "bishop",
          "black",
          2,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "BlackPawn1":
        this.pieces.black.pawn1 = PieceFactory.create(
          "pawn",
          "black",
          1,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "BlackPawn2":
        this.pieces.black.pawn2 = PieceFactory.create(
          "pawn",
          "black",
          2,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "BlackPawn3":
        this.pieces.black.pawn3 = PieceFactory.create(
          "pawn",
          "black",
          3,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "BlackPawn4":
        this.pieces.black.pawn4 = PieceFactory.create(
          "pawn",
          "black",
          4,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "BlackPawn5":
        this.pieces.black.pawn5 = PieceFactory.create(
          "pawn",
          "black",
          5,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "BlackPawn6":
        this.pieces.black.pawn6 = PieceFactory.create(
          "pawn",
          "black",
          6,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "BlackPawn7":
        this.pieces.black.pawn7 = PieceFactory.create(
          "pawn",
          "black",
          7,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "BlackPawn8":
        this.pieces.black.pawn8 = PieceFactory.create(
          "pawn",
          "black",
          8,
          object
        );
        this.movePieceToRoot(object);
        break;

      case "Grid":
        this.createCells(object);
        break;

      default:
        break;
    }

    /**
     * Repeact for childrens
     */
    object.children.forEach((child: any) => {
      this.fillChessBoard(child);
    });
  };
}
