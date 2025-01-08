import './styles.css'
import React, { Suspense } from 'react'
import { Canvas, ThreeEvent, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ChessBoard } from '@entities/chessboard'
import { Game } from '@features/game'
import { EarnedWeightsWidget } from '@widgets/chart/earnedWeights'

export const App: React.FC = () => {
    /**
     * Necessary instances
     */
    const isDev = import.meta.env.MODE === 'development'
    const gltfPath = '/assets/objects/chess/board.glb'
    const gltf = useLoader(GLTFLoader, isDev ? `/src${gltfPath}` : `/writingor-3d-chess${gltfPath}`)
    const game = new Game(new ChessBoard(gltf.scene))

    game.init()

    function playGame(event: ThreeEvent<PointerEvent>) {
        game.play(event)
    }

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Suspense>
                <Canvas camera={{ position: [-19, 30, 0] }}>
                    <directionalLight color={'#f2ffff'} position={[-1, 7, 3]} intensity={(Math.PI / 1.5) * 1} />
                    <directionalLight color={'#ff8f9a'} position={[5, -10, -13]} intensity={(Math.PI / 1.25) * 1} />
                    <directionalLight color={'#d6ffe9'} position={[15, 21, 10]} intensity={(Math.PI / 1.05) * 1} />
                    <primitive object={gltf.scene} position={[12, 0, 0]} onClick={playGame} />
                </Canvas>
                <EarnedWeightsWidget players={game.getPlayers()} />
            </Suspense>
        </div>
    )
}
