attribute vec3 pos;
attribute vec3 tang;
attribute vec3 bitang;
attribute vec2 uv;

varying vec3 fragPos;
varying vec2 v_texCoord;
varying mat3 tbn;

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;
uniform mat4 N;

mat3 transpose(in mat3 inMatrix) {
    vec3 i0 = inMatrix[0];
    vec3 i1 = inMatrix[1];
    vec3 i2 = inMatrix[2];

    mat3 outMatrix = mat3(
        vec3(i0.x, i1.x, i2.x),
        vec3(i0.y, i1.y, i2.y),
        vec3(i0.z, i1.z, i2.z)
    );

    return outMatrix;
}

void main() {
  gl_Position = P * V * M * vec4( pos, 1.0 );
  vec3 norm = cross(bitang, tang);

  vec3 t = normalize(tang);
  vec3 b = normalize(bitang);
  vec3 n = normalize(norm);
  tbn = -transpose(mat3(N) * mat3(t, b, n));

  v_texCoord = uv;
  fragPos = vec3(gl_Position);
}
