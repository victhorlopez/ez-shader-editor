precision highp float;
uniform vec4 u_color;
uniform vec3 u_light_dir;
uniform float u_ambient;

uniform sampler2D u_color_texture;
uniform sampler2D u_normal_texture;
uniform sampler2D u_specular_texture;

varying vec3 v_normal;
varying vec3 v_pos;
varying vec2 v_coord;


void main() 
{
        vec3 L = normalize(u_light_dir);
        normalize(v_normal);
        vec4 tex_color = texture2D(u_color_texture, v_coord);
        vec4 normal = texture2D(u_normal_texture, v_coord );
        vec4 specular = texture2D(u_specular_texture, v_coord );

        gl_FragColor = u_color * u_ambient * tex_color + u_color * tex_color * max(0.0, dot( L , v_normal));
}