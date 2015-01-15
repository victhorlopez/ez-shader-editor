precision highp float;

uniform vec4 u_color;
uniform vec4 u_light_color;
uniform vec3 u_light_dir;
uniform vec3 u_eye;

varying vec3 v_normal;
varying vec3 v_pos;
varying vec2 v_coord;

const float c_ambient = 0.1;

void main() 
{
        normalize(v_normal);
	vec3 L = normalize(u_light_dir);
        float D =  max(0.0, dot( L , v_normal)); // diffuse component
        
        vec3 point_to_eye = normalize( u_eye - v_pos);
        vec3 H = reflect(-L,v_normal); // vector reflected in the incident point
        float E = pow(max(0.0, dot( H , point_to_eye)),8.0); // the close the dot is to 1 the shiner
	gl_FragColor = u_color * c_ambient + u_color * D + u_light_color * E;
}