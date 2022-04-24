import type { GeometryBox } from 'csstype'
import { Scene, BoxGeometry, CircleGeometry, WebGLRenderer, PerspectiveCamera, BufferAttribute, InterleavedBufferAttribute, SphereGeometry, Mesh, MeshBasicMaterial, Raycaster, Vector2, Vector3, Group, Color, Object3D } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class Sphere {
    public mesh!: Mesh
    public childrens!: Group
    public childrensArray!: Array<Mesh | Object3D>
    private geometry!: SphereGeometry
    private material!: MeshBasicMaterial
    private positions!: BufferAttribute | InterleavedBufferAttribute
    private normals!: BufferAttribute | InterleavedBufferAttribute
    private loader!: GLTFLoader
    private scene!: Scene

    constructor(scene: Scene) {
        this.init()
        this.scene = scene
        // this.initChild()
    }

    // Initialization
    init() {
        this.geometry = new SphereGeometry( 5, 40, 28 );
        this.positions = this.geometry.getAttribute('position')
        this.normals = this.geometry.getAttribute('normal')
        this.material = new MeshBasicMaterial( { color: 0x000099, visible: true } );
        this.mesh = new Mesh(this.geometry,this.material);
        this.childrens = new Group();
        this.childrensArray = []
        this.loader = new GLTFLoader();
        this.loader.load('src/assets/js/webgl/models/grass2.glb', (gltf) => {
            const model = gltf.scene;
            // console.log(gltf)
            // model.position.set(0,0,8)
            // model.lookAt(0,1,0)
            // model.scale.set(2, 2, 2)
            // const material = new MeshBasicMaterial( { color: 0xff0000, visible: false } );
            // const mesh = new Mesh(scene, material)
            // this.scene.add(model)
            this.initChild(model)
        } );
    }

    initChild(model: Group) {
        for(let i = 0; i < this.getVertexCount(); i++) {
            // const geometry = new CircleGeometry( 0.5, 8 );
            // const material = new MeshBasicMaterial( {color: new Color(1, 0, 0)} );
            // const cube = new Mesh( geometry, material );
            const modelClone = model.clone() 
            const position = this.getVertexPosition(i)
            modelClone.position.set(
                position.x,
                position.y,
                position.z
            )
            modelClone.scale.set(1.5,1.5,0.1)
            const nomalEnd = this.getVertexNormal(i)
            modelClone.lookAt(nomalEnd.x * 10, nomalEnd.y * 10, nomalEnd.z * 10)
            // model.rotateX(0.5)
            // this.scene.add(modelClone)
            this.childrens.add(modelClone)
            // this.childrensArray.push(modelClone)
            modelClone.children.forEach((child) => {
            //     this.childrens.add(child)
                this.childrensArray.push(child)
            })
        }

        this.scene.add(this.childrens)
    }

    getVertexPosition(index: number): Vector3 {
        return new Vector3(
            this.positions.array[index * 3 + 0],
            this.positions.array[index * 3 + 1],
            this.positions.array[index * 3 + 2],
        )
    }

    getVertexCount() : number {
        return this.positions.count
    }

    getVertexNormal(index: number): Vector3 {
        return new Vector3(
            this.normals.array[index * 3 + 0],
            this.normals.array[index * 3 + 1],
            this.normals.array[index * 3 + 2],
        )
    }

    // Memory management
    destroy() {
    }
}