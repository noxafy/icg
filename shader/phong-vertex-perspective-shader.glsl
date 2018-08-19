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

uniform vec3 f_lightPoses[3];
uniform vec3 f_lightColors[3];
varying vec3 lightPoses[3];
varying vec3 lightColors[3];
varying vec3 viewer;

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;
uniform mat4 N; // normal matrix

void main() {
  gl_Position = P * V * M * vec4( a_position, 1.0 );

  // Pass the color and transformed vertex position through
  fragColor = a_color;
  fragPos = gl_Position;
  lightPoses[0] = vec3(P * vec4(f_lightPoses[0], 1.0));
  lightPoses[1] = vec3(P * vec4(f_lightPoses[1], 1.0));
  lightPoses[2] = vec3(P * vec4(f_lightPoses[2], 1.0));
  lightColors[0] = f_lightColors[0];
  lightColors[1] = f_lightColors[1];
  lightColors[2] = f_lightColors[2];
  viewer = vec3(P * V * vec4(0, 0, 0, 1));

  normal = (N * vec4(a_normal, 0)).xyz;
}
