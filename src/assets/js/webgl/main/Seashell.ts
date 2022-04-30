import type { Scene, SphereGeometry, Mesh, MeshBasicMaterial, Group, Object3D } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class Seashell {
    private loader!: GLTFLoader
    private scene!: Scene
    public group: Group

    constructor(scene: Scene) {
        this.scene = scene
        this.init()
    }

    // Initialization
    init() {
        this.loader = new GLTFLoader();
        this.loader.load('src/assets/js/webgl/models/seashell.glb', (gltf) => {
            const model = gltf.scene;
            this.initChild(model)
        } );
    }

    initChild(model: Group) {
        this.group = model
        model.position.set(8, 0, 0)
        model.scale.set(0.05,0.05,0.05)

        this.scene.add(model)
    }

    // Memory management
    destroy() {
        
    }
}