precision highp float;
uniform vec4 u_color;
uniform vec3 u_light_dir;
uniform sampler2D u_texture;
uniform float u_ambient;

varying vec3 v_normal;
varying vec2 v_coord;

const float c_ambient = 0.1;

void main() 
{
        normalize(v_normal);
	vec3 L = normalize(u_light_dir);
	gl_FragColor = u_color * u_ambient + u_color * texture2D( u_texture, v_coord) * max(0.0, dot( L , v_normal));
}