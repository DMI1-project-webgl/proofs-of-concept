import { Scene, WebGLRenderer, PerspectiveCamera, Vector2, Color, SphereGeometry, MeshBasicMaterial, Mesh } from 'three'
import MainFish from './MainFish'
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class MainScene {
    private canvas: HTMLCanvasElement
    private scene!: Scene
    private camera!: PerspectiveCamera
    private renderer!: WebGLRenderer
    private period: number
    private mainFish: MainFish
    private cursor: Cursor = { x: 0 , y: 0 }
    public sizes: Size
    private stats: Stats
    private controls!: OrbitControls

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas

        this.period = 10
        this.stats = Stats()
        document.body.appendChild(this.stats.dom)

        this.init()
        this.run()

        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        this.onMouseMove = this.onMouseMove.bind(this)
        window.addEventListener('pointermove', this.onMouseMove)
    }

    onMouseMove (event: MouseEvent) {
        this.cursor.x = event.clientX - (this.sizes.width * 0.5)
        this.cursor.y = event.clientY - (this.sizes.height * 0.5)
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

        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true

        this.scene.background = new Color(0xFFFFFF)

        this.camera.position.set(0, 0, 300)
        this.camera.lookAt(0, 0, 0)

        const geometry = new SphereGeometry( 150, 32, 16 );
        const material = new MeshBasicMaterial( { color: 0x00aaff } );
        const sphere = new Mesh( geometry, material );
        this.scene.add( sphere );

        this.mainFish = new MainFish(this.renderer, this.scene)
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

        this.stats.update()

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

        this.mainFish.render(this.cursor.x,this.cursor.y)

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


class Size {
    public width: number = 0
    public height: number = 0
}

class Cursor {
    public x: number = 0
    public y: number = 0
}

