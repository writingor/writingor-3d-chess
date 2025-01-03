import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { ChessBoard } from "../../entities/chessboard";

export class Game {
  chessBoard: ChessBoard | null;

  constructor(chessBoard: ChessBoard | null = null) {
    this.chessBoard = chessBoard;
  }

  setChessBoard(chessBoard: ChessBoard) {
    this.chessBoard = chessBoard;
  }

  /**
   * Delay to prevent simultaneous selection of multiple objects in Three.js click event.
   *
   * When clicking on objects in Three.js, if there's no delay, all objects in the vector
   * might be selected at once. This delay helps ensure that the first object selection is
   * processed before any further interactions can occur.
   *
   * The delay is set to 100ms to allow processing of the first object before resetting the
   * `isFirstObjectFound` flag.
   */
  delayAfterMatch() {
    setTimeout(() => {
      this.chessBoard?.setIsFirstObjectFound(false);
    }, 100);
  }

  /**
   * Select current Piece
   *
   * @param object
   * @returns
   */
  selectPiece(object: THREE.Group | THREE.Mesh) {
    if (!this.chessBoard) return;

    this.chessBoard.setIsFirstObjectFound(true);

    this.chessBoard.unselectPieces();
    const piece = this.chessBoard.getPieceByObject(object);

    if (piece) {
      piece.setIsSelected(true);
    }

    this.chessBoard.setSelectedPieceUUID(object.uuid);

    this.delayAfterMatch();
  }

  /**
   * Move piece to selected cell
   *
   * @param object
   * @returns
   */
  movePiece(object: THREE.Group | THREE.Mesh) {
    if (!this.chessBoard) return;

    this.chessBoard.setIsFirstObjectFound(true);

    if (this.chessBoard.selectedPieceUUID) {
      const figure = this.chessBoard.scene?.getObjectByProperty(
        "uuid",
        this.chessBoard.selectedPieceUUID
      );

      if (figure) {
        figure.position.set(
          object.position.x,
          object.position.y,
          object.position.z
        );
      }

      const piece = this.chessBoard.getPieceByUUID(
        this.chessBoard.selectedPieceUUID
      );

      if (piece) {
        piece.setCell(object.name);
        piece.setPosition({
          x: object.position.x,
          y: object.position.y,
          z: object.position.z,
        });
        piece.setIsSelected(false);
        this.chessBoard.setSelectedPieceUUID("");
      }
    }

    this.delayAfterMatch();
  }

  /**
   * Select Piece
   * and move it on selected cell
   *
   * @param event THREE JS Click event
   * @returns no value
   */
  play = (event: ThreeEvent<PointerEvent>) => {
    if (
      !this.chessBoard ||
      this.chessBoard.isFirstObjectFound ||
      !(
        event.object instanceof THREE.Mesh ||
        event.object instanceof THREE.Group
      )
    ) {
      return;
    }

    if (this.chessBoard.getPieceByObject(event.object)) {
      this.selectPiece(event.object);
      
    } else if (event.object?.parent?.name === "Grid") {
      this.movePiece(event.object);
    }
  };
}
