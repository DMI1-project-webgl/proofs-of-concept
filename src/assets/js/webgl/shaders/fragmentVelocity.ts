export const fragmentVelocityShader =
`uniform float time;
uniform float testing;
uniform float delta; // about 0.016
uniform float separationDistance; // 20
uniform float alignmentDistance; // 40
uniform float cohesionDistance; //
uniform float freedomFactor;
uniform vec3 predator;
uniform vec3 predator2;

const float width = resolution.x;
const float height = resolution.y;

const float PI = 3.141592653589793;
const float PI_2 = PI * 2.0;
// const float VISION = PI * 0.55;

float zoneRadius = 40.0;
float zoneRadiusSquared = 1600.0;

float separationThresh = 0.45;
float alignmentThresh = 0.65;

const float UPPER_BOUNDS = BOUNDS; // 800
const float LOWER_BOUNDS = -UPPER_BOUNDS;

const float SPEED_LIMIT = 3.0;

float rand( vec2 co ){
    return fract( sin( dot( co.xy, vec2(12.9898,78.233) ) ) * 43758.5453 );
}

void main() {

    zoneRadius = separationDistance + alignmentDistance + cohesionDistance;
    separationThresh = separationDistance / zoneRadius;
    alignmentThresh = ( separationDistance + alignmentDistance ) / zoneRadius;
    zoneRadiusSquared = zoneRadius * zoneRadius;


    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 birdPosition, birdVelocity;

    vec3 selfPosition = texture2D( texturePosition, uv ).xyz;
    vec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;

    float dist;
    float dist2;
    vec3 dir; // direction
    vec3 dir2; // direction
    float distSquared; // mouse
    float distSquared2; // center sphere

    float separationSquared = separationDistance * separationDistance;
    float cohesionSquared = cohesionDistance * cohesionDistance;

    float f;
    float percent;

    vec3 velocity = selfVelocity;

    float limit = SPEED_LIMIT;

    dir = predator * UPPER_BOUNDS - selfPosition;
    dir2 = predator2 * UPPER_BOUNDS - selfPosition;
    dir.z = 0.;
    // dir2.z = 0.;
    // dir.z *= 0.6;
    dist = length( dir );
    dist2 = length( dir2 );
    distSquared = dist * dist;
    distSquared2 = dist2 * dist2;

    float preyRadius = 200.0; // radius of sphere (base 150.0)
    float preyRadiusSq = preyRadius * preyRadius;


    // move birds away from predator
    if ( dist < preyRadius ) {

        f = ( distSquared / preyRadiusSq - 1.0 ) * delta * 80.;
        velocity += normalize( dir ) * f;
        limit += 1.0;
    }

    if ( dist2 < preyRadius ) {

        // f = ( distSquared2 / preyRadiusSq - 1.0 ) * delta * 100.;
        // velocity += normalize( dir2 ) * f;
        // limit += 5.0;
    }


    // if (testing == 0.0) {}
    // if ( rand( uv + time ) < freedomFactor ) {}


    // Attract flocks to the center
    vec3 central = vec3( 0., 0., 0. );
    dir = selfPosition - central;
    dist = length( dir );

    // dir.x *= 2.5;
    dir.y *= 2.5;
    // dir.z *= 2.5;
    // velocity -= normalize( dir ) * delta * 5.;

    float distanceToCenter = length( selfPosition );
    float maxR = 164.0;
    float minR = 160.0;

    float onSphere = - step(maxR,distanceToCenter) + step(-maxR,distanceToCenter) - 1.0 - step(minR,distanceToCenter) + step(-minR,distanceToCenter); // -1 si trop loin | 1 si trop proche | 0 dans le perimetre
    float mult = 0.1 * max(0.0,abs(distanceToCenter - minR + 2.0) - 0.0);

    velocity.x = velocity.x + onSphere * (step(0.0,selfPosition.x) - 0.5) * mult * abs(selfPosition.x) * 0.01 + sin(time * 0.0005 + step(0.0,selfPosition.y) * PI) * 1.;
    velocity.y = velocity.y + onSphere * (step(0.0,selfPosition.y) - 0.5) * mult * abs(selfPosition.y) * 0.01;
    velocity.z = velocity.z + onSphere * (step(0.0,selfPosition.z) - 0.5) * mult * abs(selfPosition.z) * 0.01 + cos(time * 0.0005 + step(0.0,selfPosition.y) * PI) * 1.;


    for ( float y = 0.0; y < height; y++ ) {
        for ( float x = 0.0; x < width; x++ ) {

            vec2 ref = vec2( x + 0.5, y + 0.5 ) / resolution.xy;
            birdPosition = texture2D( texturePosition, ref ).xyz;

            dir = birdPosition - selfPosition;
            dist = length( dir );

            if ( dist < 0.0001 ) continue;

            distSquared = dist * dist;

            if ( distSquared > zoneRadiusSquared ) continue;

            percent = distSquared / zoneRadiusSquared;

            if ( percent < separationThresh ) { // low

                // Separation - Move apart for comfort
                f = ( separationThresh / percent - 1.0 ) * delta;
                velocity -= normalize( dir ) * f;

            } else if ( percent < alignmentThresh ) { // high

                // Alignment - fly the same direction
                float threshDelta = alignmentThresh - separationThresh;
                float adjustedPercent = ( percent - separationThresh ) / threshDelta;

                birdVelocity = texture2D( textureVelocity, ref ).xyz;

                f = ( 0.5 - cos( adjustedPercent * PI_2 ) * 0.5 + 0.5 ) * delta;
                velocity += normalize( birdVelocity ) * f;

            } else {

                // Attraction / Cohesion - move closer
                float threshDelta = 1.0 - alignmentThresh;
                float adjustedPercent;
                if( threshDelta == 0. ) adjustedPercent = 1.;
                else adjustedPercent = ( percent - alignmentThresh ) / threshDelta;

                f = ( 0.5 - ( cos( adjustedPercent * PI_2 ) * -0.5 + 0.5 ) ) * delta;

                velocity += normalize( dir ) * f;

            }

        }

    }

    if (distanceToCenter < minR) {
        velocity.x = velocity.x + 1.0 * (step(0.0,selfPosition.x) - 0.5);
        velocity.y = velocity.y + 1.0 * (step(0.0,selfPosition.y) - 0.5);
        velocity.z = velocity.z + 1.0 * (step(0.0,selfPosition.z) - 0.5);
    }
    


    // this make tends to fly around than down or up
    // if (velocity.y > 0.) velocity.y *= (1. - 0.2 * delta);

    // Speed Limits
    if ( length( velocity ) > limit ) {
        velocity = normalize( velocity ) * limit;
    }

    gl_FragColor = vec4( velocity, 1.0 );

}`