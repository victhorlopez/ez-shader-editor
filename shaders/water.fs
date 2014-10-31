precision highp float;

uniform vec4 u_color;
uniform vec3 u_light_dir;
uniform float u_ambient;

varying vec3 v_normal;

void main() 
{
	gl_FragColor = u_color ;
        vec3 L = normalize(u_light_dir);
        vec3 N = normalize(v_normal);
	gl_FragColor = u_color * u_ambient + u_color * max(0.0, dot( L , N));
}