import { Scene, WebGLRenderer, PerspectiveCamera, Mesh, Raycaster, Vector2, Vector3, AmbientLight, DirectionalLight, Color, ShaderMaterial, SphereGeometry, MeshBasicMaterial, DoubleSide } from 'three'

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

        this.scene.background = new Color( 0x0085DE )
        
        this.camera.position.set(0, 0, 10)
        this.camera.lookAt(0, 0, 0)

        this.sphere = new MainSphere(this.scene);

        const light = new AmbientLight(0x1155ee)
        this.scene.add(light)

        const directionalLight = new DirectionalLight(0x000088, 0.9)
        this.scene.add(directionalLight)

        this.scene.add(this.sphere.mesh)
        this.addPollutionSmog()      

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

        this.growGrass()

        // Animation
        // Periodique time
        const tn = ((Date.now() * 0.001) % this.period) / this.period

        this.sphere.mesh.rotateY(0.001)
        this.sphere.childrens.rotateY(0.001)

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

    addPollutionSmog() { 
            var vertexShader = [
                'varying vec3 vNormal;',
                'varying vec3 vWorldPosition;',
                
                'void main(){',
                    '// compute intensity',
                    'vNormal = normalize( normalMatrix * normal );',
        
                    'vec4 worldPosition	= modelMatrix * vec4( position, 1.0 );',
                    'vWorldPosition	= worldPosition.xyz;',
        
                    '// set gl_Position',
                    'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
                '}',
            ].join('\n')
            var fragmentShader = [
                'varying vec3	vNormal;',
                'varying vec3	vWorldPosition;',
        
                'uniform vec3   lightColor;',
        
                'uniform vec3	spotPosition;',
        
                'uniform float	attenuation;',
                'uniform float	anglePower;',
        
                'void main(){',
                    'float intensity;',
        
                    //////////////////////////////////////////////////////////
                    // distance attenuation					//
                    //////////////////////////////////////////////////////////
                    'intensity = distance(vWorldPosition, spotPosition);',
                    'intensity = 1.0 - clamp(intensity, 0.0, 1.0);',
        
                    //////////////////////////////////////////////////////////
                    // intensity on angle					//
                    //////////////////////////////////////////////////////////
                    'vec3 normal = vec3(vNormal.x, vNormal.y, abs(vNormal.z));',
                    'float angleIntensity	= pow( dot(normal, vec3(0.0, 0.0, 1.0)), anglePower );',
                    'intensity = intensity * angleIntensity;',
        
                    //////////////////////////////////////////////////////////
                    // final color						//
                    //////////////////////////////////////////////////////////
        
                    // set the final color
                    'gl_FragColor	= vec4( lightColor, angleIntensity / attenuation) ;',
                '}',
            ].join('\n')
        
            // create custom material from the shader code above
            //   that is within specially labeled script tags
            var material = new ShaderMaterial({
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                uniforms: { 
                    attenuation: {
                        value: 1.15
                    },
                    anglePower: {
                        value: 16
                    },
                    spotPosition: {
                        value: new Vector3(0, 0, 0)
                    },
                    lightColor: {
                        value: new Color(0xCAC92B)
                    },
                },
                side: DoubleSide,
                // blending	: THREE.AdditiveBlending,
                transparent: true,
                depthWrite: false,
            });
            const basicMaterial = new MeshBasicMaterial({
                color: 0xff0000
            })
            const geometry = new SphereGeometry(8, 40, 40)
            const mesh = new Mesh(geometry, material)
            this.scene.add(mesh)
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