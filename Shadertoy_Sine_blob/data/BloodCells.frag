
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

vec2 random2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 900.7)),
                          dot(p, vec2(269.5, 90.3)))) * 43758.5453);
}

float voronoi(vec2 uv) {
    vec2 g = floor(uv);
    vec2 f = fract(uv);

    float minDist = 1.0; // Start with a large distance
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 lattice = vec2(float(x), float(y));
            vec2 offset = random2(g + lattice);
            float dist = length(offset + lattice - f);
            minDist = min(minDist, dist);
        }
    }
    return  1.0 - smoothstep(0.0, 0.8, minDist); // Adjust 0.1 to control border thickness;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord / iResolution.xy;

     // Apply a wave distortion to the uv coordinates
    uv.x += sin(uv.y * 4.0 + iTime * 0.5) * 0.3; // Horizontal wave
    uv.y += sin(uv.x * 10.0 + iTime * 0.5) * 0.02; // Vertical wave


    // create a wave using a sin function 
    float wave = sin(uv.y * 10.0 + iTime * 0.3);

    float slowWave = sin(uv.y * 10.0 + iTime * 0.1); // 

    float middleWave = sin(uv.y * 10.0 + iTime * 0.2);

    // Calculate the Voronoi pattern
    float voronoiPattern = voronoi(uv);

    // Time varying pixel color
    vec3 col = vec3(slowWave, wave, wave) * 0.5 + 0.5;

    // Blend the Voronoi pattern with the wave colors
    col *= voronoiPattern;

    // Output to screen
    fragColor = vec4(col, 1.0);
}
