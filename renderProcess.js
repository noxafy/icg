/**
 * Author: noxafy
 * Created: 02.09.18
 */
const pvsContent = "// Pass color as attribute and forward it\n" +
	"// to the fragment shader\n" +
	"attribute vec3 a_color;\n" +
	"varying vec3 fragColor;\n" +
	"\n" +
	"attribute vec3 a_normal;\n" +
	"varying vec3 normal;\n" +
	"\n" +
	"// Pass the vertex position in view space\n" +
	"// to the fragment shader\n" +
	"attribute vec3 a_position;\n" +
	"varying vec4 fragPos;\n" +
	"\n" +
	"uniform mat4 M; // model matrix\n" +
	"uniform mat4 V; // view matrix\n" +
	"uniform mat4 P; // projection matrix\n" +
	"uniform mat4 N; // normal matrix\n" +
	"\n" +
	"void main() {\n" +
	"  gl_Position = P * V * M * vec4( a_position, 1.0 );\n" +
	"\n" +
	"  // Pass the color and transformed vertex position through\n" +
	"  fragColor = a_color;\n" +
	"  fragPos = gl_Position;\n" +
	"  normal = (P * N * vec4(a_normal, 0)).xyz;\n" +
	"}";
const pfsContent = "precision mediump float;\n" +
	"// Receive color and position values\n" +
	"varying vec3 fragColor;\n" +
	"varying vec4 fragPos;\n" +
	"\n" +
	"varying vec3 normal;\n" +
	"\n" +
	"struct PointLight {\n" +
	"  vec3 position;\n" +
	"  vec3 color;\n" +
	"  float intensity;\n" +
	"\n" +
	"  vec3 ambient;\n" +
	"  vec3 diffuse;\n" +
	"  vec3 specular;\n" +
	"\n" +
	"  float constant;\n" +
	"  float linear;\n" +
	"  float quadratic;\n" +
	"};\n" +
	"\n" +
	"#define NR_LIGHTS 1\n" +
	"uniform PointLight lights[NR_LIGHTS];\n" +
	"\n" +
	"uniform vec3 kA;\n" +
	"uniform vec3 kD;\n" +
	"uniform vec3 kS;\n" +
	"uniform float shininess;\n" +
	"\n" +
	"vec3 getPhongColor(PointLight light, vec3 n, vec3 vertPos);\n" +
	"\n" +
	"void main( void ) {\n" +
	"  // Phong lighting calculation\n" +
	"  vec3 n = normalize(normal);\n" +
	"  vec3 vertPos = vec3(fragPos);\n" +
	"\n" +
	"  vec3 res = vec3(0.0, 0.0, 0.0);\n" +
	"  for(int i = 0; i < NR_LIGHTS; i++) {\n" +
	"    PointLight light = lights[i];\n" +
	"    res += getPhongColor(light, n, vertPos);\n" +
	"  }\n" +
	"  gl_FragColor = vec4(res, 1.0);\n" +
	"}\n" +
	"\n" +
	"vec3 getPhongColor(PointLight light, vec3 n, vec3 vertPos) {\n" +
	"  // ambient\n" +
	"  vec3 ambient = fragColor * light.ambient * kA;\n" +
	"\n" +
	"  // diffuse\n" +
	"  float dot_d;\n" +
	"  vec3 diffuse;\n" +
	"\n" +
	"  // specular\n" +
	"  float dot_s;\n" +
	"  vec3 specular;\n" +
	"\n" +
	"  vec3 l = normalize(light.position - vertPos); // direction vector from the point on the surface toward the light source\n" +
	"\n" +
	"  float dot1 = dot(n, l);\n" +
	"  if (dot1 > 0.0) {\n" +
	"  \tdot_d = dot1;\n" +
	"  \tdiffuse = light.color * light.diffuse * kD * dot_d;\n" +
	"  \tvec3 r = reflect(-l, n); // direction that a perfectly reflected ray of light would take from this point on the surface\n" +
	"    vec3 v = normalize(-vertPos); // direction pointing towards the viewer\n" +
	"  \tfloat dot2 = dot(r, v);\n" +
	"  \tif (dot2 > 0.0) {\n" +
	"  \t  dot_s = pow(dot2, shininess);\n" +
	"  \t  specular = light.color * light.specular * kS * dot_s;\n" +
	"  \t}\n" +
	"  }\n" +
	"\n" +
	"  float distance = length(light.position - vertPos);\n" +
	"  float attenuation = light.constant + light.linear * distance + light.quadratic * (distance * distance);\n" +
	"  return (ambient + diffuse + specular) * light.intensity / attenuation;\n" +
	"}";
const tvsContent = "attribute vec3 a_position;\n" +
	"attribute vec2 a_texCoord;\n" +
	"varying vec2 v_texCoord;\n" +
	"\n" +
	"uniform mat4 M;\n" +
	"uniform mat4 V;\n" +
	"uniform mat4 P;\n" +
	"\n" +
	"void main() {\n" +
	"  gl_Position = P * V * M * vec4( a_position, 1.0 );\n" +
	"  v_texCoord = a_texCoord;\n" +
	"}\n";
const tfsContent = "precision mediump float;\n" +
	"\n" +
	"uniform sampler2D sampler;\n" +
	"varying vec2 v_texCoord;\n" +
	"\n" +
	"void main( void ) {\n" +
	"  // Read fragment color from texture\n" +
	"  gl_FragColor = texture2D(sampler, vec2(v_texCoord.s, v_texCoord.t));\n" +
	"}\n";

class RenderProcess {

	constructor() {
		this.onStop = undefined;
	}

	start() {
		if (Preferences.canvas.useRasterRenderer) {
			this.startRasterizer();
		} else {
			this.startRayTracer();
		}
	}

	startRasterizer() {
		const rasterizer = Preferences.canvas.rasterizer;
		const gl = rasterizer.getContext("webgl");

		const setupVisitor = new RasterSetupVisitor(gl);
		setupVisitor.setup(window.sg);

		const phongShader = new Shader(gl,
			"rasterizer/shader/phong-vertex-perspective-shader.glsl",
			"rasterizer/shader/phong-fragment-shader.glsl"
		);
		const textureShader = new Shader(gl,
			"rasterizer/shader/texture-vertex-perspective-shader.glsl",
			"rasterizer/shader/texture-fragment-shader.glsl"
		);
		this.renderer = new RasterRenderer(gl, phongShader, textureShader);

		Promise.all(
			[ phongShader.load(pvsContent, pfsContent), textureShader.load(tvsContent, tfsContent) ]
		).then(x =>
			window.requestAnimationFrame(window.run)
		);

		this.lastTimestamp = performance.now();
	}

	startRayTracer() {
		const raytracer = Preferences.canvas.raytracer;
		this.renderer = new RayTracingRenderer(raytracer.getContext("2d"), raytracer.width, raytracer.height);
		this.lastTimestamp = performance.now();
		window.requestAnimationFrame(window.run);
	}

	stop(cb) {
		this.onStop = cb || function () {
		};
	}
}