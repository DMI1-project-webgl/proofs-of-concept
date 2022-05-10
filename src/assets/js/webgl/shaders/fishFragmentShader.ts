export const fishFragmentShader = `varying vec4 vColor;
varying float z;

uniform vec3 color;

void main() {
    // Fake colors for now
    float z2 = 0.2 + ( 1000. - z ) / 1000. * vColor.x;
    gl_FragColor = vec4( vColor.x + 0.5, 0.2 + vColor.y, 0.2 + vColor.z, 1. );

}
`