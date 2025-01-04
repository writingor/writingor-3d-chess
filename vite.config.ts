import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ mode }) => {
    return {
        plugins: [
            react(),
            viteStaticCopy({
                targets: [
                    {
                        src: 'src/assets/objects/chess/*.glb',
                        dest: 'assets/objects/chess'
                    }
                ]
            })
        ],
        base: mode === 'development' ? './' : '/writingor-3d-chess/',
        build: {
            outDir: 'docs',
            rollupOptions: {
                input: '/index.html'
            }
        },
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
