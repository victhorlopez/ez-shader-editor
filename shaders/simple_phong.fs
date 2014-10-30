precision highp float;

uniform vec4 u_color;
uniform vec3 u_light_dir;

varying vec3 v_normal;

uniform float u_ambient;

void main() 
{
        normalize(v_normal);
	vec3 L = normalize(u_light_dir);
	gl_FragColor = u_color * u_ambient + u_color * max(0.0, dot( L , v_normal));
}