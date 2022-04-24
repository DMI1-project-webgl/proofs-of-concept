import { Scene, WebGLRenderer, PerspectiveCamera, Vector2 } from 'three'

export default class MainScene {
    private canvas: HTMLCanvasElement
    private scene!: Scene
    private camera!: PerspectiveCamera
    private renderer!: WebGLRenderer
    private period: number

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas

        this.period = 10

        this.init()
        this.run()
    }

    // Initialization
    init() {
        this.renderer = new WebGLRenderer({
            canvas: this.canvas
        })

        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))

        const gl = this.renderer.getContext()
        const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight

        this.scene = new Scene()
        this.camera = new PerspectiveCamera(90, aspect, 0.01, 1000)

        this.camera.position.set(0, 0, 10)
        this.camera.lookAt(0, 0, 0)
    }
    
    // Run app, load things, add listeners, ...
    run() {
        this.renderer.render(this.scene, this.camera)
        this.animate()
    }

    resizeRendererToDisplaySize() {
        const width = this.canvas.clientWidth
        const height = this.canvas.clientHeight
        const needResize = this.canvas.width !== width || this.canvas.height !== height
        if (needResize) {
            this.renderer.setSize(width, height, false)
        }
        return needResize
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this))

        // Update ...
        if (this.resizeRendererToDisplaySize()) {
            const gl = this.renderer.getContext()
            const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight
            this.camera.aspect = aspect
            this.camera.updateProjectionMatrix()
        }

        // Animation
        // Periodique time
        const tn = ((Date.now() * 0.001) % this.period) / this.period

        // Render ...
        this.render()
    }

    // Memory management
    destroy() {
        this.canvas = null 

        this.scene = null
        this.camera = null
        this.renderer = null
    }
}