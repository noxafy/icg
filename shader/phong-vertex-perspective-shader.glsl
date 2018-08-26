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

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;
uniform mat4 N; // normal matrix

void main() {
  gl_Position = P * V * M * vec4( a_position, 1.0 );

  // Pass the color and transformed vertex position through
  fragColor = a_color;
  fragPos = gl_Position;
  normal = (N * vec4(a_normal, 0)).xyz;
}