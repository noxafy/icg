// Pass color as attribute and forward it
// to the fragment shader
attribute vec3 a_color;
varying vec3 fragColor;

attribute vec3 a_normal;
varying vec3 v_normal;

// Pass the vertex position in view space
// to the fragment shader
attribute vec3 a_position;
varying vec4 fragPos;

varying vec3 lightPos;
varying vec3 lightColor;

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;
uniform mat4 N; // normal matrix

void main() {
  gl_Position = P * V * M * vec4( a_position, 1.0 );

  // Pass the color and transformed vertex position through
  fragColor = a_color;
  fragPos = gl_Position;
  lightPos = vec3(P * vec4(-5.0,5.0,-10.0, 1.0));
  lightColor = vec3(1,1,1);

  v_normal = (N * vec4(a_normal, 0)).xyz;
}
