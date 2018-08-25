// Pass color as attribute and forward it
// to the fragment shader
attribute vec3 a_color;
varying vec3 fragColor;

attribute vec3 a_normal;
varying vec3 normal;

// Pass the vertex position in view space
// to the fragment shader
attribute vec3 a_position;
varying vec4 fragPos;

#define NR_LIGHTS 1
uniform vec3 f_lightPoses[NR_LIGHTS];
varying vec3 lightPoses[NR_LIGHTS];

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;
uniform mat4 N; // normal matrix

void main() {
  gl_Position = P * V * M * vec4( a_position, 1.0 );

  // Pass the color and transformed vertex position through
  fragColor = a_color;
  fragPos = gl_Position;
  for (int i = 0; i < NR_LIGHTS; i++) {
    lightPoses[i] = vec3(P * vec4(f_lightPoses[i], 1.0));
  }

  normal = (N * vec4(a_normal, 0)).xyz;
}