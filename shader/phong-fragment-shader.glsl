precision mediump float;
// Receive color and position values
varying vec3 fragColor;
varying vec4 fragPos;

varying vec3 normal;

varying vec3 lightPoses[3];
varying vec3 lightColors[3];
varying vec3 viewer;

const float shininess = 32.0;

const float kA = 1.0;
const float kD = 0.4;
const float kS = 0.3;

void main( void ) {
  // Phong lighting calculation
  vec3 n = normalize(normal);

  // ambient
  vec3 ambient = fragColor * kA;

  // diffuse
  float dot_d;

  // specular
  float dot_s;

  vec3 vertPos = vec3(fragPos);
  vec3 l = normalize(lightPoses[0] - vertPos); // direction vector from the point on the surface toward the light source

  float dot1 = dot(n, l);
  if (dot1 > 0.0) {
  	dot_d = kD * dot1;
  	vec3 r = reflect(l, n); // direction that a perfectly reflected ray of light would take from this point on the surface
    vec3 v = normalize(-vertPos); // direction pointing towards the viewer
  	float dot2 = dot(r, v);
  	if (dot2 > 0.0) dot_s = kS * pow(dot2, shininess);
  }

  vec3 diffuse = lightColors[0] * dot_d;
  vec3 specular = lightColors[0] * dot_s;

  gl_FragColor = vec4(ambient + diffuse + specular, 1.0 );
}
