import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
    return {
        plugins: [react()],
        base: mode === 'development' ? './' : '/writingor-3d-chess/',
        build: {
            outDir: 'docs'
        },
        assetsInclude: ['**/*.glb'],
        resolve: {
            alias: {
                '@app': path.resolve(__dirname, './src/app'),
                '@features': path.resolve(__dirname, './src/features'),
                '@widgets': path.resolve(__dirname, './src/widgets'),
                '@entities': path.resolve(__dirname, './src/entities'),
                '@shared': path.resolve(__dirname, './src/shared')
            }
        }
    }
})
