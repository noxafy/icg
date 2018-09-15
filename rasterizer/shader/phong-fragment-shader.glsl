precision mediump float;
// Receive color and position values
varying vec3 fragColor;
varying vec4 fragPos;

varying vec3 normal;

struct PointLight {
  vec3 position;
  vec3 color;
  float intensity;

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;

  float constant;
  float linear;
  float quadratic;
};

#define NR_LIGHTS 3
uniform PointLight lights[NR_LIGHTS];

uniform vec3 kA;
uniform vec3 kD;
uniform vec3 kS;
uniform float shininess;

vec3 getPhongColor(PointLight light, vec3 n, vec3 vertPos);

void main( void ) {
  // Phong lighting calculation
  vec3 n = normalize(normal);
  vec3 vertPos = vec3(fragPos);

  vec3 res = vec3(0.0, 0.0, 0.0);
  for(int i = 0; i < NR_LIGHTS; i++) {
    PointLight light = lights[i];
    res += getPhongColor(light, n, vertPos);
  }
  gl_FragColor = vec4(res, 1.0);
}

vec3 getPhongColor(PointLight light, vec3 n, vec3 vertPos) {
  // ambient
  vec3 ambient = fragColor * light.ambient * kA;

  // diffuse
  float dot_d;
  vec3 diffuse;

  // specular
  float dot_s;
  vec3 specular;

  vec3 l = normalize(light.position - vertPos); // direction vector from the point on the surface toward the light source

  float dot1 = dot(n, l);
  if (dot1 > 0.0) {
  	dot_d = dot1;
  	diffuse = light.color * light.diffuse * kD * dot_d;
  	vec3 r = reflect(-l, n); // direction that a perfectly reflected ray of light would take from this point on the surface
    vec3 v = normalize(-vertPos); // direction pointing towards the viewer
  	float dot2 = dot(r, v);
  	if (dot2 > 0.0) {
  	  dot_s = pow(dot2, shininess);
  	  specular = light.color * light.specular * kS * dot_s;
  	}
  }

  float distance = length(light.position - vertPos);
  float attenuation = light.constant + light.linear * distance + light.quadratic * (distance * distance);
  return (ambient + diffuse + specular) * light.intensity / attenuation;
}