import { InitialCellsType } from "./types";

export const initialCells: InitialCellsType = {
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
