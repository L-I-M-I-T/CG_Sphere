//vertex shader
#version 330 core
layout(location = 0) in vec3 Pos;
layout(location = 1) in vec3 Color;
layout(location = 2) in vec3 Normal;
layout(location = 3) in vec2 Tex;
uniform mat4 Projection;
uniform mat4 View;
uniform mat4 Model;
out vec3 vertexColor;
out vec3 vertexNormal;
out vec3 vertexPos;
out vec2 vertexTex;

void main()
{
	gl_Position = Projection * View * Model * vec4(Pos.x, Pos.y, Pos.z, 1.0);
	vertexColor = Color;
	vertexNormal = mat3(transpose(inverse(Model)))*Normal;
	vertexPos = vec3(Model * vec4(Pos, 1.0));
	vertexTex = Tex;
}