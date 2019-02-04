precision mediump float;

uniform sampler2D sampler;
varying vec2 v_texCoord;

void main( void ) {
  // Read fragment color from texture
  gl_FragColor = texture2D(sampler, vec2(v_texCoord.s, v_texCoord.t));
}
