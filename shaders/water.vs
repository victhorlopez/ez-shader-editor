#define M_PI 3.1415926535897932384626433832795

precision highp float;
uniform mat4 u_mvp;
uniform mat4 u_model;
uniform mat4 u_viewprojection;
uniform float u_time;
attribute vec3 a_vertex;


void main()
{
        vec4 pos = u_model * vec4(a_vertex,1.0);
        float r = sqrt(pos.x*pos.x + pos.z*pos.z +  u_time* u_time);
        pos.y = 5.0 * sin(r )/r;
	gl_Position = u_viewprojection * pos; // world pos of the vertex
}