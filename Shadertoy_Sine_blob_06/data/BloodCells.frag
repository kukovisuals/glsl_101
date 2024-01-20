
#version 150

#define SAMPLER0 sampler2D // sampler2D, sampler3D, samplerCube
#define SAMPLER1 sampler2D // sampler2D, sampler3D, samplerCube
#define SAMPLER2 sampler2D // sampler2D, sampler3D, samplerCube
#define SAMPLER3 sampler2D // sampler2D, sampler3D, samplerCube

uniform SAMPLER0 iChannel0; // image/buffer/sound    Sampler for input textures 0
uniform SAMPLER1 iChannel1; // image/buffer/sound    Sampler for input textures 1
uniform SAMPLER2 iChannel2; // image/buffer/sound    Sampler for input textures 2
uniform SAMPLER3 iChannel3; // image/buffer/sound    Sampler for input textures 3

uniform vec3  iResolution;           // image/buffer          The viewport resolution (z is pixel aspect ratio, usually 1.0)
uniform float iTime;                 // image/sound/buffer    Current time in seconds
uniform float iTimeDelta;            // image/buffer          Time it takes to render a frame, in seconds
uniform int   iFrame;                // image/buffer          Current frame
uniform float iFrameRate;            // image/buffer          Number of frames rendered per second
uniform vec4  iMouse;                // image/buffer          xy = current pixel coords (if LMB is down). zw = click pixel
uniform vec4  iDate;                 // image/buffer/sound    Year, month, day, time in seconds in .xyzw
uniform float iSampleRate;           // image/buffer/sound    The sound sample rate (typically 44100)
uniform float iChannelTime[4];       // image/buffer          Time for channel (if video or sound), in seconds
uniform vec3  iChannelResolution[4]; // image/buffer/sound    Input texture resolution for each channel

// Random number generator - a simple example
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord / iResolution.xy;

    // Increase the number of points
    const int numPoints = 40;
    vec2 points[numPoints];
    for (int i = 0; i < numPoints; i++) {
        points[i] = vec2(rand(vec2(i, i + 0.5)), rand(vec2(i + 0.5, i)));
    }

    // Find the two closest points
    float minDist = 1.0;
    float secondMinDist = 1.0;
    int closestPoint = 0;
    for (int i = 0; i < numPoints; i++) {
        float dist = distance(uv, points[i]);
        if (dist < minDist) {
            secondMinDist = minDist;
            minDist = dist;
            closestPoint = i;
        } else if (dist < secondMinDist) {
            secondMinDist = dist;
        }
    }

    // Determine if the pixel is on an edge
    bool onEdge = abs(minDist - secondMinDist) < 0.005; // Edge threshold

    // Assign color
    vec3 col;
    if (onEdge) {
        col = vec3(1.0, 0.0, 0.0); // Red for edges
    } else {
        // Assign a color based on the closest point (customize as needed)
        col = vec3(0.1, 0.1, 0.1);
    }

    fragColor = vec4(col, 1.0);
}

