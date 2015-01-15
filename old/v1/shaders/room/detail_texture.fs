precision highp float;
uniform vec4 u_color;
uniform vec4 u_light_color;
uniform vec3 u_eye;
uniform sampler2D u_texture;
uniform sampler2D u_ambient_texture;
uniform sampler2D u_detail_texture;

varying vec3 v_normal;
varying vec3 v_pos;
varying vec2 v_coord;


void main() 
{
        normalize(v_normal);
        vec4 tex_color = texture2D(u_ambient_texture, v_coord);
        //vec4 detail_color = texture2D(u_detail_texture, v_coord );
	gl_FragColor = u_color * tex_color ;
}