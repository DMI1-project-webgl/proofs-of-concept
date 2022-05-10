export const fishVertexShader = `attribute vec2 reference;
attribute float birdVertex;

attribute vec3 birdColor;

uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;

varying vec4 vColor;
varying float z;

uniform float time;

void main() {

    vec4 tmpPos = texture2D( texturePosition, reference );
    vec3 pos = tmpPos.xyz;
    vec3 velocity = normalize(texture2D( textureVelocity, reference ).xyz);

    vec3 newPosition = position;

    if ( birdVertex == 25.0 || birdVertex == 26.0) {
        // flap wings
        newPosition.y = (sin( tmpPos.w * 2.5 + 3.14) + 1.0) * 1.;
    }

    if ( birdVertex == 28.0 || birdVertex == 29.0 ) {
        // flap wings
        newPosition.y = (sin( tmpPos.w * 2.5) - 1.0) * 1.;
    }

    if ( birdVertex == 31.0 || birdVertex == 32.0 ) {
        // flap wings
        newPosition.y = sin( tmpPos.w * 1.5) * 1.;
    }

    newPosition = mat3( modelMatrix ) * newPosition;


    velocity.z *= -1.;
    float xz = length( velocity.xz );
    float xyz = 1.;
    float x = sqrt( 1. - velocity.y * velocity.y );

    float cosry = velocity.x / xz;
    float sinry = velocity.z / xz;

    float cosrz = x / xyz;
    float sinrz = velocity.y / xyz;

    mat3 maty =  mat3(
        cosry, 0, -sinry,
        0    , 1, 0     ,
        sinry, 0, cosry

    );

    mat3 matz =  mat3(
        cosrz , sinrz, 0,
        -sinrz, cosrz, 0,
        0     , 0    , 1
    );

    newPosition =  maty * matz * newPosition;
    newPosition += pos;

    z = newPosition.z;

    vColor = vec4( birdColor, 1.0 );

    if ( birdVertex == 28.0 || birdVertex == 29.0 || birdVertex == 31.0 || birdVertex == 32.0) {
        vColor = vec4( 1.0, 0.5, 0.5, 1.0 );
    }

    gl_Position = projectionMatrix *  viewMatrix  * vec4( newPosition, 1.0 );
}`
