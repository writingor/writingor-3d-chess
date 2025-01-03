import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { ChessBoard } from "@entities/chessboard";
import { Chess } from 'chess.js';
import { IPiece } from "@entities/piece/single/types";

const chess = new Chess();

export class Game {
  chessBoard: ChessBoard | null;

  constructor(chessBoard: ChessBoard | null = null) {
    this.chessBoard = chessBoard;
  }

  setChessBoard(chessBoard: ChessBoard) {
    this.chessBoard = chessBoard;
    
    window.addEventListener('PicesPlacedOnStart', () => {
      if (!this.chessBoard) return
      chess.load(this.chessBoard.getFEN())
    })
  }

  // Function to get computer move using Stockfish API
  async computerMove() {
    const fen = chess.fen();
    const move = await this.getBestMove(fen);

    if (move) {
      const from = move?.slice(0, 2),
        to = move?.slice(-2)

      const cell = this.chessBoard?.scene?.getObjectByName(to)
      this.eatPiece(to)
      
      if (cell) {
        const piece = this.chessBoard?.getPieceByCell(from)
      
        piece?.object?.position.set(
          cell.position.x,
          cell.position.y,
          cell.position.z
        );

        piece?.setCell(to)

      }

      chess.move({from, to});

      if (chess.isGameOver()) {
        console.log("Game over!");
      }
    }
  }

  async getBestMove(fen: string): Promise<string | null> {
    const response = await fetch('http://ws.chess-api.online/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fen: fen,
        depth: 10,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.bestMove
    } else {
      return null;
    }
  }

  getAvailableMoves(piece: IPiece) {
    const moves = chess.moves({ verbose: true });
  
    const validMoves = moves.filter(move => move.from === piece.cell);
    
    return validMoves.map(move => move.to);
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
  delayAfterClick() {
    setTimeout(() => {
      this.chessBoard?.setIsFirstObjectFound(false);
    }, 100);
  }

  highlightMoves() {
    if (!this.chessBoard) return
    this.chessBoard.highlightCells(this.getAvailableMoves(this.chessBoard.getSelectedPiece()))
  }

  /**
   * Select current Piece
   *
   * @param object
   * @returns
   */
  selectPiece(object: THREE.Group | THREE.Mesh) {
    if (!this.chessBoard) return;

    this.chessBoard.unselectPieces();

    const piece = this.chessBoard.getPieceByObject(object);
    if (!piece || piece.color === 'black') return

    this.chessBoard.setIsFirstObjectFound(true);
    
    piece.setIsSelected(true);
    this.chessBoard.setSelectedPieceUUID(object.uuid);

    this.highlightMoves();
    this.delayAfterClick();
  }

  eatPiece(cellName: string) {
    if (!this.chessBoard) return

    const pieceOnCell = this.chessBoard.getPieceByCell(cellName)

    if (pieceOnCell) {
      pieceOnCell.eatPiece()
      this.chessBoard.removePiece(pieceOnCell.object)
    }
  }

  /**
   * Move piece to selected cell
   *
   * @param object
   * @returns
   */
  async movePiece(object: THREE.Group | THREE.Mesh) {
    if (!this.chessBoard) return;

    let cell = this.chessBoard.cells[object.name]

    if (!this.chessBoard.cells[object.name] || !cell.isAllowed) return

    this.chessBoard.setIsFirstObjectFound(true);

    if (this.chessBoard.selectedPieceUUID) {

      const piece = this.chessBoard.getPieceByUUID(
        this.chessBoard.selectedPieceUUID
      );

      if (piece) {
        this.eatPiece(object.name)

        chess.move({from: piece.cell, to: object.name});
        
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


        piece.setCell(object.name);
        piece.setIsSelected(false);
        this.chessBoard.setSelectedPieceUUID("");

        this.chessBoard.unselectCells()

        if (chess.isGameOver()) {
          console.log("Game over!");
        } else {
          await this.computerMove();
        }
      }
    }

    this.delayAfterClick();
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
      chess.isGameOver() ||
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
