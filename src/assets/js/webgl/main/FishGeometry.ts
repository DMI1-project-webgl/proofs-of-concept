import { BufferAttribute, BufferGeometry, Color } from "three";

export default class FishGeometry extends BufferGeometry {

    private WIDTH: number = 32
    private FISHS: number
    private trianglesPerFish: number = 3
    private triangles: number
    private points: number
    private vertices: BufferAttribute
    private fishColors: BufferAttribute
    private references: BufferAttribute
    private fishVertex: BufferAttribute

    constructor(WIDTH: number) {

        super();

        this.WIDTH = WIDTH

        this.FISHS = this.WIDTH * this.WIDTH
        this.triangles = this.FISHS * this.trianglesPerFish;
        this.points = this.triangles * 3;

        this.vertices = new BufferAttribute( new Float32Array(this.points * 3), 3 );
        this.fishColors = new BufferAttribute( new Float32Array( this.points * 3 ), 3 );
        this.references = new BufferAttribute( new Float32Array( this.points * 2 ), 2 );
        this.fishVertex = new BufferAttribute( new Float32Array( this.points ), 1 );

        this.setAttribute( 'position', this.vertices );
        this.setAttribute( 'birdColor', this.fishColors );
        this.setAttribute( 'reference', this.references );
        this.setAttribute( 'birdVertex', this.fishVertex );

        // this.setAttribute( 'normal', new Float32Array( points * 3 ), 3 );


        let v = 0;

        const wingsSpan = 20;

        for ( let f = 0; f < this.FISHS; f ++ ) {

            // Body

            this.verts_push([
                0, - 0, - 20,
                0, 4, - 20,
                0, 0, 30
            ]);

            // Wings

            this.verts_push([
                0, 0, - 15,
                - wingsSpan, 0, 0,
                0, 0, 15
            ]);

            this.verts_push([
                0, 0, 15,
                wingsSpan, 0, 0,
                0, 0, - 15
            ]);

        }

        for ( let v = 0; v < this.triangles * 3; v ++ ) {

            const triangleIndex = ~ ~ ( v / 3 );
            const fishIndex = ~ ~ ( triangleIndex / this.trianglesPerFish );
            const x = ( fishIndex % this.WIDTH ) / this.WIDTH;
            const y = ~ ~ ( fishIndex / this.WIDTH ) / this.WIDTH;

            const c = new Color(
                0x444444 +
                ~ ~ ( v / 9 ) / this.FISHS * 0x666666
            );

            this.fishColors.setXYZ(v, c.r, c.g, c.b)

            this.references.setXY(v, x, y)

            this.fishVertex.setX(v, v % 9)

        }

        this.scale( 0.2, 0.2, 0.2 );

    }

    verts_push (pos: number[]) {

        for ( let i = 0; i < pos.length; i+=3 ) {

            this.vertices.setXYZ(i, pos[ i ], pos[i + 1], pos[ i + 2]);

        }

    }

}