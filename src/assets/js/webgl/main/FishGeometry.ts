import { BufferAttribute, BufferGeometry, Color } from "three";

export default class FishGeometry extends BufferGeometry {

    private WIDTH: number
    private FISHS: number
    private trianglesPerFish: number = 11
    private triangles: number
    private points: number
    private v: number = 0
    private w: number = 0
    private vertices: BufferAttribute
    private fishColors: BufferAttribute
    private references: BufferAttribute
    private fishVertex: BufferAttribute
    private fishNumber: BufferAttribute

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
        this.fishNumber = new BufferAttribute( new Float32Array( this.points ), 1 );

        this.setAttribute( 'position', this.vertices );
        this.setAttribute( 'fishColor', this.fishColors );
        this.setAttribute( 'reference', this.references );
        this.setAttribute( 'birdVertex', this.fishVertex );
        this.setAttribute( 'fishNumber', this.fishNumber );

        // this.setAttribute( 'normal', new Float32Array( points * 3 ), 3 );


        const wingsSpan = 15;

        for ( let f = 0; f < this.FISHS; f ++ ) {

            // Body

            /* this.verts_push([
                0, - 0, - 20,
                0, 4, - 20,
                0, 0, 30
            ]); */

            const rand = 0.2 + Math.random() * 0.7
            const randC = Math.random()
            let randR = 0.5 
            let randG = 0.5
            let randB = 0.5

            if (randC < 0.1) {
                randR = 1
                randG = 1
                randB = 1
            } else if (randC < 0.5) {
                randR = 0.5
                randG = 0.5
                randB = 0.9
            } else if (randC < 0.8) {
                randR = 1
                randG = 0.8
                randB = 1
            } else {
                randR = 0.4
                randG = 0.4
                randB = 0.6
            }

            const factorTop = 0.8
            const factorMed = 1
            const factorBot = 0.8

            this.verts_push([
                0, 0, 20 + 6 * rand,
                10, 0, 12,
                0, 6 * rand, 12
            ]);

            this.colors_push([
                factorMed*randR,factorMed*randG,factorMed*randB,
                factorTop*randR, factorTop*randG, factorTop*randB,
                factorMed*randR,factorMed*randG,factorMed*randB,
            ])

            this.verts_push([
                0, 0, 20 + 6 * rand,
                0, -6 * rand, 12,
                10, 0, 12
            ]);

            this.colors_push([
                factorMed*randR,factorMed*randG,factorMed*randB,
                factorMed*randR,factorMed*randG,factorMed*randB,
                factorTop*randR, factorTop*randG, factorTop*randB,
            ])

            this.verts_push([
                0, 0, 20 + 6 * rand,
                -6 * rand, 0, 12,
                0, -6 * rand, 12
            ]);

            this.colors_push([
                factorMed*randR,factorMed*randG,factorMed*randB,
                factorBot*randR, factorBot*randG, factorBot*randB,
                factorMed*randR,factorMed*randG,factorMed*randB,
            ])

            this.verts_push([
                0, 0, 20 + 6 * rand,
                0, 6 * rand, 12,
                -6 * rand, 0, 12
            ]);

            this.colors_push([
                factorMed*randR,factorMed*randG,factorMed*randB,
                factorMed*randR,factorMed*randG,factorMed*randB,
                factorBot*randR, factorBot*randG, factorBot*randB,
            ])



            this.verts_push([
                0, 0, -12,
                0, 6 * rand, 12,
                10, 0, 12
            ]);

            this.colors_push([
                factorMed*randR,factorMed*randG,factorMed*randB,
                factorMed*randR,factorMed*randG,factorMed*randB,
                factorTop*randR, factorTop*randG, factorTop*randB,
            ])

            this.verts_push([
                0, 0, -12,
                10, 0, 12,
                0, -6 * rand, 12
            ]);

            this.colors_push([
                factorMed*randR,factorMed*randG,factorMed*randB,
                factorTop*randR, factorTop*randG, factorTop*randB,
                factorMed*randR,factorMed*randG,factorMed*randB,
            ])

            this.verts_push([
                0, 0, -12,
                0, -6 * rand, 12,
                -6 * rand, 0, 12
            ]);

            this.colors_push([
                factorMed*randR,factorMed*randG,factorMed*randB,
                factorMed*randR,factorMed*randG,factorMed*randB,
                factorBot*randR, factorBot*randG, factorBot*randB,
            ])

            this.verts_push([
                0, 0, -12,
                -6 * rand, 0, 12,
                0, 6 * rand, 12
            ]);

            this.colors_push([
                factorMed*randR,factorMed*randG,factorMed*randB,
                factorBot*randR, factorBot*randG, factorBot*randB,
                factorMed*randR,factorMed*randG,factorMed*randB,
            ])
            


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

            this.colors_push([
                factorMed*randR,factorMed*randG,factorMed*randB,
                factorTop*randR, factorTop*randG, factorTop*randB,
                factorBot*randR, factorBot*randG, factorBot*randB,
            ])

            this.verts_push([
                0, -2, 10,
                3, 5, 4,
                -3, 9, 4
            ]);

            this.colors_push([
                factorMed*randR,factorMed*randG,factorMed*randB,
                factorTop*randR, factorTop*randG, factorTop*randB,
                factorBot*randR, factorBot*randG, factorBot*randB,
            ])

            this.verts_push([
                0, 0, -8,
                13, 0, -18,
                -13, 0, -18
            ]);

            this.colors_push([
                factorMed*randR*0.8,factorMed*randG*0.8,factorMed*randB*0.8,
                factorTop*randR, factorTop*randG, factorTop*randB,
                factorBot*randR, factorBot*randG, factorBot*randB,
            ])

        }

        for ( let v = 0; v < this.triangles * 3; v ++ ) {

            const triangleIndex = ~ ~ ( v / 3 );
            const fishIndex = ~ ~ ( triangleIndex / this.trianglesPerFish );
            const x = ( fishIndex % this.WIDTH ) / this.WIDTH;
            const y = ~ ~ ( fishIndex / this.WIDTH ) / this.WIDTH;

            this.references.setXY(v, x, y)

            this.fishVertex.setX(v, v % 33)

            this.fishNumber.setX(v, Math.round(v / 33))

        }

        this.scale( 0.2, 0.2, 0.2 );

    }

    verts_push (pos: number[]) {

        for ( let i = 0; i < pos.length; i+=3 ) {

            this.vertices.setXYZ(this.v, pos[ i ], pos[i + 1], pos[ i + 2]);

            this.v++

        }

    }

    colors_push (color: number[]) {

        for ( let i = 0; i < color.length; i+=3 ) {

            this.fishColors.setXYZ(this.w, color[ i ], color[i + 1], color[ i + 2]);

            this.w++

        }

    }

}