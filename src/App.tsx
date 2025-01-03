import './App.css'
import React, { Suspense, useEffect } from 'react'
import { Canvas, ThreeEvent, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ChessBoard } from './entities/chessboard'
import { Game } from './features/game'

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
const App: React.FC = () => {
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
                <Canvas camera={{ position: [-20, 30, 0] }} shadows>
                    <directionalLight position={[-2, 6, 5]} castShadow intensity={Math.PI * 1} />
                    <primitive object={gltf.scene} position={[15, 0, 0]} children-0-castShadow onClick={handleClick} />
                </Canvas>
            </Suspense>
        </div>
    )
}

export default App
