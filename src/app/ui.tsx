import './styles.css'
import React, { Suspense, useEffect } from 'react'
import { Canvas, ThreeEvent, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ChessBoard } from '@entities/chessboard'
import { Game } from '@features/game'
import EarnedWeightsWidget from '@widgets/chart/earnedWeights'

let wasInited = false

/**
 * Root
 * nececcary classes
 */
const chessBoard = new ChessBoard()
const game = new Game()

/**
 * App
 * @returns React Component
 */
export const App: React.FC = () => {
    /**
     * Load 3D scene
     */
    const gltf = useLoader(GLTFLoader, '/src/assets/objects/chess/board.glb')

    /**
     * Move Piece on board
     *
     * @param event ThreeJS Event Click
     */
    const handleClick = (event: ThreeEvent<PointerEvent>) => {
        game.play(event)
    }

    /**
     * Update
     * Game and ChessBoard
     * data
     */
    useEffect(() => {
        if (gltf && gltf.scene && !wasInited) {
            wasInited = true

            chessBoard.setScene(gltf.scene)

            if (chessBoard) {
                game.setChessBoard(chessBoard)
                chessBoard.fillChessBoard(gltf.scene)
                chessBoard.dispatchEventPiecesPlacedOnStart()
            }

            gltf.scene.rotation.set(0, 1.58, 0)
        }
    }, [gltf])

    /**
     * Render APP Component
     */
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Suspense>
                <Canvas camera={{ position: [-19, 30, 0] }}>
                    <directionalLight color={'#f2ffff'} position={[-1, 7, 3]} intensity={(Math.PI / 1.5) * 1} />
                    <directionalLight color={'#ff8f9a'} position={[5, -10, -13]} intensity={(Math.PI / 1.25) * 1} />
                    <directionalLight color={'#d6ffe9'} position={[15, 21, 10]} intensity={(Math.PI / 1.05) * 1} />
                    <primitive object={gltf.scene} position={[12, 0, 0]} onClick={handleClick} />
                </Canvas>
                <EarnedWeightsWidget />
            </Suspense>
        </div>
    )
}
