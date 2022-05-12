import { Scene, WebGLRenderer, PerspectiveCamera, Mesh,BoxGeometry, MeshBasicMaterial, Vector3, Points } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class MainScene {
    private canvas: HTMLCanvasElement
    private scene!: Scene
    private camera!: PerspectiveCamera
    private renderer!: WebGLRenderer
    private period: number
    private mesh!: Mesh
    private controls!: OrbitControls
    private points!: Array<any>

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

        this.mesh = new Mesh(
            new BoxGeometry(1, 1, 1, 5, 5, 5),
            new MeshBasicMaterial({ color: 0xff0000 })
        )
        this.scene.add(this.mesh)

        this.camera = new PerspectiveCamera(75, aspect, 1.0, 1000)

        this.camera.position.set(0, 0, 3)
        this.camera.lookAt(0, 0, 0)

        // Controls
        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true

        this.points = [{
                position : new Vector3(0.0, 0.0, 0.0),
                element : document.querySelector('.point-0')
            }]
        
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

        // Update controls
        this.controls.update()

        // Go through each point
        for(const point of this.points)
        {
            const screenPosition = point.position.clone()
            screenPosition.project(this.camera)

            const translateX = (screenPosition.x * this.canvas.clientWidth * 0.5)
            const translateY = -screenPosition.y * this.canvas.clientHeight * 0.5
            //transform: translateX(11.1454px) translateY(-18.9525px);
            console.log(translateX)
            console.log(translateY)
            point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
        }


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