precision highp float;
uniform mat4 u_mvp;
attribute vec3 a_vertex;
void main()
{
	gl_Position = u_mvp * vec4(a_vertex,1.0); // world pos of the vertex
}