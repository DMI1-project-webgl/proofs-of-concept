import { Scene, WebGLRenderer, PerspectiveCamera, SphereGeometry, Mesh, MeshBasicMaterial, Raycaster, Vector2, Sphere, SpotLight, PointLight, AmbientLight, DirectionalLight, FogExp2, Color, Fog, SphereBufferGeometry, PointsMaterial, Points, TextureLoader } from 'three'
import { toHandlers } from 'vue'
import Seashell from './Seashell'
import MainSphere from './Sphere'

export default class MainScene {
    private canvas: HTMLCanvasElement
    private scene!: Scene
    private camera!: PerspectiveCamera
    private renderer!: WebGLRenderer
    private period: number
    private pointer: Vector2
    private raycaster: Raycaster
    private sphere!: MainSphere
    private object: Seashell

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas

        this.period = 10
        this.raycaster = new Raycaster();
        this.pointer = new Vector2();

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

        this.sphere = new MainSphere(this.scene);

        const light = new AmbientLight(0x1155ee)
        this.scene.add(light)

        const directionalLight = new DirectionalLight(0x000088, 0.9)
        this.scene.add(directionalLight)
        this.object = new Seashell(this.scene)

        this.scene.add(this.sphere.mesh)        

        // this.scene.add(this.sphere.childrens)
        this.onPointerMove = this.onPointerMove.bind(this)
        window.addEventListener( 'pointermove', this.onPointerMove );
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            const keyboardKey = e.key
            if (keyboardKey === 's') {
                console.log('touuuuuch')
            }
        }, false);
    }

    onPointerMove (e: MouseEvent) {
        this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	    this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
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

        //this.sphere.mesh.rotateY(0.001)
        //this.sphere.childrens.rotateY(0.001)

        this.growGrass()

        // Animation
        // Periodique time
        const tn = ((Date.now() * 0.001) % this.period) / this.period

        this.orbitObjects(tn)

        // Update ...
        if (this.resizeRendererToDisplaySize()) {
            const gl = this.renderer.getContext()
            const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight
            this.camera.aspect = aspect
            this.camera.updateProjectionMatrix()
        }

        // Render ...
        this.render()
    }


    orbitObjects(tn: number) {
        if (!this.object.group) return;
        const angle = (tn * 2 * Math.PI + Math.PI) % (2 * Math.PI)
        const radius = 7

        this.object.group.position.set(
            3 + radius * Math.cos(angle),
            1 * Math.sin(angle),
            radius * Math.sin(angle)
        )
    }

    growGrass() {
        this.raycaster.setFromCamera( this.pointer, this.camera );
        const intersects = this.raycaster.intersectObjects(this.sphere.childrensArray, false);

        for ( let i = 0; i < intersects.length; i ++ ) {
            intersects[ i ].object.scale.set(0.001, 0.001, Math.min(0.015, intersects[ i ].object.scale.z + 0.0015));
        }
    }

    // Memory management
    destroy() {
        this.canvas = null 

        this.scene = null
        this.camera = null
        this.renderer = null
    }
}