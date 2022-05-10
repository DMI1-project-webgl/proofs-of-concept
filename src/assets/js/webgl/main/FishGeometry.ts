import { BufferAttribute, BufferGeometry, Color } from "three";

export default class FishGeometry extends BufferGeometry {

    private WIDTH: number
    private FISHS: number
    private trianglesPerFish: number = 11
    private triangles: number
    private points: number
    private v: number = 0
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


        const wingsSpan = 15;

        for ( let f = 0; f < this.FISHS; f ++ ) {

            // Body

            /* this.verts_push([
                0, - 0, - 20,
                0, 4, - 20,
                0, 0, 30
            ]); */

            this.verts_push([
                0, 0, 24,
                10, 0, 12,
                0, 6, 12
            ]);

            this.verts_push([
                0, 0, 24,
                0, -6, 12,
                10, 0, 12
            ]);

            this.verts_push([
                0, 0, 24,
                -6, 0, 12,
                0, -6, 12
            ]);

            this.verts_push([
                0, 0, 24,
                0, 6, 12,
                -6, 0, 12
            ]);



            this.verts_push([
                0, 0, -12,
                0, 6, 12,
                10, 0, 12
            ]);

            this.verts_push([
                0, 0, -12,
                10, 0, 12,
                0, -6, 12
            ]);

            this.verts_push([
                0, 0, -12,
                0, -6, 12,
                -6, 0, 12
            ]);

            this.verts_push([
                0, 0, -12,
                -6, 0, 12,
                0, 6, 12
            ]);
            


            // Wings

            // this.verts_push([
            //     0, 0, - 15,
            //     - wingsSpan, 0, 0,
            //     0, 0, 15
            // ]);

            // this.verts_push([
            //     0, 0, 15,
            //     wingsSpan, 0, 0,
            //     0, 0, - 15
            // ]);

            this.verts_push([
                0, 2, 10,
                3, - 5, 4,
                -3, - 9, 4
            ]);

            this.verts_push([
                0, -2, 10,
                3, 5, 4,
                -3, 9, 4
            ]);

            this.verts_push([
                0, 0, -8,
                13, 0, -18,
                -13, 0, -18
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

            this.fishVertex.setX(v, v % 33)

        }

        this.scale( 0.2, 0.2, 0.2 );

    }

    verts_push (pos: number[]) {

        for ( let i = 0; i < pos.length; i+=3 ) {

            this.vertices.setXYZ(this.v, pos[ i ], pos[i + 1], pos[ i + 2]);

            this.v++

        }

    }

}