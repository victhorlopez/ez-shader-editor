#define M_PI 3.1415926535897932384626433832795

precision highp float;

uniform mat4 u_mvp;
uniform mat4 u_model;
uniform mat4 u_viewprojection;
uniform float u_time;

attribute vec3 a_vertex;

varying vec3 v_normal;

const float A = 5.0;

void main()
{
        vec4 pos = u_model * vec4(a_vertex,1.0);
        pos.y = A * (sin(pos.x + pos.z + u_time ));
	gl_Position = u_viewprojection * pos; // world pos of the vertex
        v_normal.x = A * cos(pos.x + pos.z + u_time);
        v_normal.z = v_normal.x;
        v_normal.y = pos.y;
}